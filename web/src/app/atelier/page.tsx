import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { ATELIER_QUEUES, ORDER_STATUS_LABELS } from "@/lib/order-flow";
import { formatPrice } from "@/lib/listing-search";
import type { OrderStatus } from "@/generated/prisma/client";

export const metadata = { title: "Atelier — Timeless Marketplace" };

export default async function AtelierDashboard() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEAM" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  const activeStatuses = ATELIER_QUEUES.flatMap((q) => q.statuses);
  const [orders, doneCount] = await Promise.all([
    prisma.order.findMany({
      where: { status: { in: activeStatuses } },
      orderBy: { updatedAt: "asc" }, // oudste eerst: die wachten het langst
      include: {
        listing: { select: { title: true } },
        buyer: { select: { name: true } },
        seller: { select: { name: true, companyName: true, accountType: true } },
      },
    }),
    prisma.order.count({ where: { status: { in: ["COMPLETED", "CANCELLED"] } } }),
  ]);

  const byStatus = new Map<OrderStatus, typeof orders>();
  for (const order of orders) {
    const list = byStatus.get(order.status) ?? [];
    list.push(order);
    byStatus.set(order.status, list);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Atelier</h1>
          <p className="text-sm text-neutral-500">
            {orders.length} lopende orders · {doneCount} afgerond of geannuleerd
          </p>
        </div>
        <Link href="/atelier/audit" className="rounded border border-black px-3 py-1.5 text-sm font-medium">
          Papertrail
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        {ATELIER_QUEUES.map((queue) => {
          const queueOrders = queue.statuses.flatMap((s) => byStatus.get(s) ?? []);
          return (
            <section key={queue.title}>
              <h2 className="mb-3 flex items-center gap-2 font-medium">
                {queue.title}
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                  {queueOrders.length}
                </span>
              </h2>
              {queueOrders.length === 0 ? (
                <p className="rounded-lg border border-dashed border-neutral-200 p-4 text-sm text-neutral-400">
                  Geen orders in deze fase
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {queueOrders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/atelier/order/${order.id}`}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm hover:border-neutral-400"
                    >
                      <span className="font-medium">{order.listing.title}</span>
                      <span className="text-neutral-500">
                        {formatPrice(order.itemPriceCents)} · verkoper:{" "}
                        {order.seller.accountType === "BUSINESS"
                          ? (order.seller.companyName ?? order.seller.name)
                          : order.seller.name}{" "}
                        · koper: {order.buyer.name}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-600">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
