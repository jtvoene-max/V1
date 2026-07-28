import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SiteHeader } from "@/components/site-header";
import { CONDITION_LABELS, eraLabel, formatPrice } from "@/lib/listing-search";
import { formatDate, t } from "@/lib/i18n";

// De winkelpagina van een zakelijke verkoper.
//
// Twee dingen tegelijk, en dat is de reden dat dit er eerder komt dan een
// profiel voor particulieren:
//  1. Een dealer met eigen voorraad wil een plek die van hem is. Dat is hoe
//     je aanbod binnenhaalt; Chrono24 draait er volledig op.
//  2. De Digital Services Act verplicht een marktplaats om handelaren
//     identificeerbaar te maken. Die gegevens moeten ergens staan, en dit is
//     de logische plek.
//
// Particuliere verkopers krijgen dit bewust niet: bij hen is een openbare
// pagina met naam en handelsgeschiedenis een privacykwestie.
//
// Geen eigen logo's, kleuren of banners. Tien winkels met een eigen huisstijl
// slopen de maison-uitstraling. Een winkel krijgt een eigen naam, verhaal en
// plaats, geen eigen jasje.

async function haalWinkel(slug: string) {
  return prisma.user.findFirst({
    where: { shopSlug: slug, accountType: "BUSINESS" },
    select: {
      id: true,
      name: true,
      companyName: true,
      vatNumber: true,
      kvkNumber: true,
      shopStory: true,
      shopCity: true,
      createdAt: true,
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const winkel = await haalWinkel(slug);
  if (!winkel) return { title: "Seller — Still Iconic" };
  const naam = winkel.companyName ?? winkel.name;
  return {
    title: `${naam} — vintage Chanel | Still Iconic`,
    description: `Vintage Chanel from ${naam}${winkel.shopCity ? ` in ${winkel.shopCity}` : ""}, verified through Still Iconic.`,
  };
}

function Waardeblok({ label, waarde }: { label: string; waarde: string }) {
  return (
    <div className="border hairline bg-white px-4 py-3 text-center">
      <p className="caps-label !text-[9px]">{label}</p>
      <p className="mt-1 text-[15px] font-medium">{waarde}</p>
    </div>
  );
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const winkel = await haalWinkel(slug);
  if (!winkel) notFound();

  const naam = winkel.companyName ?? winkel.name;

  const [listings, teKoop, verkocht] = await Promise.all([
    prisma.listing.findMany({
      where: { sellerId: winkel.id, status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 24,
      include: { photos: { orderBy: { position: "asc" }, take: 1 } },
    }),
    prisma.listing.count({ where: { sellerId: winkel.id, status: "ACTIVE" } }),
    prisma.order.count({ where: { sellerId: winkel.id } }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <SiteHeader />

      <div className="mb-10 text-center">
        <p className="caps-gold mb-3">{t.winkel.voorregel}</p>
        <h1 className="font-serif text-3xl">{naam}</h1>
        <div className="goud-lijn mx-auto mt-4" />
        {winkel.shopCity && <p className="caps-label mt-4">{winkel.shopCity}</p>}
      </div>

      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        <Waardeblok
          label={t.winkel.teKoop}
          waarde={`${teKoop} ${teKoop === 1 ? t.winkel.stuk : t.winkel.stukken}`}
        />
        <Waardeblok
          label={t.winkel.verkocht}
          waarde={`${verkocht} ${verkocht === 1 ? t.winkel.stuk : t.winkel.stukken}`}
        />
        <Waardeblok label={t.winkel.voorregel} waarde={t.winkel.sindsWanneer(formatDate(winkel.createdAt))} />
      </div>

      {winkel.shopStory && (
        <section className="mb-10 border hairline bg-white p-6 sm:p-8">
          <h2 className="caps-label mb-3">{t.winkel.overOns}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-neutral-700">{winkel.shopStory}</p>
          <p className="mt-4 text-xs text-[#8a6f3c]">{t.winkel.herroeping}</p>
        </section>
      )}

      {listings.length === 0 ? (
        <p className="py-16 text-center text-sm text-neutral-500">{t.winkel.geenVoorraad}</p>
      ) : (
        <>
          <p className="caps-label mb-5">{t.winkel.allesVan(naam)}</p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <Link key={listing.id} href={`/listing/${listing.id}`} className="group">
                <article className="border hairline bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_38px_rgba(10,10,10,0.10)]">
                  <div className="relative aspect-square overflow-hidden border-b hairline bg-neutral-100">
                    {listing.photos[0] && (
                      <Image
                        src={listing.photos[0].url}
                        alt={listing.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="px-4 py-4 text-center">
                    <h2 className="truncate font-serif text-[15px]">{listing.title}</h2>
                    <p className="caps-label mt-1.5 !text-[9px]">
                      {CONDITION_LABELS[listing.condition]}
                      {listing.productionYear ? ` · ${eraLabel(listing.productionYear)}` : ""}
                    </p>
                    <p className="mt-2 text-[15px] font-medium">{formatPrice(listing.priceCents)}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Verplicht onder de Digital Services Act: een marktplaats moet
          handelaren identificeerbaar maken. */}
      <section className="mt-14 border-t hairline pt-8">
        <h2 className="caps-label mb-2">{t.winkel.handelsgegevens}</h2>
        <p className="mb-5 max-w-2xl text-xs leading-relaxed text-neutral-500">{t.winkel.handelsgegevensUitleg}</p>
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="caps-label !text-[9px]">{t.winkel.bedrijfsnaam}</dt>
            <dd className="mt-1">{winkel.companyName ?? naam}</dd>
          </div>
          {winkel.kvkNumber && (
            <div>
              <dt className="caps-label !text-[9px]">{t.winkel.kvk}</dt>
              <dd className="mt-1">{winkel.kvkNumber}</dd>
            </div>
          )}
          {winkel.vatNumber && (
            <div>
              <dt className="caps-label !text-[9px]">{t.winkel.btw}</dt>
              <dd className="mt-1">{winkel.vatNumber}</dd>
            </div>
          )}
          {winkel.shopCity && (
            <div>
              <dt className="caps-label !text-[9px]">{t.winkel.plaats}</dt>
              <dd className="mt-1">{winkel.shopCity}</dd>
            </div>
          )}
        </dl>
      </section>
    </main>
  );
}
