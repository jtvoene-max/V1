import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { MegaMenu } from "@/components/mega-menu";
import { allFacets } from "@/lib/facets";
import { t } from "@/lib/i18n";
import {
  activeFilterCount,
  buildOrderBy,
  buildWhere,
  CATEGORIES,
  CONDITION_LABELS,
  CONDITION_ORDER,
  filterQuery,
  formatPrice,
  PAGE_SIZE,
  pageNumber,
  parseFilters,
  SORT_OPTIONS,
} from "@/lib/listing-search";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  const where = buildWhere(filters);
  const page = pageNumber(filters);

  const [listings, totalCount, facets] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: buildOrderBy(filters),
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        photos: { orderBy: { position: "asc" }, take: 1 },
        seller: { select: { accountType: true } },
      },
    }),
    prisma.listing.count({ where }),
    allFacets(),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const actief = activeFilterCount(filters);
  const inputClass =
    "border hairline bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none";

  const categorieLabel = CATEGORIES.find((c) => c.value === filters.category)?.label;

  const keuzeVeld = (
    naam: keyof typeof filters,
    label: string,
    opties: { value: string; label: string }[]
  ) => (
    <label className="flex flex-col gap-1.5">
      <span className="caps-label">{label}</span>
      <select name={naam} defaultValue={(filters[naam] as string) ?? ""} className={inputClass}>
        <option value="">{t.collectie.alle}</option>
        {opties.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />
      <MegaMenu />

      <div className="mb-10 text-center">
        <p className="caps-gold mb-3">{categorieLabel ?? t.collectie.voorregel}</p>
        <h1 className="font-serif text-3xl">{t.collectie.titel}</h1>
        <div className="goud-lijn mx-auto mt-4" />
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-500">{t.collectie.intro}</p>
      </div>

      {/* Zoeken en filters (GET: deelbare URL's) */}
      <form method="GET" className="mb-8 flex flex-wrap items-end gap-3 border hairline bg-white p-5">
        <label className="flex min-w-44 flex-1 flex-col gap-1.5">
          <span className="caps-label">{t.collectie.zoeken}</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder={t.collectie.zoekenPlaceholder}
            className={inputClass}
          />
        </label>
        {keuzeVeld("category", t.collectie.categorie, CATEGORIES.map((c) => ({ value: c.value, label: c.label })))}
        {keuzeVeld(
          "condition",
          t.collectie.conditie,
          CONDITION_ORDER.map((c) => ({ value: c, label: CONDITION_LABELS[c] }))
        )}
        {keuzeVeld("color", t.attributen.kleur, facets.colors)}
        {keuzeVeld("material", t.attributen.materiaal, facets.materials)}
        {keuzeVeld("hardware", t.attributen.hardware, facets.hardware)}
        {keuzeVeld("era", t.attributen.era, facets.eras)}
        {keuzeVeld("sellerType", t.collectie.verkoper, [
          { value: "PRIVATE", label: t.nav.private },
          { value: "BUSINESS", label: t.nav.business },
        ])}
        <label className="flex w-24 flex-col gap-1.5">
          <span className="caps-label">{t.collectie.minPrijs}</span>
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice ?? ""} className={inputClass} />
        </label>
        <label className="flex w-24 flex-col gap-1.5">
          <span className="caps-label">{t.collectie.maxPrijs}</span>
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice ?? ""} className={inputClass} />
        </label>
        {keuzeVeld("sort", t.collectie.sorteren, SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label })))}
        {/* Model komt uit het mega-menu; bewaren zodat filteren hem niet wist */}
        {filters.model && <input type="hidden" name="model" value={filters.model} />}
        <button type="submit" className="btn-maison !px-5 !py-2.5">
          {t.collectie.filteren}
        </button>
        {actief > 0 && (
          <Link href="/" className="caps-label self-center underline">
            {t.collectie.wissen} ({actief})
          </Link>
        )}
      </form>

      <p className="caps-label mb-5">
        {totalCount} {totalCount === 1 ? t.collectie.stuk : t.collectie.stukken}
        {filters.model && <span className="ml-2 text-[#8a6f3c]">· {filters.model}</span>}
      </p>

      {listings.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">{t.collectie.geenResultaat}</p>
      ) : (
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
                    {listing.hardware ? ` · ${listing.hardware}` : ""} ·{" "}
                    {listing.seller.accountType === "BUSINESS" ? t.nav.business : t.nav.private}
                  </p>
                  <p className="mt-2 text-[15px] font-medium">{formatPrice(listing.priceCents)}</p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-12 flex items-center justify-center gap-6" aria-label="Pagination">
          {page > 1 ? (
            <Link href={`/${filterQuery(filters, { page: String(page - 1) })}`} className="btn-maison-line !px-4 !py-2">
              {t.collectie.vorige}
            </Link>
          ) : (
            <span className="btn-maison-line !px-4 !py-2 opacity-30">{t.collectie.vorige}</span>
          )}
          <span className="caps-label">{t.collectie.pagina(page, totalPages)}</span>
          {page < totalPages ? (
            <Link href={`/${filterQuery(filters, { page: String(page + 1) })}`} className="btn-maison-line !px-4 !py-2">
              {t.collectie.volgende}
            </Link>
          ) : (
            <span className="btn-maison-line !px-4 !py-2 opacity-30">{t.collectie.volgende}</span>
          )}
        </nav>
      )}
    </main>
  );
}
