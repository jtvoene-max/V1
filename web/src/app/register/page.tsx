"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type FormState } from "@/lib/actions/auth-actions";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(registerAction, undefined);
  const [accountType, setAccountType] = useState<"PRIVATE" | "BUSINESS">("PRIVATE");

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="mb-2 font-serif text-3xl">Account aanmaken</h1>
      <p className="mb-8 text-sm text-neutral-500">
        Al een account?{" "}
        <Link href="/login" className="underline">
          Inloggen
        </Link>
      </p>
      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex gap-2" role="radiogroup" aria-label="Accounttype">
          {(
            [
              { value: "PRIVATE", label: "Particulier" },
              { value: "BUSINESS", label: "Zakelijk" },
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
          Naam
          <input name="name" required autoComplete="name" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          E-mailadres
          <input name="email" type="email" required autoComplete="email" className="rounded border border-neutral-300 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Wachtwoord (minimaal 8 tekens)
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className="rounded border border-neutral-300 px-3 py-2" />
        </label>

        {accountType === "BUSINESS" && (
          <>
            <label className="flex flex-col gap-1 text-sm">
              Bedrijfsnaam
              <input name="companyName" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              KVK-nummer
              <input name="kvkNumber" required className="rounded border border-neutral-300 px-3 py-2" />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              BTW-nummer (optioneel)
              <input name="vatNumber" className="rounded border border-neutral-300 px-3 py-2" />
            </label>
          </>
        )}

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button type="submit" disabled={pending} className="mt-2 rounded bg-black px-4 py-2 text-white disabled:opacity-50">
          {pending ? "Bezig..." : "Account aanmaken"}
        </button>
      </form>
    </main>
  );
}
