import Image from "next/image";
import Link from "next/link";
import { categoryFacets, type CategoryFacets } from "@/lib/facets";
import { CATEGORIES, formatPrice } from "@/lib/listing-search";
import { t } from "@/lib/i18n";

// Hoofdnavigatie met een uitklapmenu per categorie. Puur CSS: het menu opent
// op hover en op toetsenbordfocus, zonder JavaScript. Dat houdt het snel en
// werkt ook als de pagina nog aan het laden is.

function Kolom({ titel, items, param, category }: { titel: string; items: { value: string; label: string; count: number }[]; param: string; category: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h4 className="caps-gold mb-2 border-b hairline pb-2 !text-[9px]">{titel}</h4>
      <ul>
        {items.slice(0, 8).map((i) => (
          <li key={i.value}>
            <Link
              href={`/?category=${category}&${param}=${encodeURIComponent(i.value)}`}
              className="block py-1.5 text-[13px] font-medium text-neutral-800 hover:text-black"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuPaneel({ category, label, facets }: { category: string; label: string; facets: CategoryFacets }) {
  return (
    <div className="invisible absolute left-0 right-0 top-full z-30 border-b hairline bg-white opacity-0 shadow-[0_16px_40px_rgba(10,10,10,0.10)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-8 sm:grid-cols-2 lg:grid-cols-5">
        <Kolom titel={category === "bag" ? t.megamenu.modellen : t.megamenu.type} items={facets.models} param="model" category={category} />
        <Kolom titel={t.megamenu.materiaal} items={facets.materials} param="material" category={category} />
        <Kolom titel={t.megamenu.kleur} items={facets.colors} param="color" category={category} />
        <Kolom titel={t.megamenu.era} items={facets.eras} param="era" category={category} />
        <div>
          <h4 className="caps-gold mb-2 border-b hairline pb-2 !text-[9px]">{t.megamenu.uitgelicht}</h4>
          {facets.featured && (
            <Link href={`/listing/${facets.featured.id}`} className="block border hairline p-3 text-center hover:shadow-[0_8px_22px_rgba(10,10,10,0.08)]">
              {facets.featured.photoUrl && (
                <div className="relative mb-2 aspect-square overflow-hidden bg-neutral-100">
                  <Image src={facets.featured.photoUrl} alt={facets.featured.title} fill sizes="140px" className="object-cover" />
                </div>
              )}
              <span className="block truncate font-serif text-[13px]">{facets.featured.title}</span>
              <span className="mt-1 block text-[12px] text-[#8a6f3c]">{formatPrice(facets.featured.priceCents)}</span>
            </Link>
          )}
          <Link href={`/?category=${category}`} className="mt-3 block text-[13px] font-medium text-[#8a6f3c] hover:text-black">
            {t.megamenu.allesBekijken(label)}
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function MegaMenu() {
  // Eén query per categorie, parallel. Resultaten worden door Next.js
  // gecachet zolang de collectie niet verandert.
  const perCategorie = await Promise.all(
    CATEGORIES.map(async (c) => ({ ...c, facets: await categoryFacets(c.value) }))
  );

  const link = "block px-5 py-4 caps-label !text-[11px] !text-neutral-800 hover:!text-black";

  return (
    <nav className="relative mb-10 border-y hairline bg-white">
      <ul className="mx-auto flex max-w-6xl flex-wrap justify-center">
        <li>
          <Link href="/" className={link}>
            {t.megamenu.deCollectie}
          </Link>
        </li>
        {perCategorie.map((c) => (
          <li key={c.value} className="group static">
            <Link href={`/?category=${c.value}`} className={link}>
              {c.label}
            </Link>
            <MenuPaneel category={c.value} label={c.label} facets={c.facets} />
          </li>
        ))}
        <li>
          <Link href="/?sort=newest" className={link}>
            {t.megamenu.nieuwBinnen}
          </Link>
        </li>
        <li>
          <Link href="/sell" className={link}>
            {t.nav.sell}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
