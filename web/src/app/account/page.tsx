import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { ORDER_STATUS_LABELS } from "@/lib/order-flow";
import { formatPrice } from "@/lib/listing-search";

export const metadata = { title: "Mijn account — Timeless Marketplace" };

const LISTING_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Concept",
  ACTIVE: "Te koop",
  RESERVED: "Gereserveerd",
  SOLD: "Verkocht",
  WITHDRAWN: "Ingetrokken",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const userId = session.user.id;

  const [purchases, listings, sales, payouts] = await Promise.all([
    prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { updatedAt: "desc" },
      include: { listing: { select: { title: true } } },
    }),
    prisma.listing.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.order.findMany({
      where: { sellerId: userId },
      orderBy: { updatedAt: "desc" },
      include: { listing: { select: { title: true } } },
    }),
    prisma.payout.findMany({
      where: { sellerId: userId },
      orderBy: { createdAt: "desc" },
      include: { order: { include: { listing: { select: { title: true } } } } },
    }),
  ]);

  const isBusiness = session.user.accountType === "BUSINESS";

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <SiteHeader />
      <div className="mb-8">
        <h1 className="font-serif text-3xl">Mijn account</h1>
        <p className="text-sm text-neutral-500">
          {session.user.name} · {isBusiness ? "zakelijk account" : "particulier account"}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-medium">Mijn bestellingen ({purchases.length})</h2>
        {purchases.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-400">
            Nog geen bestellingen.{" "}
            <Link href="/" className="underline">
              Bekijk de collectie
            </Link>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {purchases.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm">
                <span className="font-medium">{o.listing.title}</span>
                <span className="text-neutral-500">{formatPrice(o.itemPriceCents + o.buyerFeeCents + o.buyerShippingCents)}</span>
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{ORDER_STATUS_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-medium">Mijn listings ({listings.length})</h2>
        {listings.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-400">
            Nog geen listings.{" "}
            <Link href="/sell" className="underline">
              Plaats je eerste item
            </Link>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm hover:border-neutral-400"
              >
                <span className="font-medium">{l.title}</span>
                <span className="text-neutral-500">{formatPrice(l.priceCents)}</span>
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{LISTING_STATUS_LABELS[l.status]}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {sales.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-medium">Mijn verkopen ({sales.length})</h2>
          <div className="flex flex-col gap-2">
            {sales.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm">
                <span className="font-medium">{o.listing.title}</span>
                <span className="text-neutral-500">
                  uitbetaling: {formatPrice(o.itemPriceCents - o.sellerFeeCents)}
                </span>
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{ORDER_STATUS_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {payouts.length > 0 && (
        <section>
          <h2 className="mb-3 font-medium">Uitbetalingen</h2>
          <div className="flex flex-col gap-2">
            {payouts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm">
                <span>{p.order.listing.title}</span>
                <span className="font-medium">{formatPrice(p.amountCents)}</span>
                <span className={`rounded px-2 py-1 text-xs ${p.status === "PAID" ? "bg-green-50 text-green-700" : "bg-neutral-100"}`}>
                  {p.status === "PAID" ? "Uitbetaald" : p.status === "PENDING" ? "In behandeling" : "Mislukt"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
