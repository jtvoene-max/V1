import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { buildAuditWhere, parseAuditFilters } from "@/lib/audit-query";

// CSV-export van het papertrail, met dezelfde filters als de pagina.
// Maximaal 10.000 regels per export; gebruik filters voor grotere periodes.
const EXPORT_LIMIT = 10000;

function csvEscape(value: string | null | undefined): string {
  const s = value ?? "";
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEAM" && session.user.role !== "ADMIN")) {
    return new NextResponse("Access denied", { status: 403 });
  }

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const where = buildAuditWhere(parseAuditFilters(params));

  const rows = await prisma.auditLog.findMany({
    where,
    orderBy: { createdAt: "asc" },
    take: EXPORT_LIMIT,
    include: { actor: { select: { name: true, email: true } } },
  });

  const header = "timestamp;entity;entity_id;action;from;to;by;by_email;note";
  const lines = rows.map((r) =>
    [
      r.createdAt.toISOString(),
      r.entityType,
      r.entityId,
      r.action,
      csvEscape(r.fromValue),
      csvEscape(r.toValue),
      csvEscape(r.actor?.name ?? "system"),
      csvEscape(r.actor?.email ?? ""),
      csvEscape(r.note),
    ].join(";")
  );
  const csv = "﻿" + [header, ...lines].join("\r\n"); // BOM voor Excel

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="audit-trail-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
