// De acht vaste opnames die we van elk stuk willen. Vaste lijst in plaats van
// "sleep hier wat foto's": het atelier krijgt dan altijd dezelfde hoeken en
// hoeft minder na te vragen, en de verkoper weet precies wat er moet gebeuren.
//
// De volgorde is ook de volgorde op de productpagina, dus FRONT is de
// omslagfoto.
//
// LET OP: dit bestand mag NOOIT iets uit de database-client importeren.
// Het wordt gebruikt door het verkoopformulier, dat in de browser draait.

export type ShotKey =
  | "FRONT"
  | "BACK"
  | "INTERIOR"
  | "SERIAL"
  | "HARDWARE"
  | "CORNERS"
  | "BASE"
  | "STRAP";

export type Shot = { key: ShotKey; verplicht: boolean };

export const SHOTS: readonly Shot[] = [
  { key: "FRONT", verplicht: true },
  { key: "BACK", verplicht: true },
  { key: "INTERIOR", verplicht: true },
  { key: "SERIAL", verplicht: true },
  { key: "HARDWARE", verplicht: false },
  { key: "CORNERS", verplicht: false },
  { key: "BASE", verplicht: false },
  { key: "STRAP", verplicht: false },
] as const;

export const VERPLICHTE_SHOTS = SHOTS.filter((s) => s.verplicht).length;

/** Lange zijde waarnaar we op het toestel verkleinen, plus de JPEG-kwaliteit. */
export const MAX_RAND_PX = 1600;
export const JPEG_KWALITEIT = 0.82;
