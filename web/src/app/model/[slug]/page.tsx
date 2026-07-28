import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { modelUitSlug } from "@/lib/model-slug";
import { CONDITION_LABELS, eraLabel, formatPrice } from "@/lib/listing-search";
import { t } from "@/lib/i18n";

// De modelpagina: het naslagwerk waar de losse advertenties onder hangen.
//
// Uit het Chrono24-onderzoek: iemand die "Classic Flap Medium" intikt wil
// eerst weten wat dat is en wat het waard is, en pas daarna welke exemplaren
// er nu liggen. Een filter geeft een lijst, deze pagina geeft een antwoord.
// Het is tegelijk de sterkste zoekmachine-troef, want mensen zoeken op
// modelnamen.

/** Alle modelnamen die we kennen, ook van verkochte stukken. */
async function alleModelNamen(): Promise<string[]> {
  const rijen = await prisma.listing.findMany({
    where: { NOT: { model: null } },
    select: { model: true },
    distinct: ["model"],
  });
  return rijen.map((r) => r.model as string);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const naam = modelUitSlug(slug, await alleModelNamen());
  if (!naam) return { title: "Model — Still Iconic" };
  return {
    title: `${naam} — vintage Chanel, expertised | Still Iconic`,
    description: `Every ${naam} we offer is verified by hand in our atelier. Current availability, price range and what to look for.`,
  };
}

function Waardeblok({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="border hairline bg-white px-4 py-3 text-center">
      <p className="caps-label !text-[9px]">{label}</p>
      <p className="mt-1 text-[15px] font-medium">{waarde}</p>
    </div>
  );
}

