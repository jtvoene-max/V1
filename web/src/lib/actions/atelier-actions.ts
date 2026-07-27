"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ATELIER_ACTIONS } from "@/lib/order-flow";
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
    return { error: "Geen toegang: alleen teamleden kunnen orders verwerken" };
  }
  const actorId = session.user.id;

  const parsed = inputSchema.safeParse({
    orderId: formData.get("orderId"),
    actionKey: formData.get("actionKey"),
    note: formData.get("note") || undefined,
  });
  if (!parsed.success) return { error: "Ongeldige invoer" };

  const action = ATELIER_ACTIONS.find((a) => a.key === parsed.data.actionKey);
  if (!action) return { error: "Onbekende actie" };
  if (action.needsNote && !parsed.data.note?.trim()) {
    return { error: "Een notitie is verplicht bij deze actie" };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    include: { listing: true },
  });
  if (!order) return { error: "Order niet gevonden" };
  if (order.status !== action.from) {
    return { error: `Order heeft niet de verwachte status (${action.from}); ververs de pagina` };
  }

  const note = parsed.data.note?.trim() || null;

  // Alle bijwerkingen van een statusovergang in één transactie,
  // zodat een halve overgang nooit kan bestaan.
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.order.update({ where: { id: order.id }, data: { status: action.to } });
    await tx.orderEvent.create({
      data: { orderId: order.id, fromStatus: action.from, toStatus: action.to, note, actorId },
    });

    switch (action.key) {
      case "create_label":
        // Sendcloud-integratie volgt; tot die tijd een handmatig label-record.
        await tx.shipment.upsert({
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
        break;

      case "receive_item":
        await tx.shipment.updateMany({
          where: { orderId: order.id, leg: "SELLER_TO_PLATFORM" },
          data: { status: "DELIVERED" },
        });
        break;

      case "approve":
      case "reject":
        await tx.inspectionReport.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            result: action.key === "approve" ? "APPROVED" : "REJECTED",
            notes: note,
            inspectorId: actorId,
          },
          update: {
            result: action.key === "approve" ? "APPROVED" : "REJECTED",
            notes: note,
            inspectorId: actorId,
          },
        });
        break;

      case "ship_to_buyer":
        await tx.shipment.upsert({
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
        break;

      case "mark_delivered":
        await tx.shipment.updateMany({
          where: { orderId: order.id, leg: "PLATFORM_TO_BUYER" },
          data: { status: "DELIVERED" },
        });
        break;

      case "complete":
        // Directe uitbetaling; de echte Stripe-transfer volgt in milestone 3/5.
        await tx.payout.upsert({
          where: { orderId: order.id },
          create: {
            orderId: order.id,
            sellerId: order.sellerId,
            amountCents: order.itemPriceCents - order.sellerFeeCents,
            status: "PENDING",
          },
          update: {},
        });
        break;

      case "start_return":
        await tx.shipment.upsert({
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
        break;

      case "finish_return":
        await tx.shipment.updateMany({
          where: { orderId: order.id, leg: "PLATFORM_TO_SELLER_RETURN" },
          data: { status: "DELIVERED" },
        });
        // Item komt weer beschikbaar voor de verkoper als concept.
        await tx.listing.update({ where: { id: order.listingId }, data: { status: "DRAFT" } });
        break;
    }
  });

  revalidatePath("/atelier");
  revalidatePath(`/atelier/order/${order.id}`);
  revalidatePath("/account");
  return undefined;
}
