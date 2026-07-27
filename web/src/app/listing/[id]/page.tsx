import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
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

  const spec = (label: string, value: React.ReactNode) => (
    <div className="flex items-baseline justify-between gap-6 border-b hairline py-3">
      <dt className="caps-label whitespace-nowrap">{label}</dt>
      <dd className="text-right text-sm">{value}</dd>
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />
      <nav className="mb-8">
        <Link href="/" className="caps-label underline">
          ← De collectie
        </Link>
      </nav>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Fotogalerij */}
        <div className="flex flex-col gap-3">
          <div className="relative aspect-square overflow-hidden border hairline bg-neutral-100">
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
                <div key={photo.id} className="relative aspect-square overflow-hidden border hairline bg-neutral-100">
                  <Image src={photo.url} alt={listing.title} fill sizes="12vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="caps-gold mb-3">
            {categoryLabel}
            {listing.productionYear ? ` · ${listing.productionYear}` : ""} · Vintage
          </p>
          <h1 className="font-serif text-4xl">{listing.title}</h1>
          <p className="mt-5 font-serif text-3xl">{formatPrice(listing.priceCents)}</p>

          {sold ? (
            <p className="caps-label mt-7 inline-block border hairline px-5 py-3">
              {listing.status === "RESERVED" ? "Gereserveerd" : "Verkocht"}
            </p>
          ) : (
            <div className="mt-7 flex flex-wrap gap-3">
              <button className="btn-maison" disabled title="Checkout volgt in milestone 3">
                Acquisitie
              </button>
              {listing.allowOffers && (
                <button className="btn-maison-line" disabled title="Bieden volgt in milestone 5">
                  Bod uitbrengen
                </button>
              )}
            </div>
          )}

          <dl className="mt-9 border-t hairline">
            {spec("Conditie", CONDITION_LABELS[listing.condition])}
            {listing.model && spec("Model", listing.model)}
            {spec(
              "Verkoper",
              <>
                {sellerLabel} <span className="text-[#8a6f3c]">· {isBusiness ? "zakelijk" : "particulier"}</span>
              </>
            )}
            {spec("Expertise", "Fysiek geauthenticeerd in ons atelier")}
            {isBusiness && spec("Bedenktijd", "14 dagen herroepingsrecht")}
          </dl>

          <h2 className="caps-label mt-9 mb-3">Beschrijving</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">{listing.description}</p>

          {!isBusiness && (
            <p className="mt-7 border-l-2 border-[#a8894f] bg-white px-4 py-3 text-xs leading-relaxed text-neutral-500">
              Je koopt van een particuliere verkoper; het wettelijk herroepingsrecht is niet van toepassing. Elk stuk
              wordt vóór verzending fysiek geïnspecteerd en geauthenticeerd door ons atelier.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
