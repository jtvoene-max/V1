"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveSearchAction, type SavedSearchState } from "@/lib/actions/search-actions";
import { t } from "@/lib/i18n";

// Verschijnt onder de filters zodra er iets gefilterd is. Dichtgeklapt is het
// één regel, zodat het de collectie niet in de weg zit.

export function SaveSearch({
  query,
  omschrijving,
  ingelogd,
}: {
  query: string;
  omschrijving: string;
  ingelogd: boolean;
}) {
  const [state, formAction, pending] = useActionState<SavedSearchState, FormData>(saveSearchAction, undefined);
  const [open, setOpen] = useState(false);

  if (!ingelogd) {
    return (
      <p className="mt-3 text-xs text-neutral-500">
        <Link href="/login" className="underline hover:text-black">
          {t.bewaardeZoekopdracht.inloggen}
        </Link>
      </p>
    );
  }

  if (state?.opgeslagen) {
    return <p className="mt-3 text-xs text-[#8a6f3c]">{t.bewaardeZoekopdracht.opgeslagen}</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="caps-label mt-3 cursor-pointer underline hover:!text-black"
      >
        ♡ {t.bewaardeZoekopdracht.titelKort}
      </button>
    );
  }

  return (
    <form action={formAction} className="mt-3 border hairline bg-white p-4">
      <p className="mb-3 text-xs leading-relaxed text-neutral-500">{t.bewaardeZoekopdracht.uitleg}</p>
      <p className="caps-gold mb-3">{omschrijving}</p>
      <input type="hidden" name="query" value={query} />
      <div className="flex flex-wrap gap-2">
        <input
          name="name"
          required
          maxLength={80}
          defaultValue={omschrijving}
          placeholder={t.bewaardeZoekopdracht.naamPlaceholder}
          className="min-w-0 flex-1 border hairline bg-white px-3 py-2 text-[16px] text-black focus:border-black focus:outline-none sm:text-sm"
        />
        <button type="submit" disabled={pending} className="btn-maison !px-4 !py-2">
          {t.bewaardeZoekopdracht.opslaan}
        </button>
      </div>
      {state?.error && <p className="mt-2 text-xs text-red-600">{state.error}</p>}
    </form>
  );
}
