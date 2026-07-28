import Link from "next/link";
import { auth } from "@/lib/auth";
import { t } from "@/lib/i18n";

// Vaste onderbalk op de telefoon. Op een klein scherm hoort navigatie onderaan,
// binnen bereik van je duim; dat is de conventie die app-gebruikers verwachten.
// Vanaf sm verdwijnt hij, want daar doet de kop met het mega-menu het werk.
//
// pb-[env(safe-area-inset-bottom)] houdt de balk vrij van de streep onderaan
// een iPhone zonder thuisknop.

function Item({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex flex-1 flex-col items-center gap-1 py-2.5 text-neutral-700 active:text-black"
    >
      <span aria-hidden className="h-5 w-5">
        {icon}
      </span>
      <span className="text-[9px] uppercase tracking-[0.18em]">{label}</span>
    </Link>
  );
}

function Icoon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-5 w-5">
      <path d={d} />
    </svg>
  );
}

export async function MobileNav() {
  const session = await auth();
  const isTeam = session?.user?.role === "TEAM" || session?.user?.role === "ADMIN";

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t hairline bg-white/95 backdrop-blur sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch">
        <Item
          href="/"
          label={t.mobielNav.collectie}
          icon={<Icoon d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />}
        />
        <Item
          href="/sell"
          label={t.mobielNav.verkopen}
          icon={<Icoon d="M12 5v14M5 12h14" />}
        />
        {isTeam && (
          <Item
            href="/atelier"
            label={t.mobielNav.atelier}
            icon={<Icoon d="M4 20h16M6 20V9l6-4 6 4v11M10 20v-5h4v5" />}
          />
        )}
        <Item
          href={session?.user ? "/account" : "/login"}
          label={session?.user ? t.mobielNav.account : t.mobielNav.inloggen}
          icon={<Icoon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-4 3.6-6 8-6s8 2 8 6" />}
        />
      </div>
    </nav>
  );
}
