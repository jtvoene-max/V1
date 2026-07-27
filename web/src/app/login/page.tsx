"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type FormState } from "@/lib/actions/auth-actions";
import { t } from "@/lib/i18n";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(loginAction, undefined);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="mb-2 font-serif text-3xl">{t.auth.signInTitel}</h1>
      <p className="mb-8 text-sm text-neutral-500">
        {t.auth.signInSub}{" "}
        <Link href="/register" className="underline">
          {t.auth.signInLink}
        </Link>
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          {t.auth.email}
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t.auth.wachtwoord}
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded border border-neutral-300 px-3 py-2"
          />
        </label>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="btn-maison mt-2">
          {pending ? t.auth.bezig : t.auth.signInKnop}
        </button>
      </form>
    </main>
  );
}
