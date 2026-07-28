import type { Prisma } from "@/generated/prisma/client";
import { Condition } from "@/generated/prisma/client";
import { t, formatPrice } from "@/lib/i18n";

export { formatPrice };

export const PAGE_SIZE = 24;

export const CATEGORIES = [
  { value: "bag", label: t.categorieen.bag },
  { value: "jewelry", label: t.categorieen.jewelry },
  { value: "accessory", label: t.categorieen.accessory },
] as const;

export const CONDITION_LABELS: Record<string, string> = t.condities;

// Woont in listing-options omdat het verkoopformulier (browser) het nodig heeft
// en dit bestand database-code bevat die daar niet mag komen.
export { CONDITION_ORDER } from "@/lib/listing-options";

export const SORT_OPTIONS = [
  { value: "newest", label: t.sortering.newest },
  { value: "price_asc", label: t.sortering.price_asc },
  { value: "price_desc", label: t.sortering.price_desc },
] as const;

export type SearchFilters = {
  q?: string;
  category?: string;
  condition?: string;
  sellerType?: string;
  color?: string;
  material?: string;
  hardware?: string;
  model?: string;
  era?: string; // "1990" betekent 1990 t/m 1999
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

export function parseFilters(params: Record<string, string | string[] | undefined>): SearchFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
  return {
    q: first(params.q),
    category: first(params.category),
    condition: first(params.condition),
    sellerType: first(params.sellerType),
    color: first(params.color),
    material: first(params.material),
    hardware: first(params.hardware),
    model: first(params.model),
    era: first(params.era),
    minPrice: first(params.minPrice),
    maxPrice: first(params.maxPrice),
    sort: first(params.sort),
    page: first(params.page),
  };
}

export function buildWhere(f: SearchFilters): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = { status: "ACTIVE" };

  if (f.q?.trim()) {
    const q = f.q.trim();
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { model: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (f.category && CATEGORIES.some((c) => c.value === f.category)) {
    where.category = f.category;
  }
  if (f.condition && f.condition in Condition) {
    where.condition = f.condition as Condition;
  }
  if (f.sellerType === "PRIVATE" || f.sellerType === "BUSINESS") {
    where.seller = { accountType: f.sellerType };
  }
  if (f.color?.trim()) where.color = f.color.trim();
  if (f.material?.trim()) where.material = f.material.trim();
  if (f.hardware?.trim()) where.hardware = f.hardware.trim();
  if (f.model?.trim()) where.model = f.model.trim();

  // Era: het decennium waarin het stuk gemaakt is
  const decennium = Number(f.era);
  if (Number.isInteger(decennium) && decennium > 1900) {
    where.productionYear = { gte: decennium, lte: decennium + 9 };
  }

  const min = Number(f.minPrice);
  const max = Number(f.maxPrice);
  if (Number.isFinite(min) && min > 0) {
    where.priceCents = { ...(where.priceCents as object), gte: Math.round(min * 100) };
  }
  if (Number.isFinite(max) && max > 0) {
    where.priceCents = { ...(where.priceCents as object), lte: Math.round(max * 100) };
  }
  return where;
}

export function buildOrderBy(f: SearchFilters): Prisma.ListingOrderByWithRelationInput {
  switch (f.sort) {
    case "price_asc":
      return { priceCents: "asc" };
    case "price_desc":
      return { priceCents: "desc" };
    default:
      return { createdAt: "desc" };
  }
}

export function pageNumber(f: SearchFilters): number {
  const p = Number(f.page);
  return Number.isInteger(p) && p >= 1 ? p : 1;
}

/** "1990s" uit een productiejaar */
export function eraLabel(year: number | null | undefined): string | null {
  if (!year) return null;
  return `${Math.floor(year / 10) * 10}s`;
}

/** Querystring voor pagineringslinks en menu-links, met behoud van filters. */
export function filterQuery(f: SearchFilters, overrides: Partial<SearchFilters>): string {
  const merged = { ...f, ...overrides };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value && value !== "") params.set(key, value);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

/** Aantal actieve filters, voor de "wissen"-knop. */
export function activeFilterCount(f: SearchFilters): number {
  const telbaar: (keyof SearchFilters)[] = [
    "q", "category", "condition", "sellerType", "color", "material", "hardware", "model", "era", "minPrice", "maxPrice",
  ];
  return telbaar.filter((k) => f[k]).length;
}
