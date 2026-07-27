"use client";

import { useActionState, useState } from "react";
import { createListingAction, type ListingFormState } from "@/lib/actions/listing-actions";

const CATEGORY_OPTIONS = [
  { value: "bag", label: "Tas" },
  { value: "jewelry", label: "Sieraad" },
  { value: "accessory", label: "Accessoire" },
];

const CONDITION_OPTIONS = [
  { value: "EXCELLENT", label: "Uitstekend", hint: "Nauwelijks gedragen, geen zichtbare gebreken" },
  { value: "GOOD", label: "Goed", hint: "Lichte gebruikssporen passend bij de leeftijd" },
  { value: "VISIBLE_WEAR", label: "Gebruikssporen", hint: "Duidelijke sporen, eerlijk geprijsd" },
];

export function SellForm() {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(createListingAction, undefined);
  const [photoCount, setPhotoCount] = useState(0);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1 text-sm">
        Titel
        <input
          name="title"
          required
          minLength={5}
          maxLength={120}
          placeholder="Bijv. Chanel Classic Flap Medium 1995"
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Categorie
          <select name="category" required defaultValue="" className="rounded border border-neutral-300 px-2 py-2">
            <option value="" disabled>
              Kies...
            </option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Model (optioneel)
          <input name="model" maxLength={80} placeholder="Bijv. Classic Flap Medium" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2 text-sm">
        <legend className="mb-1">Conditie</legend>
        {CONDITION_OPTIONS.map((c) => (
          <label key={c.value} className="flex cursor-pointer items-start gap-2 rounded border border-neutral-200 p-3">
            <input type="radio" name="condition" value={c.value} required className="mt-0.5" />
            <span>
              <span className="font-medium">{c.label}</span>
              <span className="block text-xs text-neutral-500">{c.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Productiejaar (optioneel)
          <input name="productionYear" type="number" min={1910} max={2026} placeholder="Bijv. 1995" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Vraagprijs in euro&apos;s
          <input name="priceEuro" type="number" required min={50} max={100000} step={10} placeholder="Bijv. 4500" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Beschrijving
        <textarea
          name="description"
          required
          minLength={30}
          maxLength={4000}
          rows={5}
          placeholder="Vertel het verhaal van dit item: herkomst, staat, wat er meegeleverd wordt (dustbag, authenticiteitskaart)..."
          className="rounded border border-neutral-300 px-3 py-2"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Foto&apos;s (1 tot 8, JPG/PNG/WebP, max 8 MB per stuk)
        <input
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          required
          onChange={(e) => setPhotoCount(e.target.files?.length ?? 0)}
          className="rounded border border-neutral-300 px-3 py-2 file:mr-3 file:rounded file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-white"
        />
        {photoCount > 0 && (
          <span className="text-xs text-neutral-500">
            {photoCount} foto{photoCount === 1 ? "" : "'s"} geselecteerd
          </span>
        )}
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="allowOffers" defaultChecked />
        Bieden toestaan op dit item
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button type="submit" disabled={pending} className="btn-maison">
        {pending ? "Bezig met plaatsen..." : "Item plaatsen"}
      </button>
    </form>
  );
}
