import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";
import { t } from "@/lib/i18n";

export async function SiteHeader() {
  const session = await auth();
  const isTeam = session?.user?.role === "TEAM" || session?.user?.role === "ADMIN";

  return (
    <header className="mb-10 border-b hairline pb-6">
      <div className="flex flex-col items-center gap-5 text-center">
        <div>
          <Link href="/" className="font-serif text-3xl tracking-wide">
            Still <span className="text-[#a8894f]">Iconic</span>
          </Link>
          <p className="caps-label mt-2">{t.merk.tagline}</p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          <Link href="/sell" className="caps-label !text-black hover:!text-[#8a6f3c]">
            {t.nav.sell}
          </Link>
          {isTeam && (
            <Link href="/atelier" className="caps-label !text-black hover:!text-[#8a6f3c]">
              {t.nav.atelier}
            </Link>
          )}
          {session?.user ? (
            <>
              <Link href="/account" className="caps-label !text-black hover:!text-[#8a6f3c]">
                {session.user.name}
                <span className="ml-1 text-[#a8894f]">
                  · {session.user.accountType === "BUSINESS" ? t.nav.business : t.nav.private}
                </span>
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="caps-label cursor-pointer hover:!text-black">
                  {t.nav.signOut}
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="caps-label !text-black hover:!text-[#8a6f3c]">
                {t.nav.signIn}
              </Link>
              <Link href="/register" className="btn-maison !px-4 !py-2">
                {t.nav.register}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
