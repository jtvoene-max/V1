// Waar foto's terechtkomen, achter één functie.
//
// Waarom een tussenlaag en niet direct Cloudflare aanroepen: de rest van de
// app hoeft niet te weten waar een foto staat. Willen we later verhuizen, dan
// verandert alleen dit bestand. Datzelfde patroon gebruiken we bij Stripe.
//
// Staan CLOUDFLARE_ACCOUNT_ID en CLOUDFLARE_IMAGES_TOKEN in de omgeving, dan
// gaat de foto naar Cloudflare Images. Anders naar de map public/uploads op de
// schijf. Dat laatste is alleen voor lokaal werken: op Vercel is de schijf
// tijdelijk en alleen-lezen, dus daar moeten die twee sleutels staan.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

export const TOEGESTANE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const IMAGES_TOKEN = process.env.CLOUDFLARE_IMAGES_TOKEN;

/** Staat de cloudopslag aan? Zo niet, dan schrijven we naar de schijf. */
export function cloudOpslagActief(): boolean {
  return Boolean(ACCOUNT_ID && IMAGES_TOKEN);
}

type CloudflareAntwoord = {
  success: boolean;
  errors?: { code: number; message: string }[];
  result?: { id: string; variants?: string[] };
};

async function naarCloudflare(bestand: File): Promise<string> {
  const body = new FormData();
  body.append("file", bestand, bestand.name || "photo.jpg");

  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`, {
    method: "POST",
    headers: { Authorization: `Bearer ${IMAGES_TOKEN}` },
    body,
  });

  const json = (await res.json().catch(() => null)) as CloudflareAntwoord | null;
  if (!res.ok || !json?.success) {
    const melding = json?.errors?.map((e) => e.message).join("; ") || `HTTP ${res.status}`;
    throw new Error(`Cloudflare Images: ${melding}`);
  }

  // Cloudflare levert per variant een kant-en-klare URL. "public" is de
  // standaardvariant die bij het aanzetten van Images wordt aangemaakt.
  const varianten = json.result?.variants ?? [];
  const url = varianten.find((v) => v.endsWith("/public")) ?? varianten[0];
  if (!url) throw new Error("Cloudflare Images: geen bezorg-URL in het antwoord");
  return url;
}

async function naarSchijf(bestand: File): Promise<string> {
  const map = path.join(process.cwd(), "public", "uploads");
  await mkdir(map, { recursive: true });
  const naam = `${crypto.randomUUID()}${TOEGESTANE_TYPES[bestand.type] ?? ".jpg"}`;
  await writeFile(path.join(map, naam), Buffer.from(await bestand.arrayBuffer()));
  return `/uploads/${naam}`;
}

/**
 * Bewaart één foto en levert de URL op waarop hij te zien is.
 * Gooit een fout als het opslaan mislukt, zodat de aanroeper kan besluiten
 * de listing niet aan te maken.
 */
export async function bewaarFoto(bestand: File): Promise<string> {
  return cloudOpslagActief() ? naarCloudflare(bestand) : naarSchijf(bestand);
}
