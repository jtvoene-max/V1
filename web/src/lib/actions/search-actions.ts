"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Bewaarde zoekopdrachten. Elk stuk bij ons is één-van-één, dus de meeste
// kopers vinden op de eerste dag niet wat ze zoeken. Dit is wat hen terugroept.

const opslaanSchema = z.object({
  name: z.string().trim().min(1).max(80),
  query: z.string().max(500),
});

export type SavedSearchState = { error?: string; opgeslagen?: boolean } | undefined;

export async function saveSearchAction(_prev: SavedSearchState, formData: FormData): Promise<SavedSearchState> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Sign in to save a search" };

  const parsed = opslaanSchema.safeParse({
    name: formData.get("name"),
    query: formData.get("query"),
  });
  if (!parsed.success) return { error: "Give this search a name" };

  // Querystring opschonen: alleen de filters die we kennen, in vaste volgorde.
  // Zo levert dezelfde zoekopdracht altijd dezelfde tekst op en kunnen we
  // dubbelen herkennen.
  const toegestaan = [
    "q", "category", "condition", "sellerType", "color", "material",
    "hardware", "model", "era", "minPrice", "maxPrice",
  ];
  const bron = new URLSearchParams(parsed.data.query);
  const schoon = new URLSearchParams();
  for (const sleutel of toegestaan) {
    const waarde = bron.get(sleutel);
    if (waarde) schoon.set(sleutel, waarde);
  }
  const query = schoon.toString();
  if (!query) return { error: "Set at least one filter before saving" };

  const bestaat = await prisma.savedSearch.findFirst({
    where: { userId: session.user.id, query },
    select: { id: true },
  });
  if (bestaat) return { error: "You already saved this search" };

  await prisma.savedSearch.create({
    data: { userId: session.user.id, name: parsed.data.name, query },
  });

  revalidatePath("/account");
  return { opgeslagen: true };
}

export async function deleteSavedSearchAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  // deleteMany met userId erin: zo kan niemand de zoekopdracht van een ander
  // verwijderen door een ander id mee te sturen.
  await prisma.savedSearch.deleteMany({ where: { id, userId: session.user.id } });
  revalidatePath("/account");
}

/** Markeert alles tot nu toe als gezien, zodat de teller weer op nul staat. */
export async function markSearchSeenAction(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !id) return;

  await prisma.savedSearch.updateMany({
    where: { id, userId: session.user.id },
    data: { lastSeenAt: new Date() },
  });
  revalidatePath("/account");
}
