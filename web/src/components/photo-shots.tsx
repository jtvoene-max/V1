"use client";

import { useRef, useState } from "react";
import { JPEG_KWALITEIT, MAX_RAND_PX, SHOTS, VERPLICHTE_SHOTS, type ShotKey } from "@/lib/photo-shots";
import { t } from "@/lib/i18n";

// Fotolijst voor de verkoper, gebouwd voor een telefoon in de hand.
//
// Drie dingen die dit anders maken dan een gewone bestandskiezer:
//  1. capture="environment" opent op een telefoon direct de achtercamera
//     in plaats van de bestandsmap.
//  2. Elke foto wordt op het toestel zelf verkleind voordat hij verstuurd
//     wordt. Acht foto's van 4 MB over mobiel internet is een afhaakmoment.
//  3. Elke opname heeft zijn eigen invoerveld met name="photos", dus de
//     server hoeft niets te weten van deze schil en de volgorde in de DOM
//     is de volgorde op de productpagina.

type Klaar = { previewUrl: string; kilobytes: number };

/** Verkleint een foto op het toestel en levert een nieuwe JPEG op. */
async function verklein(bestand: File, naam: string): Promise<File> {
  if (!bestand.type.startsWith("image/")) return bestand;
  try {
    // from-image respecteert de rotatie uit de EXIF-gegevens, anders komen
    // foto's van een telefoon gekanteld binnen.
    const bitmap = await createImageBitmap(bestand, { imageOrientation: "from-image" });
    const factor = Math.min(1, MAX_RAND_PX / Math.max(bitmap.width, bitmap.height));
    const breedte = Math.round(bitmap.width * factor);
    const hoogte = Math.round(bitmap.height * factor);

    const canvas = document.createElement("canvas");
    canvas.width = breedte;
    canvas.height = hoogte;
    const ctx = canvas.getContext("2d");
    if (!ctx) return bestand;
    ctx.drawImage(bitmap, 0, 0, breedte, hoogte);
    bitmap.close();

    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", JPEG_KWALITEIT));
    if (!blob || blob.size >= bestand.size) return bestand;
    return new File([blob], `${naam}.jpg`, { type: "image/jpeg", lastModified: bestand.lastModified });
  } catch {
    // Lukt het verkleinen niet, dan versturen we het origineel. De server
    // controleert alsnog op type en grootte.
    return bestand;
  }
}

export function PhotoShots() {
  const [klaar, setKlaar] = useState<Partial<Record<ShotKey, Klaar>>>({});
  const [bezig, setBezig] = useState<ShotKey | null>(null);
  const inputs = useRef<Partial<Record<ShotKey, HTMLInputElement | null>>>({});

  const aantal = Object.keys(klaar).length;
  const verplichtOpen = SHOTS.filter((s) => s.verplicht && !klaar[s.key]).length;

  async function gekozen(key: ShotKey, input: HTMLInputElement) {
    const bestand = input.files?.[0];
    if (!bestand) return;

    setBezig(key);
    const verkleind = await verklein(bestand, `shot-${key.toLowerCase()}`);

    // De verkleinde versie terugschrijven in het invoerveld, zodat het
    // formulier straks die verstuurt en niet het origineel.
    const dt = new DataTransfer();
    dt.items.add(verkleind);
    input.files = dt.files;

    setKlaar((vorig) => {
      const oud = vorig[key];
      if (oud) URL.revokeObjectURL(oud.previewUrl);
      return {
        ...vorig,
        [key]: { previewUrl: URL.createObjectURL(verkleind), kilobytes: Math.round(verkleind.size / 1024) },
      };
    });
    setBezig(null);
  }

  function verwijder(key: ShotKey) {
    const input = inputs.current[key];
    if (input) input.files = new DataTransfer().files;
    setKlaar((vorig) => {
      const oud = vorig[key];
      if (oud) URL.revokeObjectURL(oud.previewUrl);
      const rest = { ...vorig };
      delete rest[key];
      return rest;
    });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <span className="caps-label">{t.verkopen.fotolijst.titel}</span>
        <span className="text-xs text-neutral-500">
          {t.verkopen.fotolijst.voortgang(aantal, SHOTS.length)}
          {verplichtOpen > 0 ? (
            <span className="text-[#8a6f3c]"> · {t.verkopen.fotolijst.verplichtRest(verplichtOpen)}</span>
          ) : (
            <span className="text-[#8a6f3c]"> · {t.verkopen.fotolijst.allesKlaar}</span>
          )}
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-neutral-500">{t.verkopen.fotolijst.uitleg}</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SHOTS.map(({ key, verplicht }) => {
          const gedaan = klaar[key];
          const shot = t.verkopen.fotolijst.shots[key];
          return (
            <div key={key} className="flex flex-col">
              {/* Het label is de knop: een tik erop opent de camera. */}
              <label
                className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden border p-2 text-center transition-colors ${
                  gedaan ? "border-[#a8894f] bg-white" : "hairline bg-white hover:border-black"
                }`}
              >
                <input
                  ref={(el) => {
                    inputs.current[key] = el;
                  }}
                  type="file"
                  name="photos"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  onChange={(e) => gekozen(key, e.currentTarget)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label={shot.label}
                />
                {gedaan ? (
                  <>
                    {/* Geen next/image: dit is een blob-url uit het toestel zelf. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={gedaan.previewUrl} alt={shot.label} className="absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#a8894f] text-sm text-white">
                      ✓
                    </span>
                  </>
                ) : bezig === key ? (
                  <span className="caps-label">{t.verkopen.fotolijst.bezig}</span>
                ) : (
                  <>
                    <span className="mb-1 text-xl leading-none text-neutral-300">＋</span>
                    <span className="text-[11px] font-medium leading-tight text-neutral-800">{shot.label}</span>
                    <span className="mt-1 text-[10px] leading-tight text-neutral-500">{shot.hint}</span>
                    {verplicht && <span className="caps-gold mt-1.5 !text-[8px]">{t.verkopen.fotolijst.verplicht}</span>}
                  </>
                )}
              </label>

              {gedaan && (
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{gedaan.kilobytes} kB</span>
                  <button
                    type="button"
                    onClick={() => verwijder(key)}
                    className="cursor-pointer underline hover:text-black"
                  >
                    {t.verkopen.fotolijst.verwijderen}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {verplichtOpen > 0 && aantal > 0 && (
        <p className="mt-3 text-xs text-[#8a6f3c]">{t.verkopen.fotolijst.nogVerplicht(VERPLICHTE_SHOTS)}</p>
      )}
    </div>
  );
}
