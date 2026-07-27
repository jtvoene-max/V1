import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SellForm } from "./sell-form";

export const metadata = { title: "Item verkopen — Timeless Marketplace" };

export default async function SellPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="underline">
          Alle items
        </Link>{" "}
        / Verkopen
      </nav>
      <h1 className="mb-2 text-2xl font-semibold">Item verkopen</h1>
      <p className="mb-8 text-sm text-neutral-600">
        Na verkoop stuur je het item naar ons atelier. Wij controleren de echtheid en conditie, en sturen het daarna door
        naar de koper. Uitbetaling volgt direct na levering.
      </p>

      <section className="mb-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm">
        <h2 className="mb-2 font-medium">Fotorichtlijnen</h2>
        <ul className="list-disc space-y-1 pl-5 text-neutral-600">
          <li>Daglicht, neutrale achtergrond, geen filters</li>
          <li>Voorkant, achterkant, binnenkant en onderkant</li>
          <li>Close-ups van hardware, stiksels en het serienummer of de hologramsticker</li>
          <li>Fotografeer gebruikssporen eerlijk; ons atelier controleert elk item fysiek</li>
        </ul>
      </section>

      <SellForm />
    </main>
  );
}
