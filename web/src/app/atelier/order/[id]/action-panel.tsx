"use client";

import { useActionState } from "react";
import { atelierAction, type AtelierFormState } from "@/lib/actions/atelier-actions";
import type { AtelierAction } from "@/lib/order-flow";
import { t } from "@/lib/i18n";

const VARIANT_CLASSES: Record<AtelierAction["variant"], string> = {
  primary: "bg-black text-white",
  success: "bg-green-700 text-white",
  danger: "bg-red-700 text-white",
};

export function ActionPanel({ orderId, actions }: { orderId: string; actions: AtelierAction[] }) {
  const [state, formAction, pending] = useActionState<AtelierFormState, FormData>(atelierAction, undefined);
  const needsNote = actions.some((a) => a.needsNote);

  return (
    <section className="rounded-lg border-2 border-neutral-800 p-4">
      <h2 className="mb-3 text-sm font-medium">{t.atelier.acties}</h2>
      <form action={formAction} className="flex flex-col gap-3">
        <input type="hidden" name="orderId" value={orderId} />
        {needsNote && (
          <label className="flex flex-col gap-1 text-sm">
            {t.atelier.notitie}
            <textarea
              name="note"
              rows={2}
              placeholder={t.atelier.notitiePlaceholder}
              className="rounded border border-neutral-300 px-3 py-2"
            />
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.key}
              type="submit"
              name="actionKey"
              value={a.key}
              disabled={pending}
              className={`rounded px-4 py-2 text-sm disabled:opacity-50 ${VARIANT_CLASSES[a.variant]}`}
            >
              {pending ? t.auth.bezig : a.label}
            </button>
          ))}
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      </form>
    </section>
  );
}
