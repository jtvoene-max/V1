// Modelnamen omzetten naar een adres, en terug herkennen.
//
// Chanel heeft geen officieel referentiesysteem zoals horloges, maar de
// modelnaam werkt in de praktijk hetzelfde: mensen zoeken op "Classic Flap
// Medium", niet op "vintage tas kopen". Elke modelnaam krijgt daarom een
// eigen pagina op /model/<slug>.
//
// LET OP: dit bestand mag NOOIT iets uit de database-client importeren.

/** "Classic Flap Medium" wordt "classic-flap-medium". */
export function modelSlug(naam: string): string {
  return naam
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // accenten weghalen
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Zoekt bij een slug de echte modelnaam op uit een lijst met namen. */
export function modelUitSlug(slug: string, namen: string[]): string | undefined {
  return namen.find((naam) => modelSlug(naam) === slug);
}
