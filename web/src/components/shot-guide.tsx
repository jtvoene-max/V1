import type { ShotKey } from "@/lib/photo-shots";

// Silhouet per opname: wat moet er in beeld en vanuit welke hoek.
//
// Een woord als "hoeken" is voor iedereen iets anders. Een tekening niet.
// De verkoper ziet vóór het fotograferen wat de bedoeling is, en kan er na
// afloop overheen leggen om te controleren of de uitsnede klopt.
//
// Bewust lijntekeningen in één stijl en zonder tekst: ze staan achter het
// label en mogen niet de aandacht trekken.

const lijn = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinejoin: "round" as const };

function Tas({ klep = true, sluiting = true }: { klep?: boolean; sluiting?: boolean }) {
  return (
    <>
      <rect x="14" y="24" width="36" height="26" rx="2" {...lijn} />
      {klep && <path d="M14 34h36" {...lijn} />}
      {sluiting && <rect x="28" y="30" width="8" height="7" rx="1" {...lijn} />}
      {/* ketting */}
      <path d="M18 24c2-9 8-13 14-13s12 4 14 13" {...lijn} strokeDasharray="3 2.5" />
    </>
  );
}

const TEKENINGEN: Record<ShotKey, React.ReactNode> = {
  // Hele tas, recht van voren
  FRONT: <Tas />,

  // Hele tas van achteren: geen sluiting, wel het achterzakje
  BACK: (
    <>
      <rect x="14" y="24" width="36" height="26" rx="2" {...lijn} />
      <path d="M20 30h24v8H20z" {...lijn} strokeDasharray="3 2.5" />
      <path d="M18 24c2-9 8-13 14-13s12 4 14 13" {...lijn} strokeDasharray="3 2.5" />
    </>
  ),

  // Open tas van bovenaf: je kijkt in de voering
  INTERIOR: (
    <>
      <path d="M14 30 22 50h20l8-20z" {...lijn} />
      <ellipse cx="32" cy="30" rx="18" ry="6" {...lijn} />
      <path d="M24 38h16M26 44h12" {...lijn} strokeDasharray="3 2.5" />
    </>
  ),

  // Serienummer of hologramsticker, van dichtbij
  SERIAL: (
    <>
      <rect x="16" y="26" width="32" height="18" rx="2" {...lijn} />
      <path d="M22 33h20M22 38h13" {...lijn} strokeDasharray="2.5 2.5" />
      <circle cx="41" cy="43" r="9" {...lijn} />
      <path d="M47.5 49.5 53 55" {...lijn} strokeLinecap="round" />
    </>
  ),

  // Sluiting en ketting van dichtbij
  HARDWARE: (
    <>
      <rect x="20" y="24" width="24" height="20" rx="2" {...lijn} />
      <circle cx="32" cy="34" r="5" {...lijn} />
      <path d="M14 50c4 0 4-4 8-4s4 4 8 4 4-4 8-4 4 4 8 4" {...lijn} />
    </>
  ),

  // Eén hoek uitvergroot: hier zit de meeste slijtage
  CORNERS: (
    <>
      <path d="M50 20H20a2 2 0 0 0-2 2v28" {...lijn} strokeDasharray="3 2.5" />
      <path d="M18 50h14" {...lijn} />
      <path d="M18 50V36" {...lijn} />
      <circle cx="18" cy="50" r="11" {...lijn} />
    </>
  ),

  // Onderkant, met de voetjes
  BASE: (
    <>
      <rect x="14" y="22" width="36" height="26" rx="2" {...lijn} />
      <circle cx="20" cy="28" r="2" {...lijn} />
      <circle cx="44" cy="28" r="2" {...lijn} />
      <circle cx="20" cy="42" r="2" {...lijn} />
      <circle cx="44" cy="42" r="2" {...lijn} />
    </>
  ),

  // Ketting of schouderband over de volle lengte
  STRAP: (
    <>
      <path d="M12 50c6-4 6-10 12-14s10-6 16-10 8-8 12-12" {...lijn} />
      <ellipse cx="22" cy="42" rx="4" ry="2.6" transform="rotate(-35 22 42)" {...lijn} />
      <ellipse cx="32" cy="33" rx="4" ry="2.6" transform="rotate(-35 32 33)" {...lijn} />
      <ellipse cx="42" cy="24" rx="4" ry="2.6" transform="rotate(-40 42 24)" {...lijn} />
    </>
  ),
};

export function ShotGuide({ shot, className = "" }: { shot: ShotKey; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden className={className}>
      {TEKENINGEN[shot]}
    </svg>
  );
}
