import type { OrderStatus } from "@/generated/prisma/client";
import { t } from "@/lib/i18n";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = t.orderStatus;

// Welke atelier-actie is toegestaan vanuit welke status.
// De payload beschrijft de knop; de uitvoering zit in atelier-actions.ts.
export type AtelierAction = {
  key: string;
  label: string;
  from: OrderStatus;
  to: OrderStatus;
  variant: "primary" | "success" | "danger";
  needsNote?: boolean;
};

export const ATELIER_ACTIONS: AtelierAction[] = [
  { key: "create_label", label: t.atelierActies.create_label, from: "PAID", to: "AWAITING_ITEM", variant: "primary" },
  { key: "receive_item", label: t.atelierActies.receive_item, from: "AWAITING_ITEM", to: "ITEM_RECEIVED", variant: "primary" },
  { key: "start_inspection", label: t.atelierActies.start_inspection, from: "ITEM_RECEIVED", to: "IN_INSPECTION", variant: "primary" },
  { key: "approve", label: t.atelierActies.approve, from: "IN_INSPECTION", to: "APPROVED", variant: "success", needsNote: true },
  { key: "reject", label: t.atelierActies.reject, from: "IN_INSPECTION", to: "REJECTED", variant: "danger", needsNote: true },
  { key: "ship_to_buyer", label: t.atelierActies.ship_to_buyer, from: "APPROVED", to: "SHIPPED_TO_BUYER", variant: "primary" },
  { key: "mark_delivered", label: t.atelierActies.mark_delivered, from: "SHIPPED_TO_BUYER", to: "DELIVERED", variant: "primary" },
  { key: "complete", label: t.atelierActies.complete, from: "DELIVERED", to: "COMPLETED", variant: "success" },
  { key: "start_return", label: t.atelierActies.start_return, from: "REJECTED", to: "RETURNING_TO_SELLER", variant: "primary" },
  { key: "finish_return", label: t.atelierActies.finish_return, from: "RETURNING_TO_SELLER", to: "CANCELLED", variant: "primary" },
];

export function actionsForStatus(status: OrderStatus): AtelierAction[] {
  return ATELIER_ACTIONS.filter((a) => a.from === status);
}

// Fasen zoals het atelier ze ziet, voor de wachtrij-indeling van het dashboard.
export const ATELIER_QUEUES: { title: string; statuses: OrderStatus[] }[] = [
  { title: t.atelier.wachtrijen["Wacht op label"], statuses: ["PAID"] },
  { title: t.atelier.wachtrijen["Onderweg naar atelier"], statuses: ["AWAITING_ITEM"] },
  { title: t.atelier.wachtrijen["Klaar voor inspectie"], statuses: ["ITEM_RECEIVED", "IN_INSPECTION"] },
  { title: t.atelier.wachtrijen["Klaar voor verzending"], statuses: ["APPROVED"] },
  { title: t.atelier.wachtrijen["Onderweg naar koper"], statuses: ["SHIPPED_TO_BUYER", "DELIVERED"] },
  { title: t.atelier.wachtrijen["Afkeuringen en retouren"], statuses: ["REJECTED", "RETURNING_TO_SELLER"] },
];
