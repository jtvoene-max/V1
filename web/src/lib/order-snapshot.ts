import type { Condition } from "@/generated/prisma/client";

// Kenmerken van het stuk bevriezen op het moment van koop.
//
// De bedragen op een order stonden al los van de listing, en om precies
// dezelfde reden moeten deze kenmerken dat ook: een verkoper kan zijn listing
// na de verkoop nog wijzigen, en dan klopt de geschiedenis niet meer.
//
// Zonder deze velden is er over twee jaar geen betrouwbaar prijsoverzicht per
// model te maken, en die geschiedenis is achteraf niet meer op te bouwen. Elke
// plek die een order aanmaakt hoort deze functie te gebruiken.

type BronListing = {
  model: string | null;
  category: string;
  condition: Condition;
  color: string | null;
  material: string | null;
  hardware: string | null;
  productionYear: number | null;
};

export function orderSnapshot(listing: BronListing) {
  return {
    itemModel: listing.model,
    itemCategory: listing.category,
    itemCondition: listing.condition,
    itemColor: listing.color,
    itemMaterial: listing.material,
    itemHardware: listing.hardware,
    itemProductionYear: listing.productionYear,
  };
}
