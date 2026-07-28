import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { t } from "@/lib/i18n";

// De verificatiepagina.
//
// Belangrijk in de opzet: niet elk stuk gaat langs het atelier. De koper
// kiest bij het afrekenen uit drie niveaus, en de verzendroute volgt daaruit.
// Zie docs/onderzoek-concullegas.md 5e voor het besluit en de redenering.
//
// Bij elk niveau staat expliciet waar het ophoudt. Dat is niet alleen netjes:
// het is precies wat er straks in de voorwaarden moet staan, en wat je moet
// kunnen waarmaken als iemand er ooit een jurist bij haalt.

export const metadata = {
  title: "Verification — Still Iconic",
  description:
    "Three levels of verification, chosen by you at checkout: photo check, hand expertise in our atelier, or an Entrupy certificate.",
};

export default function VerificationPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <SiteHeader />

      <div className="mb-12 text-center">
        <p className="caps-gold mb-3">{t.verificatie.voorregel}</p>
        <h1 className="font-serif text-3xl">{t.verificatie.titel}</h1>
        <div className="goud-lijn mx-auto mt-4" />
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-neutral-600">{t.verificatie.intro}</p>
      </div>

      {/* De drie niveaus, onder elkaar zodat er ruimte is voor de grenzen. */}
      <div className="mb-14 flex flex-col gap-4">
        {t.verificatie.niveaus.map((n) => (
          <section key={n.nummer} className="border hairline bg-white p-6 sm:p-8">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b hairline pb-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl text-[#a8894f]">{n.nummer}</span>
                <h2 className="font-serif text-xl">{n.naam}</h2>
              </div>
              <span className="text-[15px] font-medium">{n.prijs}</span>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-neutral-700">{n.wat}</p>

            <p className="mb-5 border-l-2 border-[#a8894f] pl-4 text-sm leading-relaxed text-neutral-600">
              {n.grens}
            </p>

            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="caps-label !text-[9px]">Delivery</dt>
                <dd className="mt-1 text-sm">{n.levertijd}</dd>
              </div>
              <div>
                <dt className="caps-label !text-[9px]">Route</dt>
                <dd className="mt-1 text-sm">{n.route}</dd>
              </div>
              <div>
                <dt className="caps-label !text-[9px]">Suited to</dt>
                <dd className="mt-1 text-sm">{n.voorWie}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="mb-14">
        <h2 className="caps-gold mb-5 text-center">{t.verificatie.keuzeTitel}</h2>
        <p className="mb-5 text-center text-sm text-neutral-500">{t.verificatie.keuzeIntro}</p>
        <div className="border hairline bg-white">
          {t.verificatie.keuzeRijen.map((rij, i) => (
            <div
              key={rij.situatie}
              className={`flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 text-sm ${
                i > 0 ? "border-t hairline" : ""
              }`}
            >
              <span className="text-neutral-700">{rij.situatie}</span>
              <span className="font-medium">{rij.advies}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="caps-gold mb-5 text-center">{t.verificatie.altijdTitel}</h2>
        <ul className="mx-auto flex max-w-2xl flex-col gap-3">
          {t.verificatie.altijd.map((regel) => (
            <li key={regel} className="flex gap-3 text-sm leading-relaxed text-neutral-700">
              <span aria-hidden className="text-[#a8894f]">
                ·
              </span>
              {regel}
            </li>
          ))}
        </ul>
      </section>

      {/* Wat we niet beloven. Hoort net zo hard op deze pagina als de rest. */}
      <section className="mb-12 border hairline bg-white p-6 sm:p-8">
        <h2 className="caps-label mb-3">{t.verificatie.eerlijkTitel}</h2>
        <p className="text-sm leading-relaxed text-neutral-700">{t.verificatie.eerlijk}</p>
      </section>

      <div className="text-center">
        <Link href="/" className="btn-maison-line">
          {t.model.allesBekijken}
        </Link>
      </div>
    </main>
  );
}
