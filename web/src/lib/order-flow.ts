import type { OrderStatus } from "@/generated/prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Wacht op betaling",
  PAID: "Betaald, wacht op inzending",
  AWAITING_ITEM: "Onderweg naar atelier",
  ITEM_RECEIVED: "Ontvangen in atelier",
  IN_INSPECTION: "In inspectie",
  APPROVED: "Goedgekeurd",
  REJECTED: "Afgekeurd",
  RETURNING_TO_SELLER: "Retour naar verkoper",
  SHIPPED_TO_BUYER: "Onderweg naar koper",
  DELIVERED: "Geleverd",
  COMPLETED: "Afgerond",
  CANCELLED: "Geannuleerd",
  REFUNDED: "Terugbetaald",
};

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
  { key: "create_label", label: "Verzendlabel naar verkoper aanmaken", from: "PAID", to: "AWAITING_ITEM", variant: "primary" },
  { key: "receive_item", label: "Item binnenboeken", from: "AWAITING_ITEM", to: "ITEM_RECEIVED", variant: "primary" },
  { key: "start_inspection", label: "Start inspectie", from: "ITEM_RECEIVED", to: "IN_INSPECTION", variant: "primary" },
  { key: "approve", label: "Goedkeuren (authentiek)", from: "IN_INSPECTION", to: "APPROVED", variant: "success", needsNote: true },
  { key: "reject", label: "Afkeuren", from: "IN_INSPECTION", to: "REJECTED", variant: "danger", needsNote: true },
  { key: "ship_to_buyer", label: "Verzenden naar koper", from: "APPROVED", to: "SHIPPED_TO_BUYER", variant: "primary" },
  { key: "mark_delivered", label: "Markeer als geleverd", from: "SHIPPED_TO_BUYER", to: "DELIVERED", variant: "primary" },
  { key: "complete", label: "Afronden en uitbetaling starten", from: "DELIVERED", to: "COMPLETED", variant: "success" },
  { key: "start_return", label: "Retourzending naar verkoper starten", from: "REJECTED", to: "RETURNING_TO_SELLER", variant: "primary" },
  { key: "finish_return", label: "Retour afgerond, order annuleren", from: "RETURNING_TO_SELLER", to: "CANCELLED", variant: "primary" },
];

export function actionsForStatus(status: OrderStatus): AtelierAction[] {
  return ATELIER_ACTIONS.filter((a) => a.from === status);
}

// Fasen zoals het atelier ze ziet, voor de wachtrij-indeling van het dashboard.
export const ATELIER_QUEUES: { title: string; statuses: OrderStatus[] }[] = [
  { title: "Wacht op label", statuses: ["PAID"] },
  { title: "Onderweg naar atelier", statuses: ["AWAITING_ITEM"] },
  { title: "Klaar voor inspectie", statuses: ["ITEM_RECEIVED", "IN_INSPECTION"] },
  { title: "Klaar voor verzending", statuses: ["APPROVED"] },
  { title: "Onderweg naar koper", statuses: ["SHIPPED_TO_BUYER", "DELIVERED"] },
  { title: "Afkeuringen en retouren", statuses: ["REJECTED", "RETURNING_TO_SELLER"] },
];
