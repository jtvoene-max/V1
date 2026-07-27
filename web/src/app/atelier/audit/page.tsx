import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { ACTION_LABELS, ENTITY_LABELS } from "@/lib/audit";
import { AUDIT_PAGE_SIZE, auditPageNumber, buildAuditWhere, parseAuditFilters } from "@/lib/audit-query";
import type { AuditEntity } from "@/generated/prisma/client";

export const metadata = { title: "Papertrail — Timeless Marketplace" };

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEAM" && session.user.role !== "ADMIN")) {
    redirect("/");
  }

  const filters = parseAuditFilters(await searchParams);
  const where = buildAuditWhere(filters);
  const page = auditPageNumber(filters);

  const [rows, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * AUDIT_PAGE_SIZE,
      take: AUDIT_PAGE_SIZE,
      include: { actor: { select: { name: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / AUDIT_PAGE_SIZE));

  const exportQuery = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v && k !== "page") exportQuery.set(k, v);
  }

  const pageLink = (p: number) => {
    const q = new URLSearchParams(exportQuery);
    q.set("page", String(p));
    return `/atelier/audit?${q.toString()}`;
  };

  const datum = (d: Date) =>
    new Intl.DateTimeFormat("nl-NL", { dateStyle: "short", timeStyle: "medium" }).format(d);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/atelier" className="underline">
          Atelier
        </Link>{" "}
        / Papertrail
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Papertrail</h1>
          <p className="text-sm text-neutral-500">
            {totalCount} regels · append-only, regels worden nooit gewijzigd of verwijderd
          </p>
        </div>
        <a
          href={`/atelier/audit/export${exportQuery.size ? `?${exportQuery.toString()}` : ""}`}
          className="rounded border border-black px-3 py-1.5 text-sm font-medium"
        >
          Exporteer als CSV
        </a>
      </div>

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3 rounded-lg border border-neutral-200 p-4">
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          Entiteit
          <select name="entityType" defaultValue={filters.entityType ?? ""} className="rounded border border-neutral-300 px-2 py-2 text-sm text-black">
            <option value="">Alle</option>
            {Object.entries(ENTITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-600">
          Actie
          <select name="action" defaultValue={filters.action ?? ""} className="rounded border border-neutral-300 px-2 py-2 text-sm text-black">
            <option value="">Alle</option>
            {Object.entries(ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-56 flex-1 flex-col gap-1 text-xs text-neutral-600">
          Zoek op id of notitie
          <input
            type="search"
            name="entityId"
            defaultValue={filters.entityId ?? ""}
            placeholder="Bijv. een order-id of 'retour'"
            className="rounded border border-neutral-300 px-3 py-2 text-sm text-black"
          />
        </label>
        <button type="submit" className="rounded bg-black px-4 py-2 text-sm text-white">
          Filteren
        </button>
        <Link href="/atelier/audit" className="px-2 py-2 text-sm text-neutral-500 underline">
          Wissen
        </Link>
      </form>

      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Tijdstip</th>
              <th className="px-4 py-3">Entiteit</th>
              <th className="px-4 py-3">Actie</th>
              <th className="px-4 py-3">Van → naar</th>
              <th className="px-4 py-3">Door</th>
              <th className="px-4 py-3">Notitie</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  Geen regels gevonden met deze filters
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-100 align-top">
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500">{datum(row.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    {ENTITY_LABELS[row.entityType as AuditEntity]}
                    <span className="block text-xs text-neutral-400">{row.entityId.slice(-8)}</span>
                  </td>
                  <td className="px-4 py-2.5">{ACTION_LABELS[row.action] ?? row.action}</td>
                  <td className="px-4 py-2.5 text-neutral-600">
                    {row.fromValue ? `${row.fromValue} → ` : ""}
                    {row.toValue ?? ""}
                  </td>
                  <td className="px-4 py-2.5">{row.actor?.name ?? <span className="text-neutral-400">systeem</span>}</td>
                  <td className="max-w-md px-4 py-2.5 text-neutral-600">{row.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4 text-sm" aria-label="Paginering">
          {page > 1 ? (
            <Link href={pageLink(page - 1)} className="rounded border border-neutral-300 px-3 py-1.5">
              Vorige
            </Link>
          ) : (
            <span className="rounded border border-neutral-200 px-3 py-1.5 text-neutral-300">Vorige</span>
          )}
          <span className="text-neutral-500">
            Pagina {page} van {totalPages}
          </span>
          {page < totalPages ? (
            <Link href={pageLink(page + 1)} className="rounded border border-neutral-300 px-3 py-1.5">
              Volgende
            </Link>
          ) : (
            <span className="rounded border border-neutral-200 px-3 py-1.5 text-neutral-300">Volgende</span>
          )}
        </nav>
      )}
    </main>
  );
}
