import type { AuditEntity, Prisma } from "@/generated/prisma/client";

export const AUDIT_PAGE_SIZE = 50;

export type AuditFilters = {
  entityType?: string;
  action?: string;
  entityId?: string;
  page?: string;
};

const ENTITY_VALUES = ["USER", "LISTING", "OFFER", "ORDER", "SHIPMENT", "INSPECTION", "PAYOUT"];

export function parseAuditFilters(params: Record<string, string | string[] | undefined>): AuditFilters {
  const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;
  return {
    entityType: first(params.entityType),
    action: first(params.action),
    entityId: first(params.entityId),
    page: first(params.page),
  };
}

export function buildAuditWhere(f: AuditFilters): Prisma.AuditLogWhereInput {
  const where: Prisma.AuditLogWhereInput = {};
  if (f.entityType && ENTITY_VALUES.includes(f.entityType)) {
    where.entityType = f.entityType as AuditEntity;
  }
  if (f.action?.trim()) {
    where.action = f.action.trim();
  }
  if (f.entityId?.trim()) {
    // Zoekt op entiteit-id én in de notitie, zodat je ook op ordernummer
    // kunt zoeken bij regels die over een gerelateerde entiteit gaan.
    const q = f.entityId.trim();
    where.OR = [{ entityId: { contains: q } }, { note: { contains: q, mode: "insensitive" } }];
  }
  return where;
}

export function auditPageNumber(f: AuditFilters): number {
  const p = Number(f.page);
  return Number.isInteger(p) && p >= 1 ? p : 1;
}
