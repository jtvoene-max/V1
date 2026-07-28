import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { modelSlug } from "@/lib/model-slug";
import {
  buildWhere,
  CONDITION_LABELS,
  eraLabel,
  filterQuery,
  formatPrice,
  PAGE_SIZE,
  pageNumber,
  parseFilters,
} from "@/lib/listing-search";
import { formatDate, t } from "@/lib/i18n";

// Het openbare archief van verkochte stukken.
//
// Drie redenen dat dit bestaat, uit het concurrentieonderzoek (Fashionphile
// doet dit, Chrono24 in de vorm van een prijsindex):
//  1. Elke verkochte tas blijft een vindbare pagina met een gerealiseerde
//     prijs. Dat zijn precies de zoekopdrachten waarop mensen binnenkomen.
//  2. Het bewijst dat er hier daadwerkelijk gehandeld wordt, en dat is voor
//     een nieuw platform het lastigst aan te tonen.
//  3. Het is de zichtbare helft van de verkoopdata die we toch al bevriezen
//     op de order, en de opmaat naar een prijsoverzicht per model.
//
// Privacy: wát er verkocht is en voor hoeveel is openbaar, wíe het verkocht
// niet. Daarom staat hier geen naam, alleen of het een particulier of een
// bedrijf was, net als op een gewone listing.

export const metadata = {
  title: "Sold archive — Still Iconic",
  description:
    "Every vintage Chanel piece sold through Still Iconic, with the price it actually fetched. See what a piece is worth before you buy or sell.",
};

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const where = buildWhere(filters, "SOLD");
  const page = pageNumber(filters);

  const [listings, totalCount, aggregaat] = await Promise.all([
    prisma.listing.findMany({
      where,
      // Op verkoopdatum, niet op plaatsingsdatum: het archief leest als een
      // tijdlijn van wat er is verkocht.
      orderBy: { order: { createdAt: "desc" } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        photos: { orderBy: { position: "asc" }, take: 1 },
        seller: { select: { accountType: true } },
        order: { select: { itemPriceCents: true, createdAt: true } },
      },
    }),
    prisma.listing.count({ where }),
    // De werkelijk betaalde bedragen staan op de order, bevroren op het
    // moment van koop. De vraagprijs op de listing kan daarvan afwijken.
    prisma.order.aggregate({
      where: { listing: where },
      _sum: { itemPriceCents: true },
      _avg: { itemPriceCents: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />

      <div className="mb-10 text-center">
        <p className="caps-gold mb-3">{t.archief.voorregel}</p>
        <h1 className="font-serif text-3xl">{t.archief.titel}</h1>
        <div className="goud-lijn mx-auto mt-4" />
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500">{t.archief.intro}</p>
      </div>

      {/* De cijfers bovenaan zijn het bewijs: dit platform verkoopt echt. */}
      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        <div className="border hairline bg-white px-4 py-3 text-center">
          <p className="caps-label !text-[9px]">{t.archief.voorregel}</p>
          <p className="mt-1 text-[15px] font-medium">{t.archief.aantal(totalCount)}</p>
        </div>
        <div className="border hairline bg-white px-4 py-3 text-center">
          <p className="caps-label !text-[9px]">{t.archief.totaleWaarde}</p>
          <p className="mt-1 text-[15px] font-medium">{formatPrice(aggregaat._sum.itemPriceCents ?? 0)}</p>
        </div>
        <div className="border hairline bg-white px-4 py-3 text-center">
          <p className="caps-label !text-[9px]">{t.archief.gemiddeld}</p>
          <p className="mt-1 text-[15px] font-medium">
            {formatPrice(Math.round(aggregaat._avg.itemPriceCents ?? 0))}
          </p>
        </div>
      </div>

      {listings.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">{t.archief.geenResultaat}</p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => {
            const betaald = listing.order?.itemPriceCents ?? listing.priceCents;
            const weekAf = betaald !== listing.priceCents;
            return (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
                <article className="border hairline bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(10,10,10,0.10)]">
                  <div className="relative aspect-square overflow-hidden border-b hairline bg-neutral-100">
                    {listing.photos[0] && (
                      <Image
                        src={listing.photos[0].url}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        // Verzadiging eraf: het archief is geschiedenis, niet
                        // de etalage. Zo blijft duidelijk wat te koop is.
                        className="object-cover grayscale-[35%] transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
                      />
                    )}
                    <span className="caps-label absolute left-0 top-0 bg-black/85 px-2.5 py-1.5 !text-[8px] !text-white">
                      {t.listing.verkocht}
                    </span>
                  </div>
                  <div className="px-4 py-4 text-center">
                    <h2 className="truncate font-serif text-[15px]">{listing.title}</h2>
                    <p className="caps-label mt-1.5 !text-[9px]">
                      {CONDITION_LABELS[listing.condition]}
                      {listing.productionYear ? ` · ${eraLabel(listing.productionYear)}` : ""} ·{" "}
                      {listing.seller.accountType === "BUSINESS" ? t.nav.business : t.nav.private}
                    </p>
                    <p className="caps-gold mt-3 !text-[8px]">{t.archief.verkochtVoor}</p>
                    <p className="text-[15px] font-medium">{formatPrice(betaald)}</p>
                    {weekAf && (
                      <p className="mt-0.5 text-[10px] text-neutral-400">
                        {t.archief.vraagprijsWas(formatPrice(listing.priceCents))}
                      </p>
                    )}
                    {listing.order && (
                      <p className="mt-2 text-[10px] text-neutral-400">{formatDate(listing.order.createdAt)}</p>
                    )}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-6" aria-label="Pagination">
          {page > 1 ? (
            <Link href={`/archive${filterQuery(filters, { page: String(page - 1) })}`} className="btn-maison-line !px-4 !py-2">
              {t.collectie.vorige}
            </Link>
          ) : (
            <span className="btn-maison-line !px-4 !py-2 opacity-30">{t.collectie.vorige}</span>
          )}
          <span className="caps-label">{t.collectie.pagina(page, totalPages)}</span>
          {page < totalPages ? (
            <Link href={`/archive${filterQuery(filters, { page: String(page + 1) })}`} className="btn-maison-line !px-4 !py-2">
              {t.collectie.volgende}
            </Link>
          ) : (
            <span className="btn-maison-line !px-4 !py-2 opacity-30">{t.collectie.volgende}</span>
          )}
        </nav>
      )}

      <div className="mt-14 flex flex-col items-center gap-4 border-t hairline pt-8 text-center">
        <p className="text-xs text-neutral-400">{t.archief.privacy}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="btn-maison-line">
            {t.archief.naarCollectie}
          </Link>
          {filters.model && (
            <Link href={`/model/${modelSlug(filters.model)}`} className="btn-maison-line">
              {t.archief.bekijkModel}
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
