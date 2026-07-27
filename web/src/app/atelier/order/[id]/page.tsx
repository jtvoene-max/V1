import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { actionsForStatus, ORDER_STATUS_LABELS } from "@/lib/order-flow";
import { formatPrice, CONDITION_LABELS } from "@/lib/listing-search";
import { ActionPanel } from "./action-panel";

const LEG_LABELS: Record<string, string> = {
  SELLER_TO_PLATFORM: "Verkoper → atelier",
  PLATFORM_TO_BUYER: "Atelier → koper",
  PLATFORM_TO_SELLER_RETURN: "Retour: atelier → verkoper",
};
const SHIPMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Nog niet aangemaakt",
  LABEL_CREATED: "Label aangemaakt",
  IN_TRANSIT: "Onderweg",
  DELIVERED: "Bezorgd",
};

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
  const datum = (d: Date) =>
    new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" }).format(d);

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <SiteHeader />
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/atelier" className="underline">
          Atelier
        </Link>{" "}
        / Order
      </nav>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">{order.listing.title}</h1>
          <p className="text-sm text-neutral-500">
            Order {order.id.slice(-8)} · {CONDITION_LABELS[order.listing.condition]}
            {order.listing.serialNumber ? ` · serienummer ${order.listing.serialNumber}` : ""}
          </p>
        </div>
        <span className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white">
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg border border-neutral-200 p-4 text-sm">
          <h2 className="mb-2 font-medium">Partijen</h2>
          <p>
            <span className="text-neutral-500">Verkoper:</span>{" "}
            {order.seller.accountType === "BUSINESS" ? (order.seller.companyName ?? order.seller.name) : order.seller.name}{" "}
            <span className="text-xs text-neutral-400">
              ({order.seller.accountType === "BUSINESS" ? "zakelijk" : "particulier"}, {order.seller.email})
            </span>
          </p>
          <p className="mt-1">
            <span className="text-neutral-500">Koper:</span> {order.buyer.name}{" "}
            <span className="text-xs text-neutral-400">
              ({order.buyer.accountType === "BUSINESS" ? "zakelijk" : "particulier"}, {order.buyer.email})
            </span>
          </p>
        </section>
        <section className="rounded-lg border border-neutral-200 p-4 text-sm">
          <h2 className="mb-2 font-medium">Bedragen</h2>
          <dl className="grid grid-cols-2 gap-y-1">
            <dt className="text-neutral-500">Itemprijs</dt>
            <dd className="text-right">{formatPrice(order.itemPriceCents)}</dd>
            <dt className="text-neutral-500">Kopersfee</dt>
            <dd className="text-right">{formatPrice(order.buyerFeeCents)}</dd>
            <dt className="text-neutral-500">Verkopersfee</dt>
            <dd className="text-right">− {formatPrice(order.sellerFeeCents)}</dd>
            <dt className="text-neutral-500">Uitbetaling verkoper</dt>
            <dd className="text-right font-medium">{formatPrice(order.itemPriceCents - order.sellerFeeCents)}</dd>
          </dl>
          {order.payout && (
            <p className="mt-2 rounded bg-neutral-50 px-2 py-1 text-xs">
              Payout: {formatPrice(order.payout.amountCents)} ({order.payout.status === "PAID" ? "uitbetaald" : order.payout.status === "PENDING" ? "in behandeling" : "mislukt"})
            </p>
          )}
        </section>
      </div>

      <section className="mb-6 rounded-lg border border-neutral-200 p-4 text-sm">
        <h2 className="mb-2 font-medium">Verzendingen</h2>
        {order.shipments.length === 0 ? (
          <p className="text-neutral-400">Nog geen verzendingen</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {order.shipments.map((s) => (
              <li key={s.id} className="flex flex-wrap justify-between gap-2">
                <span>{LEG_LABELS[s.leg]}</span>
                <span className="text-neutral-500">
                  {SHIPMENT_STATUS_LABELS[s.status]}
                  {s.trackingNumber ? ` · ${s.trackingNumber}` : ""}
                  {s.insuredValueCents ? ` · verzekerd ${formatPrice(s.insuredValueCents)}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {order.inspection && (
        <section className="mb-6 rounded-lg border border-neutral-200 p-4 text-sm">
          <h2 className="mb-2 font-medium">Inspectierapport</h2>
          <p>
            <span className={order.inspection.result === "APPROVED" ? "text-green-700" : "text-red-700"}>
              {order.inspection.result === "APPROVED" ? "Goedgekeurd" : "Afgekeurd"}
            </span>{" "}
            door {order.inspection.inspector.name} op {datum(order.inspection.createdAt)}
          </p>
          {order.inspection.notes && <p className="mt-1 text-neutral-600">{order.inspection.notes}</p>}
        </section>
      )}

      {actions.length > 0 && <ActionPanel orderId={order.id} actions={actions} />}

      <section className="mt-6 rounded-lg border border-neutral-200 p-4 text-sm">
        <h2 className="mb-3 font-medium">Geschiedenis</h2>
        <ul className="flex flex-col gap-2">
          {order.events.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-2 border-b border-dashed border-neutral-100 pb-2 last:border-0">
              <span className="text-neutral-400">{datum(e.createdAt)}</span>
              <span>
                {e.fromStatus ? `${ORDER_STATUS_LABELS[e.fromStatus]} → ` : ""}
                <b>{ORDER_STATUS_LABELS[e.toStatus]}</b>
              </span>
              <span className="text-neutral-500">{e.actor ? `door ${e.actor.name}` : "automatisch"}</span>
              {e.note && <span className="w-full text-neutral-500">„{e.note}"</span>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
