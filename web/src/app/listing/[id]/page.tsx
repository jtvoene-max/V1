import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, CONDITION_LABELS, formatPrice } from "@/lib/listing-search";

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { position: "asc" } },
      seller: { select: { name: true, accountType: true, companyName: true } },
    },
  });

  if (!listing || listing.status === "DRAFT" || listing.status === "WITHDRAWN") {
    notFound();
  }

  const isBusiness = listing.seller.accountType === "BUSINESS";
  const sellerLabel = isBusiness ? (listing.seller.companyName ?? listing.seller.name) : listing.seller.name.split(" ")[0];
  const categoryLabel = CATEGORIES.find((c) => c.value === listing.category)?.label ?? listing.category;
  const sold = listing.status === "SOLD" || listing.status === "RESERVED";

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="underline">
          Alle items
        </Link>{" "}
        / {listing.title}
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Fotogalerij */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100">
            {listing.photos[0] && (
              <Image
                src={listing.photos[0].url}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            )}
          </div>
          {listing.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {listing.photos.slice(1, 5).map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded bg-neutral-100">
                  <Image src={photo.url} alt={listing.title} fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="mb-1 text-2xl font-semibold">{listing.title}</h1>
          <p className="mb-4 text-sm text-neutral-500">
            {categoryLabel}
            {listing.productionYear ? ` · ${listing.productionYear}` : ""}
          </p>

          <p className="mb-6 text-3xl font-semibold">{formatPrice(listing.priceCents)}</p>

          {sold ? (
            <p className="mb-6 inline-block rounded bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-500">
              {listing.status === "RESERVED" ? "Gereserveerd" : "Verkocht"}
            </p>
          ) : (
            <div className="mb-6 flex gap-3">
              <button className="rounded bg-black px-6 py-3 font-medium text-white" disabled title="Checkout volgt in milestone 3">
                Kopen
              </button>
              {listing.allowOffers && (
                <button className="rounded border border-black px-6 py-3 font-medium" disabled title="Bieden volgt in milestone 5">
                  Bod uitbrengen
                </button>
              )}
            </div>
          )}

          <dl className="mb-6 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-neutral-200 p-4 text-sm">
            <dt className="text-neutral-500">Conditie</dt>
            <dd>{CONDITION_LABELS[listing.condition]}</dd>
            {listing.model && (
              <>
                <dt className="text-neutral-500">Model</dt>
                <dd>{listing.model}</dd>
              </>
            )}
            <dt className="text-neutral-500">Verkoper</dt>
            <dd>
              {sellerLabel}
              <span className="ml-1 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                {isBusiness ? "Zakelijk" : "Particulier"}
              </span>
            </dd>
            <dt className="text-neutral-500">Authenticatie</dt>
            <dd>Fysiek gecontroleerd door ons atelier vóór verzending</dd>
            {isBusiness && (
              <>
                <dt className="text-neutral-500">Herroepingsrecht</dt>
                <dd>14 dagen bedenktijd (zakelijke verkoper)</dd>
              </>
            )}
          </dl>

          <h2 className="mb-2 font-medium">Beschrijving</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">{listing.description}</p>

          {!isBusiness && (
            <p className="mt-6 rounded bg-neutral-50 p-3 text-xs text-neutral-500">
              Je koopt van een particuliere verkoper. Het wettelijk herroepingsrecht is niet van toepassing; elk item wordt
              vóór verzending fysiek geïnspecteerd en geauthenticeerd door ons atelier.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
