// Keuzelijsten voor het verkoopformulier. Vaste waarden in plaats van vrije
// tekst, zodat filteren betrouwbaar blijft: "Lambskin" en "lamb skin" zouden
// anders twee verschillende filterwaarden worden.
//
// LET OP: dit bestand mag NOOIT iets uit de database-client importeren.
// Het wordt gebruikt door het verkoopformulier, dat in de browser draait,
// en database-code kan daar niet bij.

/** Conditie van best naar meest gedragen. */
export const CONDITION_ORDER = ["NEW", "EXCELLENT", "VERY_GOOD", "GOOD", "VISIBLE_WEAR"] as const;

export const COLORS = [
  "Black", "Beige", "Brown", "Navy", "Red", "Pink", "Ivory", "White",
  "Grey", "Green", "Blue", "Gold", "Silver", "Multicolour",
] as const;

export const MATERIALS = [
  "Lambskin", "Caviar", "Calfskin", "Aged calfskin", "Patent leather",
  "Tweed", "Canvas", "Silk", "Jersey", "Velvet", "Exotic leather",
  "Gilt metal", "Acetate",
] as const;

export const HARDWARE = ["Gold", "Silver", "Ruthenium", "Mixed", "None"] as const;

export const INCLUSIONS = [
  "Dust bag", "Authenticity card", "Box", "Receipt",
  "Extra chain", "Care booklet", "Hologram sticker",
] as const;

/** Zones in de volgorde waarin ze op de productpagina staan. */
export const WEAR_ZONES = ["EXTERIOR", "CORNERS_EDGES", "HARDWARE", "INTERIOR"] as const;
