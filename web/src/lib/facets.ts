import { prisma } from "@/lib/prisma";
import { eraLabel } from "@/lib/listing-search";

// Haalt op welke waarden er daadwerkelijk in de collectie voorkomen, met
// aantallen. Zo tonen menu en filters nooit een keuze die nul resultaten geeft.
// De query's zijn groeperingen op geïndexeerde kolommen; dat blijft snel,
// ook bij tienduizenden listings.

export type Facet = { value: string; label: string; count: number };

export type CategoryFacets = {
  models: Facet[];
  materials: Facet[];
  colors: Facet[];
  eras: Facet[];
  total: number;
  featured: { id: string; title: string; priceCents: number; photoUrl: string | null } | null;
};

async function groepeer(veld: "model" | "material" | "color", category?: string): Promise<Facet[]> {
  const rijen = await prisma.listing.groupBy({
    by: [veld],
    where: { status: "ACTIVE", ...(category ? { category } : {}), NOT: { [veld]: null } },
    _count: { _all: true },
    orderBy: { _count: { [veld]: "desc" } },
    take: 12,
  });
  return rijen
    .filter((r) => r[veld])
    .map((r) => ({ value: r[veld] as string, label: r[veld] as string, count: r._count._all }));
}

async function eraFacets(category?: string): Promise<Facet[]> {
  const rijen = await prisma.listing.groupBy({
    by: ["productionYear"],
    where: { status: "ACTIVE", ...(category ? { category } : {}), NOT: { productionYear: null } },
    _count: { _all: true },
  });
  // Jaren samenvoegen tot decennia
  const perDecennium = new Map<number, number>();
  for (const r of rijen) {
    const d = Math.floor((r.productionYear as number) / 10) * 10;
    perDecennium.set(d, (perDecennium.get(d) ?? 0) + r._count._all);
  }
  return [...perDecennium.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([d, count]) => ({ value: String(d), label: `${d}s`, count }));
}

export async function categoryFacets(category?: string): Promise<CategoryFacets> {
  const where = { status: "ACTIVE" as const, ...(category ? { category } : {}) };

  const [models, materials, colors, eras, total, featured] = await Promise.all([
    groepeer("model", category),
    groepeer("material", category),
    groepeer("color", category),
    eraFacets(category),
    prisma.listing.count({ where }),
    // Duurste stuk als uitgelicht item in het menu
    prisma.listing.findFirst({
      where,
      orderBy: { priceCents: "desc" },
      select: {
        id: true,
        title: true,
        priceCents: true,
        photos: { orderBy: { position: "asc" }, take: 1, select: { url: true } },
      },
    }),
  ]);

  return {
    models,
    materials,
    colors,
    eras,
    total,
    featured: featured
      ? {
          id: featured.id,
          title: featured.title,
          priceCents: featured.priceCents,
          photoUrl: featured.photos[0]?.url ?? null,
        }
      : null,
  };
}

/** Alle filterwaarden over de hele collectie, voor de filterbalk. */
export async function allFacets() {
  const [colors, materials, hardware, eras] = await Promise.all([
    groepeer("color"),
    groepeer("material"),
    prisma.listing
      .groupBy({
        by: ["hardware"],
        where: { status: "ACTIVE", NOT: { hardware: null } },
        _count: { _all: true },
        orderBy: { _count: { hardware: "desc" } },
      })
      .then((rijen) =>
        rijen
          .filter((r) => r.hardware)
          .map((r) => ({ value: r.hardware as string, label: r.hardware as string, count: r._count._all }))
      ),
    eraFacets(),
  ]);
  return { colors, materials, hardware, eras };
}

export { eraLabel };
