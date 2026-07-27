import type { Prisma } from "@/generated/prisma/client";
import { Condition } from "@/generated/prisma/client";

export const PAGE_SIZE = 24;

export const CATEGORIES = [
  { value: "bag", label: "Tassen" },
  { value: "jewelry", label: "Sieraden" },
  { value: "accessory", label: "Accessoires" },
] as const;

export const CONDITION_LABELS: Record<string, string> = {
  EXCELLENT: "Uitstekend",
  GOOD: "Goed",
  VISIBLE_WEAR: "Gebruikssporen",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Nieuwste eerst" },
  { value: "price_asc", label: "Prijs laag-hoog" },
  { value: "price_desc", label: "Prijs hoog-laag" },
] as const;

export type SearchFilters = {
  q?: string;
  category?: string;
  condition?: string;
  sellerType?: string;
  minPrice?: string; // in euro's, uit de querystring
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

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

/** Querystring voor pagineringslinks, met behoud van actieve filters. */
export function filterQuery(f: SearchFilters, overrides: Partial<SearchFilters>): string {
  const merged = { ...f, ...overrides };
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value && value !== "") params.set(key, value);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}
