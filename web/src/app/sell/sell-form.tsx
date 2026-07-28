"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { createListingAction, type ListingFormState } from "@/lib/actions/listing-actions";
import { COLORS, CONDITION_ORDER, HARDWARE, INCLUSIONS, MATERIALS, WEAR_ZONES } from "@/lib/listing-options";
import { PhotoShots } from "@/components/photo-shots";
import { t } from "@/lib/i18n";

// Waar het onafgemaakte concept staat. Alleen de tekstvelden: foto's zijn te
// groot voor deze opslag en die maakt de verkoper zo opnieuw.
const CONCEPT_KEY = "still-iconic-concept";

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

// text-[16px] op de telefoon is geen smaakkeuze: onder 16px zoomt Safari op
// iOS het hele scherm in zodra je een veld aantikt. Vanaf sm weer klein.
const veldClass =
  "border hairline bg-white px-3 py-3 text-[16px] text-black focus:border-black focus:outline-none sm:py-2 sm:text-sm";

export function SellForm() {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(createListingAction, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const [conceptHersteld, setConceptHersteld] = useState(false);

  // Concept terugzetten: valt de verbinding weg of belt er iemand midden in
  // het invullen, dan staat het halve formulier er nog.
  useEffect(() => {
    const opgeslagen = localStorage.getItem(CONCEPT_KEY);
    const form = formRef.current;
    if (!opgeslagen || !form) return;
    try {
      const data = JSON.parse(opgeslagen) as Record<string, string[]>;
      for (const el of Array.from(form.elements)) {
        const veld = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
        if (!veld.name || (veld as HTMLInputElement).type === "file") continue;
        const type = (veld as HTMLInputElement).type;
        if (type === "checkbox" || type === "radio") {
          (veld as HTMLInputElement).checked = (data[veld.name] ?? []).includes(veld.value || "on");
        } else {
          veld.value = data[veld.name]?.[0] ?? "";
        }
      }
      if (data.title?.[0] || data.description?.[0]) setConceptHersteld(true);
    } catch {
      localStorage.removeItem(CONCEPT_KEY);
    }
  }, []);

  function bewaarConcept() {
    const form = formRef.current;
    if (!form) return;
    const data: Record<string, string[]> = {};
    for (const [sleutel, waarde] of new FormData(form).entries()) {
      if (waarde instanceof File) continue;
      (data[sleutel] ??= []).push(waarde);
    }
    localStorage.setItem(CONCEPT_KEY, JSON.stringify(data));
  }

  function wisConcept() {
    localStorage.removeItem(CONCEPT_KEY);
    formRef.current?.reset();
    setConceptHersteld(false);
  }

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
    <form
      ref={formRef}
      action={formAction}
      onChange={bewaarConcept}
      onSubmit={() => localStorage.removeItem(CONCEPT_KEY)}
      className="flex flex-col gap-8"
    >
      {conceptHersteld && (
        <p className="flex flex-wrap items-center justify-between gap-2 border hairline bg-white px-4 py-3 text-sm text-neutral-700">
          {t.verkopen.concept.hersteld}
          <button type="button" onClick={wisConcept} className="caps-label cursor-pointer underline hover:!text-black">
            {t.verkopen.concept.wissen}
          </button>
        </p>
      )}

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
        <div className="flex flex-col gap-6">
          <PhotoShots />
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

      {/* Op de telefoon over de volle breedte: makkelijker te raken met een duim. */}
      <button type="submit" disabled={pending} className="btn-maison w-full sm:w-auto sm:self-start">
        {pending ? t.verkopen.bezig : t.verkopen.plaatsen}
      </button>
    </form>
  );
}
