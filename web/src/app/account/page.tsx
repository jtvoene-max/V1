import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { ORDER_STATUS_LABELS } from "@/lib/order-flow";
import { formatPrice } from "@/lib/listing-search";
import { t } from "@/lib/i18n";

export const metadata = { title: "My account — Still Iconic" };

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
        <h1 className="font-serif text-3xl">{t.account.titel}</h1>
        <p className="text-sm text-neutral-500">
          {session.user.name} · {isBusiness ? t.account.zakelijkAccount : t.account.priveAccount}
        </p>
      </div>

      <section className="mb-8">
        <h2 className="mb-3 font-medium">
          {t.account.bestellingen} ({purchases.length})
        </h2>
        {purchases.length === 0 ? (
          <p className="border border-dashed hairline p-4 text-sm text-neutral-400">
            {t.account.geenBestellingen}{" "}
            <Link href="/" className="underline">
              {t.account.bekijkCollectie}
            </Link>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {purchases.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border hairline bg-white px-4 py-3 text-sm">
                <span className="font-medium">{o.listing.title}</span>
                <span className="text-neutral-500">
                  {formatPrice(o.itemPriceCents + o.buyerFeeCents + o.buyerShippingCents)}
                </span>
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{ORDER_STATUS_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 font-medium">
          {t.account.listings} ({listings.length})
        </h2>
        {listings.length === 0 ? (
          <p className="border border-dashed hairline p-4 text-sm text-neutral-400">
            {t.account.geenListings}{" "}
            <Link href="/sell" className="underline">
              {t.account.plaatsEerste}
            </Link>
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {listings.map((l) => (
              <Link
                key={l.id}
                href={`/listing/${l.id}`}
                className="flex flex-wrap items-center justify-between gap-2 border hairline bg-white px-4 py-3 text-sm hover:border-neutral-400"
              >
                <span className="font-medium">{l.title}</span>
                <span className="text-neutral-500">{formatPrice(l.priceCents)}</span>
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{t.listingStatus[l.status]}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {sales.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 font-medium">
            {t.account.verkopen} ({sales.length})
          </h2>
          <div className="flex flex-col gap-2">
            {sales.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border hairline bg-white px-4 py-3 text-sm">
                <span className="font-medium">{o.listing.title}</span>
                <span className="text-neutral-500">
                  {t.account.uitbetalingLabel}: {formatPrice(o.itemPriceCents - o.sellerFeeCents)}
                </span>
                <span className="rounded bg-neutral-100 px-2 py-1 text-xs">{ORDER_STATUS_LABELS[o.status]}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {payouts.length > 0 && (
        <section>
          <h2 className="mb-3 font-medium">{t.account.uitbetalingen}</h2>
          <div className="flex flex-col gap-2">
            {payouts.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 border hairline bg-white px-4 py-3 text-sm">
                <span>{p.order.listing.title}</span>
                <span className="font-medium">{formatPrice(p.amountCents)}</span>
                <span className={`rounded px-2 py-1 text-xs ${p.status === "PAID" ? "bg-green-50 text-green-700" : "bg-neutral-100"}`}>
                  {p.status === "PAID" ? t.account.uitbetaald : p.status === "PENDING" ? t.account.inBehandeling : t.account.mislukt}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
