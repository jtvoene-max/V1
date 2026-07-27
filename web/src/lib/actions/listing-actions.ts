"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/listing-search";
import { logAudit } from "@/lib/audit";
import { t } from "@/lib/i18n";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const listingSchema = z.object({
  title: z.string().min(5, t.verkopen.fouten.titel).max(120),
  model: z.string().max(80).optional(),
  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: t.verkopen.fouten.categorie,
  }),
  condition: z.enum(["EXCELLENT", "GOOD", "VISIBLE_WEAR"], { message: t.verkopen.fouten.conditie }),
  productionYear: z.coerce
    .number()
    .int()
    .min(1910, t.verkopen.fouten.jaarOngeldig)
    .max(new Date().getFullYear(), t.verkopen.fouten.jaarToekomst)
    .optional(),
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
    model: formData.get("model") || undefined,
    category: formData.get("category"),
    condition: formData.get("condition"),
    productionYear: formData.get("productionYear") || undefined,
    priceEuro: formData.get("priceEuro"),
    description: formData.get("description"),
    allowOffers: formData.get("allowOffers") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Foto's valideren vóór er iets wordt opgeslagen
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return { error: t.verkopen.fouten.geenFoto };
  }
  if (files.length > MAX_PHOTOS) {
    return { error: t.verkopen.fouten.teVeelFotos(MAX_PHOTOS) };
  }
  for (const file of files) {
    if (!(file.type in ALLOWED_TYPES)) {
      return { error: t.verkopen.fouten.fotoType };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: t.verkopen.fouten.fotoGrootte };
    }
  }

  // Opslaan in public/uploads (lokaal; cloud-opslag komt bij de hosting-milestone)
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    const name = `${crypto.randomUUID()}${ALLOWED_TYPES[file.type]}`;
    await writeFile(path.join(uploadDir, name), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${name}`);
  }

  const sellerId = session.user.id;
  const listing = await prisma.listing.create({
    data: {
      sellerId,
      title: parsed.data.title,
      model: parsed.data.model ?? null,
      category: parsed.data.category,
      condition: parsed.data.condition,
      productionYear: parsed.data.productionYear ?? null,
      priceCents: Math.round(parsed.data.priceEuro * 100),
      description: parsed.data.description,
      allowOffers: parsed.data.allowOffers,
      status: "ACTIVE",
      photos: { create: urls.map((url, i) => ({ url, position: i })) },
    },
  });
  await logAudit(prisma, {
    entityType: "LISTING",
    entityId: listing.id,
    action: "CREATED",
    toValue: "ACTIVE",
    note: `${listing.title} · ${Math.round(listing.priceCents / 100)} EUR · ${files.length} foto's`,
    actorId: sellerId,
  });

  redirect(`/listing/${listing.id}`);
}
