"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type FormState } from "@/lib/actions/auth-actions";
import { t } from "@/lib/i18n";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerAction, undefined);
  const [accountType, setAccountType] = useState<"PRIVATE" | "BUSINESS">("PRIVATE");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="mb-2 font-serif text-3xl">{t.auth.registerTitel}</h1>
      <p className="mb-8 text-sm text-neutral-500">
        {t.auth.registerSub}{" "}
        <Link href="/login" className="underline">
          {t.auth.registerLink}
        </Link>
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex gap-2" role="radiogroup" aria-label={t.auth.accounttype}>
          {(
            [
              { value: "PRIVATE", label: t.auth.prive },
              { value: "BUSINESS", label: t.auth.zakelijk },
            ] as const
          ).map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 cursor-pointer rounded border px-4 py-2 text-center text-sm ${
                accountType === opt.value ? "border-black bg-black text-white" : "border-neutral-300"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value={opt.value}
                checked={accountType === opt.value}
                onChange={() => setAccountType(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>

        <label className="flex flex-col gap-1 text-sm">
          {t.auth.naam}
          <input name="name" required autoComplete="name" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.auth.email}
          <input name="email" type="email" required autoComplete="email" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.auth.wachtwoordNieuw}
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className="rounded border border-neutral-300 px-3 py-2" />
        </label>

        {accountType === "BUSINESS" && (
          <>
            <label className="flex flex-col gap-1 text-sm">
              {t.auth.bedrijfsnaam}
              <input name="companyName" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t.auth.kvk}
              <input name="kvkNumber" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              {t.auth.btw}
              <input name="vatNumber" className="rounded border border-neutral-300 px-3 py-2" />
            </label>
          </>
        )}

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-maison mt-2">
          {pending ? t.auth.bezig : t.auth.registerKnop}
        </button>
      </form>
    </main>
  );
}
