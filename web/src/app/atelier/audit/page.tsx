import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { ACTION_LABELS, ENTITY_LABELS } from "@/lib/audit";
import { AUDIT_PAGE_SIZE, auditPageNumber, buildAuditWhere, parseAuditFilters } from "@/lib/audit-query";
import { t, formatDateTime } from "@/lib/i18n";
import type { AuditEntity } from "@/generated/prisma/client";

export const metadata = { title: "Audit trail — Still Iconic" };

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

  const inputClass = "border hairline bg-white px-3 py-2 text-sm text-black focus:border-black focus:outline-none";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/atelier" className="underline">
          {t.atelier.titel}
        </Link>{" "}
        / {t.papertrail.titel}
      </nav>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl">{t.papertrail.titel}</h1>
          <p className="text-sm text-neutral-500">{t.papertrail.intro(totalCount)}</p>
        </div>
        <a
          href={`/atelier/audit/export${exportQuery.size ? `?${exportQuery.toString()}` : ""}`}
          className="btn-maison-line !px-4 !py-2"
        >
          {t.papertrail.exporteer}
        </a>
      </div>

      <form method="GET" className="mb-6 flex flex-wrap items-end gap-3 border hairline bg-white p-4">
        <label className="flex flex-col gap-1.5">
          <span className="caps-label">{t.papertrail.entiteit}</span>
          <select name="entityType" defaultValue={filters.entityType ?? ""} className={inputClass}>
            <option value="">{t.collectie.alle}</option>
            {Object.entries(ENTITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="caps-label">{t.papertrail.actie}</span>
          <select name="action" defaultValue={filters.action ?? ""} className={inputClass}>
            <option value="">{t.collectie.alle}</option>
            {Object.entries(ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-56 flex-1 flex-col gap-1.5">
          <span className="caps-label">{t.papertrail.zoeken}</span>
          <input
            type="search"
            name="entityId"
            defaultValue={filters.entityId ?? ""}
            placeholder={t.papertrail.zoekenPlaceholder}
            className={inputClass}
          />
        </label>
        <button type="submit" className="btn-maison !px-5 !py-2.5">
          {t.collectie.filteren}
        </button>
        <Link href="/atelier/audit" className="caps-label self-center underline">
          {t.collectie.wissen}
        </Link>
      </form>

      <div className="overflow-x-auto border hairline">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">{t.papertrail.tijdstip}</th>
              <th className="px-4 py-3">{t.papertrail.entiteit}</th>
              <th className="px-4 py-3">{t.papertrail.actie}</th>
              <th className="px-4 py-3">{t.papertrail.vanNaar}</th>
              <th className="px-4 py-3">{t.papertrail.door}</th>
              <th className="px-4 py-3">{t.papertrail.notitie}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  {t.papertrail.geenRegels}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-neutral-100 align-top">
                  <td className="whitespace-nowrap px-4 py-2.5 text-neutral-500">{formatDateTime(row.createdAt)}</td>
                  <td className="px-4 py-2.5">
                    {ENTITY_LABELS[row.entityType as AuditEntity]}
                    <span className="block text-xs text-neutral-400">{row.entityId.slice(-8)}</span>
                  </td>
                  <td className="px-4 py-2.5">{ACTION_LABELS[row.action] ?? row.action}</td>
                  <td className="px-4 py-2.5 text-neutral-600">
                    {row.fromValue ? `${row.fromValue} → ` : ""}
                    {row.toValue ?? ""}
                  </td>
                  <td className="px-4 py-2.5">
                    {row.actor?.name ?? <span className="text-neutral-400">{t.papertrail.systeem}</span>}
                  </td>
                  <td className="max-w-md px-4 py-2.5 text-neutral-600">{row.note}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-neutral-500">{t.papertrail.voetnoot}</p>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-4 text-sm" aria-label="Pagination">
          {page > 1 ? (
            <Link href={pageLink(page - 1)} className="btn-maison-line !px-4 !py-2">
              {t.collectie.vorige}
            </Link>
          ) : (
            <span className="btn-maison-line !px-4 !py-2 opacity-30">{t.collectie.vorige}</span>
          )}
          <span className="caps-label">{t.collectie.pagina(page, totalPages)}</span>
          {page < totalPages ? (
            <Link href={pageLink(page + 1)} className="btn-maison-line !px-4 !py-2">
              {t.collectie.volgende}
            </Link>
          ) : (
            <span className="btn-maison-line !px-4 !py-2 opacity-30">{t.collectie.volgende}</span>
          )}
        </nav>
      )}
    </main>
  );
}
