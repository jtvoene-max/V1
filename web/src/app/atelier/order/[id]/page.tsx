import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { actionsForStatus, ORDER_STATUS_LABELS } from "@/lib/order-flow";
import { formatPrice, CONDITION_LABELS } from "@/lib/listing-search";
import { t, formatDateTime } from "@/lib/i18n";
import { ActionPanel } from "./action-panel";

export default async function AtelierOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEAM" && session.user.role !== "ADMIN")) {
    redirect("/");
  }
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      listing: { include: { photos: { orderBy: { position: "asc" }, take: 1 } } },
      buyer: { select: { name: true, email: true, accountType: true, companyName: true } },
      seller: { select: { name: true, email: true, accountType: true, companyName: true } },
      shipments: true,
      inspection: { include: { inspector: { select: { name: true } } } },
      payout: true,
      events: { orderBy: { createdAt: "asc" }, include: { actor: { select: { name: true } } } },
    },
  });
  if (!order) notFound();

  const actions = actionsForStatus(order.status);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <SiteHeader />
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/atelier" className="underline">
          {t.atelier.titel}
        </Link>{" "}
        / {t.atelier.order}
      </nav>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">{order.listing.title}</h1>
          <p className="text-sm text-neutral-500">
            {t.atelier.order} {order.id.slice(-8)} · {CONDITION_LABELS[order.listing.condition]}
            {order.listing.serialNumber ? ` · ${t.atelier.serienummer} ${order.listing.serialNumber}` : ""}
          </p>
        </div>
        <span className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <section className="border hairline p-4 text-sm">
          <h2 className="mb-2 font-medium">{t.atelier.partijen}</h2>
          <p>
            <span className="text-neutral-500">{t.listing.verkoper}:</span>{" "}
            {order.seller.accountType === "BUSINESS" ? (order.seller.companyName ?? order.seller.name) : order.seller.name}{" "}
            <span className="text-xs text-neutral-400">
              ({order.seller.accountType === "BUSINESS" ? t.listing.zakelijkKort : t.listing.priveKort}, {order.seller.email})
            </span>
          </p>
          <p className="mt-1">
            <span className="text-neutral-500">Buyer:</span> {order.buyer.name}{" "}
            <span className="text-xs text-neutral-400">
              ({order.buyer.accountType === "BUSINESS" ? t.listing.zakelijkKort : t.listing.priveKort}, {order.buyer.email})
            </span>
          </p>
        </section>
        <section className="border hairline p-4 text-sm">
          <h2 className="mb-2 font-medium">{t.atelier.bedragen}</h2>
          <dl className="grid grid-cols-2 gap-y-1">
            <dt className="text-neutral-500">{t.atelier.itemprijs}</dt>
            <dd className="text-right">{formatPrice(order.itemPriceCents)}</dd>
            <dt className="text-neutral-500">{t.atelier.kopersfee}</dt>
            <dd className="text-right">{formatPrice(order.buyerFeeCents)}</dd>
            <dt className="text-neutral-500">{t.atelier.verkopersfee}</dt>
            <dd className="text-right">− {formatPrice(order.sellerFeeCents)}</dd>
            <dt className="text-neutral-500">{t.atelier.uitbetaling}</dt>
            <dd className="text-right font-medium">{formatPrice(order.itemPriceCents - order.sellerFeeCents)}</dd>
          </dl>
          {order.payout && (
            <p className="mt-2 rounded bg-neutral-50 px-2 py-1 text-xs">
              {t.atelier.payout}: {formatPrice(order.payout.amountCents)} (
              {order.payout.status === "PAID"
                ? t.account.uitbetaald.toLowerCase()
                : order.payout.status === "PENDING"
                  ? t.account.inBehandeling.toLowerCase()
                  : t.account.mislukt.toLowerCase()}
              )
            </p>
          )}
        </section>
      </div>

      <section className="mb-6 border hairline p-4 text-sm">
        <h2 className="mb-2 font-medium">{t.atelier.verzendingen}</h2>
        {order.shipments.length === 0 ? (
          <p className="text-neutral-400">{t.atelier.geenVerzendingen}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {order.shipments.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <span>{t.verzending.legs[s.leg]}</span>
                <span className="text-neutral-500">
                  {t.verzending.statussen[s.status]}
                  {s.trackingNumber ? ` · ${s.trackingNumber}` : ""}
                  {s.insuredValueCents ? ` · ${t.verzending.verzekerd} ${formatPrice(s.insuredValueCents)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {order.inspection && (
        <section className="mb-6 border hairline p-4 text-sm">
          <h2 className="mb-2 font-medium">{t.atelier.inspectierapport}</h2>
          <p>
            <span className={order.inspection.result === "APPROVED" ? "text-green-700" : "text-red-700"}>
              {order.inspection.result === "APPROVED" ? t.atelier.goedgekeurd : t.atelier.afgekeurd}
            </span>{" "}
            {t.atelier.door} {order.inspection.inspector.name} {t.atelier.op} {formatDateTime(order.inspection.createdAt)}
          </p>
          {order.inspection.notes && <p className="mt-1 text-neutral-600">{order.inspection.notes}</p>}
        </section>
      )}

      {actions.length > 0 && <ActionPanel orderId={order.id} actions={actions} />}

      <section className="mt-6 border hairline p-4 text-sm">
        <h2 className="mb-3 font-medium">{t.atelier.geschiedenis}</h2>
        <ul className="flex flex-col gap-2">
          {order.events.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-2 border-b border-dashed border-neutral-100 pb-2 last:border-0">
              <span className="text-neutral-400">{formatDateTime(e.createdAt)}</span>
              <span>
                {e.fromStatus ? `${ORDER_STATUS_LABELS[e.fromStatus]} → ` : ""}
                <b>{ORDER_STATUS_LABELS[e.toStatus]}</b>
              </span>
              <span className="text-neutral-500">
                {e.actor ? `${t.atelier.door} ${e.actor.name}` : t.atelier.automatisch}
              </span>
              {e.note && <span className="w-full text-neutral-500">&ldquo;{e.note}&rdquo;</span>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
