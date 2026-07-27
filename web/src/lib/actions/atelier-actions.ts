"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ATELIER_ACTIONS } from "@/lib/order-flow";
import { logAudit } from "@/lib/audit";
import type { Prisma } from "@/generated/prisma/client";

export type AtelierFormState = { error?: string } | undefined;

const inputSchema = z.object({
  orderId: z.string().min(1),
  actionKey: z.string().min(1),
  note: z.string().max(2000).optional(),
});

export async function atelierAction(_prev: AtelierFormState, formData: FormData): Promise<AtelierFormState> {
  const session = await auth();
  if (!session?.user?.id || (session.user.role !== "TEAM" && session.user.role !== "ADMIN")) {
    return { error: "Access denied: only team members can process orders" };
  }
  const actorId = session.user.id;

  const parsed = inputSchema.safeParse({
    orderId: formData.get("orderId"),
    actionKey: formData.get("actionKey"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return { error: "Invalid input" };

  const action = ATELIER_ACTIONS.find((a) => a.key === parsed.data.actionKey);
  if (!action) return { error: "Unknown action" };
  if (action.needsNote && !parsed.data.note?.trim()) {
    return { error: "A note is required for this action" };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { listing: true },
  });
  if (!order) return { error: "Order not found" };
  if (order.status !== action.from) {
    return { error: `Order is not in the expected status (${action.from}); please refresh the page` };
  }

  const note = parsed.data.note?.trim() || null;

  // Alle bijwerkingen van een statusovergang in één transactie,
  // zodat een halve overgang nooit kan bestaan.
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.order.update({ where: { id: order.id }, data: { status: action.to } });
    await tx.orderEvent.create({
      data: { orderId: order.id, fromStatus: action.from, toStatus: action.to, note, actorId },
    });
    // Papertrail: de statusovergang zelf
    await logAudit(tx, {
      entityType: "ORDER",
      entityId: order.id,
      action: "STATUS_CHANGED",
      fromValue: action.from,
      toValue: action.to,
      note,
      actorId,
    });

    switch (action.key) {
      case "create_label": {
        // Sendcloud-integratie volgt; tot die tijd een handmatig label-record.
        const shipment = await tx.shipment.upsert({
          where: { orderId_leg: { orderId: order.id, leg: "SELLER_TO_PLATFORM" } },
          create: {
            orderId: order.id,
            leg: "SELLER_TO_PLATFORM",
            paidBy: "SELLER",
            status: "LABEL_CREATED",
            insuredValueCents: order.itemPriceCents,
          },
          update: { status: "LABEL_CREATED" },
        });
        await logAudit(tx, {
          entityType: "SHIPMENT",
          entityId: shipment.id,
          action: "LABEL_CREATED",
          toValue: "SELLER_TO_PLATFORM",
          note: `Order ${order.id} · insured ${Math.round(order.itemPriceCents / 100)} EUR`,
          actorId,
        });
        break;
      }

      case "receive_item":
        await tx.shipment.updateMany({
          where: { orderId: order.id, leg: "SELLER_TO_PLATFORM" },
          data: { status: "DELIVERED" },
        });
        await logAudit(tx, {
          entityType: "SHIPMENT",
          entityId: order.id,
          action: "RECEIVED",
          toValue: "SELLER_TO_PLATFORM",
          note: `Order ${order.id} physically received at the atelier`,
          actorId,
        });
        break;

      case "approve":
      case "reject": {
        const result = action.key === "approve" ? "APPROVED" : "REJECTED";
        const report = await tx.inspectionReport.upsert({
          where: { orderId: order.id },
          create: { orderId: order.id, result, notes: note, inspectorId: actorId },
          update: { result, notes: note, inspectorId: actorId },
        });
        await logAudit(tx, {
          entityType: "INSPECTION",
          entityId: report.id,
          action: "INSPECTED",
          toValue: result,
          note,
          actorId,
        });
        break;
      }

      case "ship_to_buyer": {
        const shipment = await tx.shipment.upsert({
          where: { orderId_leg: { orderId: order.id, leg: "PLATFORM_TO_BUYER" } },
          create: {
            orderId: order.id,
            leg: "PLATFORM_TO_BUYER",
            paidBy: "BUYER",
            status: "IN_TRANSIT",
            insuredValueCents: order.itemPriceCents,
          },
          update: { status: "IN_TRANSIT" },
        });
        await logAudit(tx, {
          entityType: "SHIPMENT",
          entityId: shipment.id,
          action: "SHIPPED",
          toValue: "PLATFORM_TO_BUYER",
          note: `Order ${order.id} · insured ${Math.round(order.itemPriceCents / 100)} EUR`,
          actorId,
        });
        break;
      }

      case "mark_delivered":
        await tx.shipment.updateMany({
          where: { orderId: order.id, leg: "PLATFORM_TO_BUYER" },
          data: { status: "DELIVERED" },
        });
        await logAudit(tx, {
          entityType: "SHIPMENT",
          entityId: order.id,
          action: "DELIVERED",
          toValue: "PLATFORM_TO_BUYER",
          note: `Order ${order.id} delivered to the buyer`,
          actorId,
        });
        break;

      case "complete": {
        // Directe uitbetaling; de echte Stripe-transfer volgt in milestone 3/5.
        const payout = await tx.payout.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            sellerId: order.sellerId,
            amountCents: order.itemPriceCents - order.sellerFeeCents,
            status: "PENDING",
          },
          update: {},
        });
        await logAudit(tx, {
          entityType: "PAYOUT",
          entityId: payout.id,
          action: "PAYOUT_CREATED",
          toValue: "PENDING",
          note: `${Math.round(payout.amountCents / 100)} EUR to seller ${order.sellerId} · order ${order.id}`,
          actorId,
        });
        break;
      }

      case "start_return": {
        const shipment = await tx.shipment.upsert({
          where: { orderId_leg: { orderId: order.id, leg: "PLATFORM_TO_SELLER_RETURN" } },
          create: {
            orderId: order.id,
            leg: "PLATFORM_TO_SELLER_RETURN",
            paidBy: "SELLER",
            status: "IN_TRANSIT",
            insuredValueCents: order.itemPriceCents,
          },
          update: { status: "IN_TRANSIT" },
        });
        await logAudit(tx, {
          entityType: "SHIPMENT",
          entityId: shipment.id,
          action: "RETURN_STARTED",
          toValue: "PLATFORM_TO_SELLER_RETURN",
          note: `Order ${order.id} · at the seller's expense`,
          actorId,
        });
        break;
      }

      case "finish_return":
        await tx.shipment.updateMany({
          where: { orderId: order.id, leg: "PLATFORM_TO_SELLER_RETURN" },
          data: { status: "DELIVERED" },
        });
        // Item komt weer beschikbaar voor de verkoper als concept.
        await tx.listing.update({ where: { id: order.listingId }, data: { status: "DRAFT" } });
        await logAudit(tx, {
          entityType: "SHIPMENT",
          entityId: order.id,
          action: "RETURN_FINISHED",
          note: `Order ${order.id} returned to the seller`,
          actorId,
        });
        await logAudit(tx, {
          entityType: "LISTING",
          entityId: order.listingId,
          action: "RELISTED",
          fromValue: "SOLD",
          toValue: "DRAFT",
          note: `After failed inspection of order ${order.id}`,
          actorId,
        });
        break;
    }
  });

  revalidatePath("/atelier");
  revalidatePath(`/atelier/order/${order.id}`);
  revalidatePath("/account");
  return undefined;
}
