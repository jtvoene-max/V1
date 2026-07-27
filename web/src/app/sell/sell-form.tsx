"use client";

import { useActionState, useState } from "react";
import { createListingAction, type ListingFormState } from "@/lib/actions/listing-actions";
import { COLORS, HARDWARE, INCLUSIONS, MATERIALS, WEAR_ZONES } from "@/lib/listing-options";
import { CONDITION_ORDER } from "@/lib/listing-search";
import { t } from "@/lib/i18n";

const CATEGORY_OPTIONS = [
  { value: "bag", label: "Bag" },
  { value: "jewelry", label: "Jewellery" },
  { value: "accessory", label: "Accessory" },
];

const CONDITION_HINTS: Record<string, string> = {
  NEW: "Unworn, as it left the boutique",
  EXCELLENT: "Barely worn, no visible flaws",
  VERY_GOOD: "Lightly worn, with the patina you expect of the era",
  GOOD: "Worn and loved, with honest signs of use",
  VISIBLE_WEAR: "Clear marks, priced accordingly",
};

const veldClass = "border hairline bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none";

export function SellForm() {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(createListingAction, undefined);
  const [photoCount, setPhotoCount] = useState(0);

  const keuze = (naam: string, label: string, opties: readonly string[], verplicht = false) => (
    <label className="flex flex-col gap-1.5">
      <span className="caps-label">{label}</span>
      <select name={naam} required={verplicht} defaultValue="" className={veldClass}>
        <option value="">{verplicht ? t.verkopen.kies : "—"}</option>
        {opties.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <section>
        <h2 className="caps-gold mb-4">1. The piece</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="caps-label">{t.verkopen.titelVeld}</span>
            <input name="title" required minLength={5} maxLength={120} placeholder={t.verkopen.titelPlaceholder} className={veldClass} />
          </label>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5">
              <span className="caps-label">{t.verkopen.categorie}</span>
              <select name="category" required defaultValue="" className={veldClass}>
                <option value="" disabled>
                  {t.verkopen.kies}
                </option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="caps-label">{t.verkopen.modelVeld}</span>
              <input name="model" maxLength={80} placeholder={t.verkopen.modelPlaceholder} className={veldClass} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="caps-label">{t.verkopen.jaar}</span>
              <input name="productionYear" type="number" min={1910} max={2026} placeholder={t.verkopen.jaarPlaceholder} className={veldClass} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {keuze("color", t.attributen.kleur, COLORS)}
            {keuze("material", t.attributen.materiaal, MATERIALS)}
            {keuze("hardware", t.attributen.hardware, HARDWARE)}
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="caps-label">{t.attributen.afmetingen}</span>
            <input name="dimensions" maxLength={120} placeholder="e.g. 25.5 × 16 × 7.5 cm · strap drop 48 cm" className={veldClass} />
          </label>
        </div>
      </section>

      <section>
        <h2 className="caps-gold mb-4">2. Condition</h2>
        <fieldset className="mb-5 flex flex-col gap-2">
          <legend className="caps-label mb-2">{t.verkopen.conditie}</legend>
          {CONDITION_ORDER.map((c) => (
            <label key={c} className="flex cursor-pointer items-start gap-2 border hairline p-3 text-sm">
              <input type="radio" name="condition" value={c} required className="mt-0.5" />
              <span>
                <span className="font-medium">{t.condities[c]}</span>
                <span className="block text-xs text-neutral-500">{CONDITION_HINTS[c]}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <p className="caps-label mb-2">{t.attributen.conditierapport}</p>
        <p className="mb-3 text-xs leading-relaxed text-neutral-500">
          Describe each area honestly. Our atelier checks these notes during the physical expertise; a mismatch means the
          piece is returned at your cost.
        </p>
        <div className="flex flex-col gap-3">
          {WEAR_ZONES.map((z) => (
            <label key={z} className="flex flex-col gap-1.5">
              <span className="caps-label">{t.zones[z]}</span>
              <input name={`wear_${z}`} maxLength={200} placeholder="Describe what you see, however small" className={veldClass} />
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="caps-gold mb-4">3. What is included</h2>
        <div className="flex flex-wrap gap-4">
          {INCLUSIONS.map((i) => (
            <label key={i} className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" name="inclusions" value={i} />
              {i}
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="caps-gold mb-4">4. Photographs and description</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="caps-label">{t.verkopen.fotos}</span>
            <input
              name="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              onChange={(e) => setPhotoCount(e.target.files?.length ?? 0)}
              className="border hairline bg-white px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-white"
            />
            {photoCount > 0 && <span className="text-xs text-neutral-500">{t.verkopen.fotosGekozen(photoCount)}</span>}
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="caps-label">{t.verkopen.beschrijving}</span>
            <textarea
              name="description"
              required
              minLength={30}
              maxLength={4000}
              rows={5}
              placeholder={t.verkopen.beschrijvingPlaceholder}
              className={veldClass}
            />
          </label>
        </div>
      </section>

      <section>
        <h2 className="caps-gold mb-4">5. Price</h2>
        <div className="flex flex-col gap-4">
          <label className="flex w-48 flex-col gap-1.5">
            <span className="caps-label">{t.verkopen.prijs}</span>
            <input name="priceEuro" type="number" required min={50} max={100000} step={10} placeholder={t.verkopen.prijsPlaceholder} className={veldClass} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="allowOffers" defaultChecked />
            {t.verkopen.biedenToestaan}
          </label>
        </div>
      </section>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-maison self-start">
        {pending ? t.verkopen.bezig : t.verkopen.plaatsen}
      </button>
    </form>
  );
}
