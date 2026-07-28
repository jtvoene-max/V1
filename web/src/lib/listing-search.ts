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

/**
 * Bouwt de databasevraag uit de filters.
 * `status` staat standaard op ACTIVE (de collectie); het archief van
 * verkochte stukken gebruikt dezelfde filters met status SOLD.
 */
export function buildWhere(f: SearchFilters, status: "ACTIVE" | "SOLD" = "ACTIVE"): Prisma.ListingWhereInput {
  const where: Prisma.ListingWhereInput = { status };

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

/**
 * Filters in gewone taal, bv. "Bags · Black · Caviar · up to €5,000".
 * Gebruikt voor bewaarde zoekopdrachten: een querystring zegt een koper niets.
 */
export function describeFilters(f: SearchFilters): string {
  const delen: string[] = [];
  if (f.q?.trim()) delen.push(`"${f.q.trim()}"`);
  const categorie = CATEGORIES.find((c) => c.value === f.category);
  if (categorie) delen.push(categorie.label);
  if (f.model) delen.push(f.model);
  if (f.condition && CONDITION_LABELS[f.condition]) delen.push(CONDITION_LABELS[f.condition]);
  if (f.color) delen.push(f.color);
  if (f.material) delen.push(f.material);
  if (f.hardware) delen.push(`${f.hardware} hardware`);
  if (f.era) delen.push(`${f.era}s`);
  if (f.sellerType) delen.push(f.sellerType === "BUSINESS" ? t.nav.business : t.nav.private);

  const min = Number(f.minPrice);
  const max = Number(f.maxPrice);
  const heeftMin = Number.isFinite(min) && min > 0;
  const heeftMax = Number.isFinite(max) && max > 0;
  if (heeftMin && heeftMax) delen.push(`${formatPrice(min * 100)} to ${formatPrice(max * 100)}`);
  else if (heeftMin) delen.push(`from ${formatPrice(min * 100)}`);
  else if (heeftMax) delen.push(`up to ${formatPrice(max * 100)}`);

  return delen.length > 0 ? delen.join(" · ") : t.collectie.alles;
}

/** Aantal actieve filters, voor de "wissen"-knop. */
export function activeFilterCount(f: SearchFilters): number {
  const telbaar: (keyof SearchFilters)[] = [
    "q", "category", "condition", "sellerType", "color", "material", "hardware", "model", "era", "minPrice", "maxPrice",
  ];
  return telbaar.filter((k) => f[k]).length;
}
