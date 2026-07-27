import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { t } from "@/lib/i18n";
import {
  buildOrderBy,
  buildWhere,
  CATEGORIES,
  CONDITION_LABELS,
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

  const [listings, totalCount] = await Promise.all([
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
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const inputClass =
    "border hairline bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />

      <div className="mb-10 text-center">
        <p className="caps-gold mb-3">{t.collectie.voorregel}</p>
        <h1 className="font-serif text-3xl">{t.collectie.titel}</h1>
        <div className="goud-lijn mx-auto mt-4" />
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
          {t.collectie.intro}
        </p>
      </div>

      {/* Zoeken en filters (GET: deelbare URL's) */}
      <form method="GET" className="mb-8 flex flex-wrap items-end gap-3 border hairline bg-white p-5">
        <label className="flex min-w-48 flex-1 flex-col gap-1.5">
          <span className="caps-label">{t.collectie.zoeken}</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder={t.collectie.zoekenPlaceholder}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="caps-label">{t.collectie.categorie}</span>
          <select name="category" defaultValue={filters.category ?? ""} className={inputClass}>
            <option value="">{t.collectie.alle}</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="caps-label">{t.collectie.conditie}</span>
          <select name="condition" defaultValue={filters.condition ?? ""} className={inputClass}>
            <option value="">{t.collectie.alle}</option>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="caps-label">{t.collectie.verkoper}</span>
          <select name="sellerType" defaultValue={filters.sellerType ?? ""} className={inputClass}>
            <option value="">{t.collectie.alle}</option>
            <option value="PRIVATE">{t.nav.private}</option>
            <option value="BUSINESS">{t.nav.business}</option>
          </select>
        </label>
        <label className="flex w-24 flex-col gap-1.5">
          <span className="caps-label">{t.collectie.minPrijs}</span>
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice ?? ""} className={inputClass} />
        </label>
        <label className="flex w-24 flex-col gap-1.5">
          <span className="caps-label">{t.collectie.maxPrijs}</span>
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice ?? ""} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="caps-label">{t.collectie.sorteren}</span>
          <select name="sort" defaultValue={filters.sort ?? "newest"} className={inputClass}>
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="btn-maison !px-5 !py-2.5">
          {t.collectie.filteren}
        </button>
        <Link href="/" className="caps-label self-center underline">
          {t.collectie.wissen}
        </Link>
      </form>

      <p className="caps-label mb-5">
        {totalCount} {totalCount === 1 ? t.collectie.stuk : t.collectie.stukken}
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
                    {CONDITION_LABELS[listing.condition]} ·{" "}
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
