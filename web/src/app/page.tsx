import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />

      {/* Zoeken en filters (GET-formulier: deelbare URL's, geen client-state nodig) */}
      <form method="GET" className="mb-8 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4">
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-neutral-600">
          Zoeken
          <input
            type="search"
            name="q"
            defaultValue={filters.q ?? ""}
            placeholder="Bijv. Classic Flap, Boy Bag..."
            className="rounded border border-neutral-300 px-3 py-2 text-sm text-black"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          Categorie
          <select name="category" defaultValue={filters.category ?? ""} className="rounded border border-neutral-300 px-2 py-2 text-sm text-black">
            <option value="">Alle</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          Conditie
          <select name="condition" defaultValue={filters.condition ?? ""} className="rounded border border-neutral-300 px-2 py-2 text-sm text-black">
            <option value="">Alle</option>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          Verkoper
          <select name="sellerType" defaultValue={filters.sellerType ?? ""} className="rounded border border-neutral-300 px-2 py-2 text-sm text-black">
            <option value="">Alle</option>
            <option value="PRIVATE">Particulier</option>
            <option value="BUSINESS">Zakelijk</option>
          </select>
        </label>
        <label className="flex w-24 flex-col gap-1 text-xs text-neutral-600">
          Min. prijs
          <input type="number" name="minPrice" min={0} defaultValue={filters.minPrice ?? ""} placeholder="€" className="rounded border border-neutral-300 px-2 py-2 text-sm text-black" />
        </label>
        <label className="flex w-24 flex-col gap-1 text-xs text-neutral-600">
          Max. prijs
          <input type="number" name="maxPrice" min={0} defaultValue={filters.maxPrice ?? ""} placeholder="€" className="rounded border border-neutral-300 px-2 py-2 text-sm text-black" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          Sorteren
          <select name="sort" defaultValue={filters.sort ?? "newest"} className="rounded border border-neutral-300 px-2 py-2 text-sm text-black">
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
          Filteren
        </button>
        <Link href="/" className="px-2 py-2 text-sm text-neutral-500 underline">
          Wissen
        </Link>
      </form>

      <p className="mb-4 text-sm text-neutral-500">
        {totalCount} {totalCount === 1 ? "item" : "items"} gevonden
      </p>

      {listings.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          Geen items gevonden. Probeer een andere zoekterm of minder filters.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
              <article>
                <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-neutral-100">
                  {listing.photos[0] && (
                    <Image
                      src={listing.photos[0].url}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                </div>
                <h2 className="truncate text-sm font-medium">{listing.title}</h2>
                <p className="text-xs text-neutral-500">
                  {CONDITION_LABELS[listing.condition]} ·{" "}
                  {listing.seller.accountType === "BUSINESS" ? "Zakelijke verkoper" : "Particuliere verkoper"}
                </p>
                <p className="mt-1 text-sm font-semibold">{formatPrice(listing.priceCents)}</p>
              </article>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4 text-sm" aria-label="Paginering">
          {page > 1 ? (
            <Link href={`/${filterQuery(filters, { page: String(page - 1) })}`} className="rounded border border-neutral-300 px-3 py-1.5">
              Vorige
            </Link>
          ) : (
            <span className="rounded border border-neutral-200 px-3 py-1.5 text-neutral-300">Vorige</span>
          )}
          <span className="text-neutral-500">
            Pagina {page} van {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/${filterQuery(filters, { page: String(page + 1) })}`} className="rounded border border-neutral-300 px-3 py-1.5">
              Volgende
            </Link>
          ) : (
            <span className="rounded border border-neutral-200 px-3 py-1.5 text-neutral-300">Volgende</span>
          )}
        </nav>
      )}
    </main>
  );
}
