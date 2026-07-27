import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export async function SiteHeader() {
  const session = await auth();
  const isTeam = session?.user?.role === "TEAM" || session?.user?.role === "ADMIN";

  return (
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div>
        <Link href="/" className="font-serif text-2xl tracking-wide">
          Timeless Marketplace
        </Link>
        <p className="text-sm text-neutral-500">Vintage Chanel, geauthenticeerd door ons atelier</p>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/sell" className="rounded border border-black px-3 py-1.5 font-medium">
          Verkopen
        </Link>
        {isTeam && (
          <Link href="/atelier" className="rounded bg-neutral-800 px-3 py-1.5 font-medium text-white">
            Atelier
          </Link>
        )}
        {session?.user ? (
          <>
            <Link href="/account" className="text-neutral-600 underline">
              {session.user.name}
              <span className="ml-1 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500 no-underline">
                {session.user.accountType === "BUSINESS" ? "Zakelijk" : "Particulier"}
              </span>
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="underline">
                Uitloggen
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="underline">
              Inloggen
            </Link>
            <Link href="/register" className="rounded bg-black px-3 py-1.5 text-white">
              Registreren
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
