"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORIES, CONDITION_ORDER } from "@/lib/listing-search";
import { COLORS, HARDWARE, INCLUSIONS, MATERIALS, WEAR_ZONES } from "@/lib/listing-options";
import { logAudit } from "@/lib/audit";
import { bewaarFoto, cloudOpslagActief, TOEGESTANE_TYPES } from "@/lib/storage";
import { t } from "@/lib/i18n";
import type { WearZone } from "@/generated/prisma/client";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB

const leeg = (v: FormDataEntryValue | null) => {
  const s = typeof v === "string" ? v.trim() : "";
  return s === "" ? undefined : s;
};

const listingSchema = z.object({
  title: z.string().min(5, t.verkopen.fouten.titel).max(120),
  model: z.string().max(80).optional(),
  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: t.verkopen.fouten.categorie,
  }),
  condition: z.enum(CONDITION_ORDER as unknown as [string, ...string[]], { message: t.verkopen.fouten.conditie }),
  productionYear: z.coerce
    .number()
    .int()
    .min(1910, t.verkopen.fouten.jaarOngeldig)
    .max(new Date().getFullYear(), t.verkopen.fouten.jaarToekomst)
    .optional(),
  color: z.enum(COLORS as unknown as [string, ...string[]]).optional(),
  material: z.enum(MATERIALS as unknown as [string, ...string[]]).optional(),
  hardware: z.enum(HARDWARE as unknown as [string, ...string[]]).optional(),
  dimensions: z.string().max(120).optional(),
  priceEuro: z.coerce
    .number({ message: t.verkopen.fouten.prijsOngeldig })
    .min(50, t.verkopen.fouten.prijsMin)
    .max(100000, t.verkopen.fouten.prijsMax),
  description: z.string().min(30, t.verkopen.fouten.beschrijving).max(4000),
  allowOffers: z.boolean(),
});

export type ListingFormState = { error?: string } | undefined;

export async function createListingAction(_prev: ListingFormState, formData: FormData): Promise<ListingFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const parsed = listingSchema.safeParse({
    title: formData.get("title"),
    model: leeg(formData.get("model")),
    category: formData.get("category"),
    condition: formData.get("condition"),
    productionYear: leeg(formData.get("productionYear")),
    color: leeg(formData.get("color")),
    material: leeg(formData.get("material")),
    hardware: leeg(formData.get("hardware")),
    dimensions: leeg(formData.get("dimensions")),
    priceEuro: formData.get("priceEuro"),
    description: formData.get("description"),
    allowOffers: formData.get("allowOffers") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Inclusies en slijtage per zone
  const inclusions = formData
    .getAll("inclusions")
    .filter((v): v is string => typeof v === "string" && (INCLUSIONS as readonly string[]).includes(v));

  const wearNotes = WEAR_ZONES.map((zone) => ({
    zone: zone as WearZone,
    note: leeg(formData.get(`wear_${zone}`)),
  })).filter((w): w is { zone: WearZone; note: string } => Boolean(w.note));

  // Foto's valideren vóór er iets wordt opgeslagen
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { error: t.verkopen.fouten.geenFoto };
  }
  if (files.length > MAX_PHOTOS) {
    return { error: t.verkopen.fouten.teVeelFotos(MAX_PHOTOS) };
  }
  for (const file of files) {
    if (!(file.type in TOEGESTANE_TYPES)) {
      return { error: t.verkopen.fouten.fotoType };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: t.verkopen.fouten.fotoGrootte };
    }
  }

  // Foto's eerst opslaan, pas daarna de listing aanmaken. Mislukt het opslaan,
  // dan komt er geen halve listing zonder foto's in de database te staan.
  let urls: string[];
  try {
    urls = await Promise.all(files.map((file) => bewaarFoto(file)));
  } catch (fout) {
    console.error("Foto opslaan mislukt", fout);
    return { error: cloudOpslagActief() ? t.verkopen.fouten.fotoOpslaan : t.verkopen.fouten.fotoOpslaanLokaal };
  }

  const sellerId = session.user.id;
  const listing = await prisma.listing.create({
    data: {
      sellerId,
      title: parsed.data.title,
      model: parsed.data.model ?? null,
      category: parsed.data.category,
      condition: parsed.data.condition as never,
      productionYear: parsed.data.productionYear ?? null,
      color: parsed.data.color ?? null,
      material: parsed.data.material ?? null,
      hardware: parsed.data.hardware ?? null,
      dimensions: parsed.data.dimensions ?? null,
      inclusions,
      priceCents: Math.round(parsed.data.priceEuro * 100),
      description: parsed.data.description,
      allowOffers: parsed.data.allowOffers,
      status: "ACTIVE",
      photos: { create: urls.map((url, i) => ({ url, position: i })) },
      wearNotes: { create: wearNotes },
    },
  });
  await logAudit(prisma, {
    entityType: "LISTING",
    entityId: listing.id,
    action: "CREATED",
    toValue: "ACTIVE",
    note: `${listing.title} · ${Math.round(listing.priceCents / 100)} EUR · ${files.length} photos`,
    actorId: sellerId,
  });

  redirect(`/listing/${listing.id}`);
}
