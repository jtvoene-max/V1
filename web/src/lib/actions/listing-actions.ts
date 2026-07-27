"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORIES } from "@/lib/listing-search";

const MAX_PHOTOS = 8;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const listingSchema = z.object({
  title: z.string().min(5, "Titel moet minimaal 5 tekens zijn").max(120),
  model: z.string().max(80).optional(),
  category: z.enum(CATEGORIES.map((c) => c.value) as [string, ...string[]], {
    message: "Kies een categorie",
  }),
  condition: z.enum(["EXCELLENT", "GOOD", "VISIBLE_WEAR"], { message: "Kies een conditie" }),
  productionYear: z.coerce
    .number()
    .int()
    .min(1910, "Ongeldig jaartal")
    .max(new Date().getFullYear(), "Jaartal kan niet in de toekomst liggen")
    .optional(),
  priceEuro: z.coerce
    .number({ message: "Vul een geldige prijs in" })
    .min(50, "Minimale vraagprijs is 50 euro")
    .max(100000, "Neem voor items boven 100.000 euro contact met ons op"),
  description: z.string().min(30, "Beschrijf het item in minimaal 30 tekens").max(4000),
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
    return { error: "Voeg minimaal 1 foto toe" };
  }
  if (files.length > MAX_PHOTOS) {
    return { error: `Maximaal ${MAX_PHOTOS} foto's per item` };
  }
  for (const file of files) {
    if (!(file.type in ALLOWED_TYPES)) {
      return { error: "Alleen JPG-, PNG- of WebP-foto's zijn toegestaan" };
    }
    if (file.size > MAX_PHOTO_BYTES) {
      return { error: "Elke foto mag maximaal 8 MB zijn" };
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

  const listing = await prisma.listing.create({
    data: {
      sellerId: session.user.id,
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

  redirect(`/listing/${listing.id}`);
}
