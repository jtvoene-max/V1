import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

export async function SiteHeader() {
  const session = await auth();
  const isTeam = session?.user?.role === "TEAM" || session?.user?.role === "ADMIN";

  return (
    <header className="mb-10 border-b hairline pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/" className="font-serif text-3xl tracking-wide">
            Timeless <span className="text-[#a8894f]">Marketplace</span>
          </Link>
          <p className="caps-label mt-2">La Maison de la Revente · Vintage Chanel</p>
        </div>
        <nav className="flex items-center gap-5">
          <Link href="/sell" className="caps-label !text-black hover:!text-[#8a6f3c]">
            Verkopen
          </Link>
          {isTeam && (
            <Link href="/atelier" className="caps-label !text-black hover:!text-[#8a6f3c]">
              Atelier
            </Link>
          )}
          {session?.user ? (
            <>
              <Link href="/account" className="caps-label !text-black hover:!text-[#8a6f3c]">
                {session.user.name}
                <span className="ml-1 text-[#a8894f]">
                  · {session.user.accountType === "BUSINESS" ? "Zakelijk" : "Particulier"}
                </span>
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="caps-label cursor-pointer hover:!text-black">
                  Uitloggen
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="caps-label !text-black hover:!text-[#8a6f3c]">
                Inloggen
              </Link>
              <Link href="/register" className="btn-maison !px-4 !py-2">
                Registreren
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
