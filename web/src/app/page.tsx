import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth-actions";

const CONDITION_LABELS: Record<string, string> = {
  EXCELLENT: "Uitstekend",
  GOOD: "Goed",
  VISIBLE_WEAR: "Gebruikssporen",
};

function formatPrice(cents: number) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function Home() {
  const session = await auth();

  const [listings, activeCount] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: {
        photos: { orderBy: { position: "asc" }, take: 1 },
        seller: { select: { accountType: true } },
      },
    }),
    prisma.listing.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Timeless Marketplace</h1>
          <p className="text-sm text-neutral-500">{activeCount} vintage Chanel items beschikbaar</p>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          {session?.user ? (
            <>
              <span className="text-neutral-600">
                {session.user.name}
                <span className="ml-1 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                  {session.user.accountType === "BUSINESS" ? "Zakelijk" : "Particulier"}
                </span>
              </span>
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

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <article key={listing.id} className="group">
            <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-neutral-100">
              {listing.photos[0] && (
                <Image
                  src={listing.photos[0].url}
                  alt={listing.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
            </div>
            <h2 className="truncate text-sm font-medium">{listing.title}</h2>
            <p className="text-xs text-neutral-500">
              {CONDITION_LABELS[listing.condition]} ·{" "}
              {listing.seller.accountType === "BUSINESS" ? "Zakelijke verkoper" : "Particuliere verkoper"}
            </p>
            <p className="mt-1 text-sm font-semibold">{formatPrice(listing.priceCents)}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