function Rij({ titel, items }: { titel: string; items: { label: string; href: string; count: number }[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="caps-gold mb-2 border-b hairline pb-2 !text-[9px]">{titel}</h3>
      <ul className="flex flex-wrap gap-x-4 gap-y-1">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="text-[13px] text-neutral-800 hover:text-black hover:underline">
              {i.label} <span className="text-neutral-400">({i.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const naam = modelUitSlug(slug, await alleModelNamen());
  if (!naam) notFound();

  const actiefWhere = { status: "ACTIVE" as const, model: naam };

  const [listings, aggregaat, verkoopAggregaat, materialen, kleuren, hardware, jaren] = await Promise.all([
    prisma.listing.findMany({
      where: actiefWhere,
      orderBy: { priceCents: "asc" },
      take: 24,
      include: {
        photos: { orderBy: { position: "asc" }, take: 1 },
        seller: { select: { accountType: true } },
      },
    }),
    prisma.listing.aggregate({
      where: actiefWhere,
      _count: { _all: true },
      _min: { priceCents: true },
      _max: { priceCents: true },
      _avg: { priceCents: true },
    }),
    // Verkoopgeschiedenis komt uit Order, waar de kenmerken bevroren staan op
    // het moment van koop. Daarom klopt dit ook als de listing later wijzigt.
    prisma.order.aggregate({
      where: { itemModel: naam },
      _count: { _all: true },
      _avg: { itemPriceCents: true },
    }),
    prisma.listing.groupBy({
      by: ["material"],
      where: { ...actiefWhere, NOT: { material: null } },
      _count: { _all: true },
      orderBy: { _count: { material: "desc" } },
    }),
    prisma.listing.groupBy({
      by: ["color"],
      where: { ...actiefWhere, NOT: { color: null } },
      _count: { _all: true },
      orderBy: { _count: { color: "desc" } },
    }),
    prisma.listing.groupBy({
      by: ["hardware"],
      where: { ...actiefWhere, NOT: { hardware: null } },
      _count: { _all: true },
      orderBy: { _count: { hardware: "desc" } },
    }),
    prisma.listing.groupBy({
      by: ["productionYear"],
      where: { ...actiefWhere, NOT: { productionYear: null } },
      _count: { _all: true },
    }),
  ]);

  const aantal = aggregaat._count._all;
  const basis = `/?model=${encodeURIComponent(naam)}`;

  // Jaren samenvoegen tot decennia
  const perDecennium = new Map<number, number>();
  for (const rij of jaren) {
    const decennium = Math.floor((rij.productionYear as number) / 10) * 10;
    perDecennium.set(decennium, (perDecennium.get(decennium) ?? 0) + rij._count._all);
  }

  const verkochtAantal = verkoopAggregaat._count._all;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />

      <nav className="mb-6">
        <Link href="/" className="caps-label underline">
          {t.model.terug}
        </Link>
      </nav>

      <div className="mb-8 text-center">
        <p className="caps-gold mb-3">{t.model.voorregel}</p>
        <h1 className="font-serif text-3xl">{naam}</h1>
        <div className="goud-lijn mx-auto mt-4" />
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-500">{t.model.uitleg}</p>
      </div>

      {/* De cijfers waar een koper op zit te wachten, boven de voorraad. */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Waardeblok
          label={t.model.voorregel}
          waarde={aantal > 0 ? t.model.beschikbaar(aantal) : t.model.geenBeschikbaar}
        />
        {aggregaat._min.priceCents !== null && aggregaat._max.priceCents !== null && (
          <Waardeblok
            label={t.model.prijsbereik}
            waarde={`${formatPrice(aggregaat._min.priceCents)} – ${formatPrice(aggregaat._max.priceCents)}`}
          />
        )}
        {aggregaat._avg.priceCents !== null && (
          <Waardeblok label={t.model.gemiddeld} waarde={formatPrice(Math.round(aggregaat._avg.priceCents))} />
        )}
        {verkochtAantal > 0 && verkoopAggregaat._avg.itemPriceCents !== null ? (
          // Doorklikbaar naar het archief: wie wil weten wat dit model doet,
          // wil de losse verkopen zien en niet alleen het gemiddelde.
          <Link href={`/archive?model=${encodeURIComponent(naam)}`} className="block hover:shadow-[0_8px_22px_rgba(10,10,10,0.08)]">
            <Waardeblok
              label={t.model.verkocht(verkochtAantal)}
              waarde={formatPrice(Math.round(verkoopAggregaat._avg.itemPriceCents))}
            />
          </Link>
        ) : (
          <div className="border border-dashed hairline px-4 py-3 text-center text-xs leading-relaxed text-neutral-400">
            {t.model.nogGeenVerkoop}
          </div>
        )}
      </div>

      {aantal > 0 && (
        <section className="mb-10 border hairline bg-white p-6">
          <h2 className="caps-label mb-4">{t.model.watErIs}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Rij
              titel={t.model.materialen}
              items={materialen.map((r) => ({
                label: r.material as string,
                href: `${basis}&material=${encodeURIComponent(r.material as string)}`,
                count: r._count._all,
              }))}
            />
            <Rij
              titel={t.model.kleuren}
              items={kleuren.map((r) => ({
                label: r.color as string,
                href: `${basis}&color=${encodeURIComponent(r.color as string)}`,
                count: r._count._all,
              }))}
            />
            <Rij
              titel={t.model.hardware}
              items={hardware.map((r) => ({
                label: r.hardware as string,
                href: `${basis}&hardware=${encodeURIComponent(r.hardware as string)}`,
                count: r._count._all,
              }))}
            />
            <Rij
              titel={t.model.eras}
              items={[...perDecennium.entries()]
                .sort((a, b) => b[0] - a[0])
                .map(([decennium, count]) => ({
                  label: `${decennium}s`,
                  href: `${basis}&era=${decennium}`,
                  count,
                }))}
            />
          </div>
        </section>
      )}

      {listings.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">{t.collectie.geenResultaat}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
                <article className="border hairline bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(10,10,10,0.10)]">
                  <div className="relative aspect-square overflow-hidden border-b hairline bg-neutral-100">
                    {listing.photos[0] && (
                      <Image
                        src={listing.photos[0].url}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="px-4 py-4 text-center">
                    <h2 className="truncate font-serif text-[15px]">{listing.title}</h2>
                    <p className="caps-label mt-1.5 !text-[9px]">
                      {CONDITION_LABELS[listing.condition]}
                      {listing.productionYear ? ` · ${eraLabel(listing.productionYear)}` : ""} ·{" "}
                      {listing.seller.accountType === "BUSINESS" ? t.nav.business : t.nav.private}
                    </p>
                    <p className="mt-2 text-[15px] font-medium">{formatPrice(listing.priceCents)}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {aantal > listings.length && (
            <div className="mt-10 text-center">
              <Link href={basis} className="btn-maison-line">
                {t.model.allesBekijken}
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
}
