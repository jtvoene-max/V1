import type { AuditEntity, Prisma } from "@/generated/prisma/client";

// Eén plek voor alle papertrail-regels. Werkt binnen een transactie (tx)
// of rechtstreeks op de client, zodat een audit-regel altijd samen met de
// wijziging zelf wordt vastgelegd.

type AuditClient = Prisma.TransactionClient | { auditLog: Prisma.TransactionClient["auditLog"] };

export type AuditInput = {
  entityType: AuditEntity;
  entityId: string;
  action: string;
  fromValue?: string | null;
  toValue?: string | null;
  note?: string | null;
  actorId?: string | null;
};

export async function logAudit(db: AuditClient, input: AuditInput) {
  await db.auditLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      fromValue: input.fromValue ?? null,
      toValue: input.toValue ?? null,
      note: input.note ?? null,
      actorId: input.actorId ?? null,
    },
  });
}

export const ENTITY_LABELS: Record<AuditEntity, string> = {
  USER: "Gebruiker",
  LISTING: "Listing",
  OFFER: "Bod",
  ORDER: "Order",
  SHIPMENT: "Verzending",
  INSPECTION: "Inspectie",
  PAYOUT: "Uitbetaling",
};

export const ACTION_LABELS: Record<string, string> = {
  CREATED: "Aangemaakt",
  STATUS_CHANGED: "Status gewijzigd",
  INSPECTED: "Gekeurd",
  PAYOUT_CREATED: "Uitbetaling klaargezet",
  LABEL_CREATED: "Verzendlabel aangemaakt",
  RECEIVED: "Ontvangen",
  SHIPPED: "Verzonden",
  DELIVERED: "Bezorgd",
  RETURN_STARTED: "Retour gestart",
  RETURN_FINISHED: "Retour afgerond",
  RELISTED: "Terug naar concept",
};
