import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SellForm } from "./sell-form";
import { t } from "@/lib/i18n";

export const metadata = { title: "Sell a piece — Still Iconic" };

export default async function SellPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <nav className="mb-6">
        <Link href="/" className="caps-label underline">
          {t.nav.backToCollection}
        </Link>
      </nav>
      <h1 className="mb-2 font-serif text-3xl">{t.verkopen.titel}</h1>
      <p className="mb-8 text-sm leading-relaxed text-neutral-600">{t.verkopen.intro}</p>

      <SellForm />
    </main>
  );
}
