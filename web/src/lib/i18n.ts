// Alle zichtbare teksten op één plek, gegroepeerd per gebied.
// Voordeel: vertalen naar FR, DE of ES is straks dit bestand kopiëren en
// vertalen, zonder de pagina's aan te raken. Codewaarden (enums, statussen)
// blijven altijd Engels in de database; alleen de labels hier zijn vertaalbaar.

export const t = {
  merk: {
    naam: "Still Iconic",
    tagline: "La Maison de la Revente · Vintage Chanel",
  },

  nav: {
    sell: "Sell",
    atelier: "Atelier",
    account: "My account",
    signIn: "Sign in",
    register: "Register",
    signOut: "Sign out",
    business: "Business",
    private: "Private",
    backToCollection: "← The collection",
  },

  // Onderbalk op de telefoon. Korte woorden: er is weinig ruimte.
  mobielNav: {
    collectie: "Collection",
    verkopen: "Sell",
    atelier: "Atelier",
    account: "Account",
    inloggen: "Sign in",
  },

  collectie: {
    voorregel: "The Collection",
    titel: "Vintage Chanel, expertised",
    intro:
      "Every listing is checked by our team before it goes live. At checkout you decide how far we go: photo check, hand expertise in our atelier, or a full certificate.",
    zoeken: "Search",
    zoekenPlaceholder: "Classic Flap, Boy Bag...",
    categorie: "Category",
    conditie: "Condition",
    verkoper: "Seller",
    minPrijs: "Min €",
    maxPrijs: "Max €",
    sorteren: "Sort",
    filteren: "Filter",
    wissen: "Clear",
    alle: "All",
    stuk: "piece",
    stukken: "pieces",
    geenResultaat: "No pieces found. Try a different search or fewer filters.",
    vorige: "Previous",
    volgende: "Next",
    pagina: (huidig: number, totaal: number) => `Page ${huidig} of ${totaal}`,
    alles: "The whole collection",
  },

  // Verificatiepagina: de drie niveaus waaruit de koper kiest
  verificatie: {
    navLabel: "Verification",
    voorregel: "Verification",
    titel: "You decide how far we go",
    intro:
      "Every listing is checked by our team before it goes live. Beyond that, certainty is your choice: a scarf of €200 does not need what a bag of €8,000 needs. You pick the level at checkout, and the piece travels accordingly.",
    vanaf: "from €39",

    niveaus: [
      {
        nummer: "01",
        naam: "Photo check",
        prijs: "Included",
        levertijd: "2 to 4 days",
        route: "Straight from the seller to you",
        wat: "Before a listing goes live, our team reviews the eight standard photographs and the seller's condition report: stitching, hardware, serial or hologram, interior and the wear on every zone. Anything that does not add up is sent back to the seller before you ever see it.",
        grens:
          "This is a judgement made from photographs. It catches what a photograph can show, and it does not replace a piece in the hand.",
        voorWie: "Accessories, jewellery and pieces where the seller has a track record with us.",
      },
      {
        nummer: "02",
        naam: "Atelier expertise",
        prijs: "€39",
        levertijd: "5 to 7 days",
        route: "Via our atelier, then on to you",
        wat: "The piece comes to us first. We assess authenticity and condition by hand: the grain and smell of the leather, the weight and finish of the hardware, the stitch count, the serial against the era, the lining and the glue lines. We rewrite the condition report with the piece in front of us, and photograph anything the seller missed.",
        grens:
          "If we disagree with the seller, the piece goes back and you are refunded in full, including what you paid for the expertise.",
        voorWie: "Bags, and anything above roughly €1,000.",
      },
      {
        nummer: "03",
        naam: "Entrupy certificate",
        prijs: "€89",
        levertijd: "5 to 7 days",
        route: "Via our atelier, then on to you",
        wat: "Everything in level 02, plus machine authentication: microscopic imaging of the leather grain, stitching and hardware, compared against a reference database of hundreds of thousands of pieces. You receive a certificate that stays with the piece and passes to its next owner.",
        grens: "Entrupy covers bags only. It does not cover clothing, jewellery or accessories.",
        voorWie: "Pieces you intend to keep, or to resell later.",
      },
    ],

    altijdTitel: "What you get at every level",
    altijd: [
      "Your payment is held until the piece reaches you. The seller is paid after delivery, not before.",
      "The eight standard photographs and a condition report per zone on every listing.",
      "Every step recorded, from listing to payout, so there is always a record of what happened and when.",
      "A dispute is decided by our team, not left between buyer and seller.",
    ],

    eerlijkTitel: "What we do not claim",
    eerlijk:
      "We are not Chanel and we have no relationship with the maison. What we sell is our own judgement, made by people who handle these pieces every day. A photo check is not an expertise, and an expertise is not a guarantee against every possible forgery. Where we are wrong, we say so and we put it right.",

    keuzeTitel: "When do you choose which",
    keuzeIntro: "A rough guide, not a rule. You choose per purchase.",
    keuzeRijen: [
      { situatie: "Accessory or scarf under €500", advies: "Photo check" },
      { situatie: "Jewellery, any price", advies: "Photo check or atelier expertise (Entrupy does not cover it)" },
      { situatie: "Bag between €500 and €2,000", advies: "Atelier expertise" },
      { situatie: "Bag above €2,000", advies: "Entrupy certificate" },
      { situatie: "Buying to resell later", advies: "Entrupy certificate, the paperwork travels with the piece" },
    ],
  },

  // Modelpagina's
  model: {
    voorregel: "The model",
    beschikbaar: (n: number) => `${n} available now`,
    geenBeschikbaar: "Nothing available right now",
    prijsbereik: "Price range",
    gemiddeld: "Average asking price",
    verkocht: (n: number) => `${n} sold through our atelier`,
    gemiddeldVerkocht: "Average sold price",
    nogGeenVerkoop: "No sales through us yet. This overview grows with every piece we handle.",
    watErIs: "What is available",
    materialen: "Materials",
    kleuren: "Colours",
    hardware: "Hardware",
    eras: "Eras",
    allesBekijken: "See all in the collection",
    terug: "← The collection",
    watJeMoetWeten: "What to look for",
    uitleg:
      "Every listing under this model is checked by our team before it goes live, and the condition report tells you where the wear sits, zone by zone. At checkout you can add a hand expertise in our atelier.",
  },

  // Bewaarde zoekopdrachten
  bewaardeZoekopdracht: {
    titelKort: "Save this search",
    uitleg: "Every piece here is one of a kind. Save this search and we will tell you when something arrives.",
    naamPlaceholder: "Name it, e.g. black caviar flap",
    opslaan: "Save search",
    opgeslagen: "Saved. You will find it under your account.",
    inloggen: "Sign in to save this search",
    kopTitel: "Saved searches",
    geen: "You have no saved searches yet. Set some filters on the collection and save them.",
    nieuw: (n: number) => `${n} new`,
    geenNieuw: "Nothing new",
    bekijken: "View",
    gezien: "Mark as seen",
    verwijderen: "Remove",
    sinds: (datum: string) => `Checked ${datum}`,
  },

  categorieen: {
    bag: "Bags",
    jewelry: "Jewellery",
    accessory: "Accessories",
  },

  condities: {
    NEW: "New",
    EXCELLENT: "Excellent",
    VERY_GOOD: "Very good",
    GOOD: "Good",
    VISIBLE_WEAR: "Visible wear",
  },

  zones: {
    EXTERIOR: "Exterior",
    CORNERS_EDGES: "Corners and edges",
    HARDWARE: "Hardware",
    INTERIOR: "Interior",
  },

  attributen: {
    kleur: "Colour",
    materiaal: "Material",
    hardware: "Hardware",
    afmetingen: "Dimensions",
    era: "Era",
    inclusies: "Comes with",
    conditierapport: "Condition report",
    conditierapportVoetnoot:
      "Noted by the seller and checked by our team against the photographs. If you add an atelier expertise at checkout, we verify and refine this report with the piece in hand.",
    geverifieerd: "verified by our atelier",
  },

  megamenu: {
    modellen: "Models",
    type: "Type",
    materiaal: "Material",
    kleur: "Colour",
    era: "Era",
    uitgelicht: "Featured",
    allesBekijken: (categorie: string) => `View all ${categorie.toLowerCase()} →`,
    nieuwBinnen: "New arrivals",
    deCollectie: "The collection",
  },

  sortering: {
    newest: "Newest first",
    price_asc: "Price low to high",
    price_desc: "Price high to low",
  },

  listing: {
    vintage: "Vintage",
    conditie: "Condition",
    model: "Model",
    verkoper: "Seller",
    expertise: "Verification",
    expertiseWaarde: "Photo check included · hand expertise from €39 at checkout",
    bedenktijd: "Cooling-off period",
    bedenktijdWaarde: "14 days right of withdrawal",
    beschrijving: "Description",
    kopen: "Buy now",
    bod: "Make an offer",
    verkocht: "Sold",
    gereserveerd: "Reserved",
    zakelijkKort: "business",
    priveKort: "private",
    priveDisclaimer:
      "You are buying from a private seller, so the statutory right of withdrawal does not apply. Your payment is held until the piece reaches you, and at checkout you can have it pass through our atelier first.",
    binnenkort: {
      kopen: "Checkout arrives in the next build round",
      bod: "Offers arrive in the next build round",
    },
  },

  auth: {
    signInTitel: "Sign in",
    signInSub: "No account yet?",
    signInLink: "Register",
    registerTitel: "Create an account",
    registerSub: "Already have an account?",
    registerLink: "Sign in",
    email: "Email address",
    wachtwoord: "Password",
    wachtwoordNieuw: "Password (at least 8 characters)",
    naam: "Name",
    accounttype: "Account type",
    prive: "Private",
    zakelijk: "Business",
    bedrijfsnaam: "Company name",
    kvk: "Chamber of commerce number",
    btw: "VAT number (optional)",
    signInKnop: "Sign in",
    registerKnop: "Create account",
    bezig: "One moment...",
    foutInlog: "Incorrect email address or password",
    foutBestaat: "An account with this email address already exists",
    foutNaam: "Please enter your name",
    foutEmail: "Invalid email address",
    foutWachtwoord: "Password must be at least 8 characters",
    foutBedrijfsnaam: "Company name is required for business accounts",
    foutKvk: "Chamber of commerce number is required for business accounts",
  },

  verkopen: {
    titel: "Sell a piece",
    intro:
      "After the sale we tell you where to send the piece: straight to the buyer, or to our atelier first if the buyer asked for a hand expertise. Either way we create the label and hold the payment until it arrives. Payout follows straight after delivery.",
    richtlijnenTitel: "Photography guidelines",
    richtlijnen: [
      "Daylight, neutral background, no filters",
      "Front, back, interior and base",
      "Close-ups of hardware, stitching and the serial number or hologram sticker",
      "Photograph wear honestly; our team checks every listing against these photographs, and buyers can ask for a hand expertise",
    ],
    titelVeld: "Title",
    titelPlaceholder: "e.g. Chanel Classic Flap Medium 1995",
    categorie: "Category",
    kies: "Choose...",
    modelVeld: "Model (optional)",
    modelPlaceholder: "e.g. Classic Flap Medium",
    conditie: "Condition",
    jaar: "Year of production (optional)",
    jaarPlaceholder: "e.g. 1995",
    prijs: "Asking price in euros",
    prijsPlaceholder: "e.g. 4500",
    beschrijving: "Description",
    beschrijvingPlaceholder:
      "Tell the story of this piece: provenance, condition, what is included (dust bag, authenticity card)...",
    fotolijst: {
      titel: "Photographs",
      uitleg:
        "Tap a tile to photograph. On a phone this opens the camera straight away. Each photograph is resized on your device before it is sent, so this works on mobile data.",
      voortgang: (klaar: number, totaal: number) => `${klaar} of ${totaal} added`,
      verplichtRest: (n: number) => `${n} required shot${n === 1 ? "" : "s"} to go`,
      allesKlaar: "all required shots added",
      nogVerplicht: (n: number) => `The first ${n} shots are required. Our team uses them to check your listing before it goes live.`,
      verplicht: "Required",
      bezig: "Preparing",
      verwijderen: "Remove",
      hulplijnen: "Show the outline over my photographs to check the framing",
      shots: {
        FRONT: { label: "Front", hint: "The whole piece, straight on" },
        BACK: { label: "Back", hint: "The whole piece, reverse" },
        INTERIOR: { label: "Interior", hint: "Lining and pockets" },
        SERIAL: { label: "Serial number", hint: "Or the hologram sticker" },
        HARDWARE: { label: "Hardware", hint: "Clasp, chain and feet" },
        CORNERS: { label: "Corners", hint: "Close up on the edges" },
        BASE: { label: "Base", hint: "Underside of the piece" },
        STRAP: { label: "Strap", hint: "Chain or shoulder strap" },
      },
    },
    concept: {
      hersteld: "We kept the listing you started earlier.",
      wissen: "Start fresh",
    },
    stappen: {
      voortgang: (huidig: number, totaal: number) => `Step ${huidig} of ${totaal}`,
      vorige: "Back",
      volgende: "Next",
      namen: ["The piece", "Condition", "Photographs", "Details", "Price"],
      fotosTekort: "Add the four required photographs before you continue.",
    },
    biedenToestaan: "Allow offers on this piece",
    plaatsen: "List this piece",
    bezig: "Publishing...",
    conditieUitleg: {
      EXCELLENT: "Barely worn, no visible flaws",
      GOOD: "Light signs of wear in keeping with its age",
      VISIBLE_WEAR: "Clear marks, priced accordingly",
    },
    fouten: {
      titel: "Title must be at least 5 characters",
      categorie: "Choose a category",
      conditie: "Choose a condition",
      jaarOngeldig: "Invalid year",
      jaarToekomst: "The year cannot be in the future",
      prijsOngeldig: "Enter a valid price",
      prijsMin: "Minimum asking price is 50 euros",
      prijsMax: "For pieces above 100,000 euros, please contact us",
      beschrijving: "Describe the piece in at least 30 characters",
      geenFoto: "Add at least one photograph",
      teVeelFotos: (max: number) => `Maximum ${max} photographs per piece`,
      fotoType: "Only JPG, PNG or WebP photographs are allowed",
      fotoGrootte: "Each photograph may be up to 8 MB",
      fotoOpslaan: "We could not store your photographs. Nothing was published; please try again.",
      fotoOpslaanLokaal:
        "Photo storage is not configured on this server, so nothing was published. Please let us know.",
    },
  },

  atelier: {
    titel: "Atelier",
    tellingen: (lopend: number, klaar: number) =>
      `${lopend} orders in progress · ${klaar} completed or cancelled`,
    papertrail: "Audit trail",
    geenOrders: "No orders in this stage",
    wachtrijen: {
      "Wacht op label": "Awaiting label",
      "Onderweg naar atelier": "On its way to the atelier",
      "Klaar voor inspectie": "Ready for inspection",
      "Klaar voor verzending": "Ready for dispatch",
      "Onderweg naar koper": "On its way to the buyer",
      "Afkeuringen en retouren": "Rejections and returns",
    } as Record<string, string>,
    order: "Order",
    partijen: "Parties",
    bedragen: "Amounts",
    verzendingen: "Shipments",
    geenVerzendingen: "No shipments yet",
    inspectierapport: "Inspection report",
    acties: "Actions",
    geschiedenis: "History",
    notitie: "Note (required when approving or rejecting)",
    notitiePlaceholder:
      "e.g. hologram sticker and stitching checked, everything as described",
    itemprijs: "Item price",
    kopersfee: "Buyer fee",
    verkopersfee: "Seller fee",
    uitbetaling: "Seller payout",
    payout: "Payout",
    door: "by",
    op: "on",
    automatisch: "automatic",
    goedgekeurd: "Approved",
    afgekeurd: "Rejected",
    serienummer: "serial number",
  },

  orderStatus: {
    PENDING_PAYMENT: "Awaiting payment",
    PAID: "Paid, awaiting dispatch",
    AWAITING_ITEM: "On its way to the atelier",
    ITEM_RECEIVED: "Received at the atelier",
    IN_INSPECTION: "Under inspection",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    RETURNING_TO_SELLER: "Returning to the seller",
    SHIPPED_TO_BUYER: "On its way to the buyer",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  },

  atelierActies: {
    create_label: "Create shipping label for the seller",
    receive_item: "Book the piece in",
    start_inspection: "Start inspection",
    approve: "Approve (authentic)",
    reject: "Reject",
    ship_to_buyer: "Dispatch to the buyer",
    mark_delivered: "Mark as delivered",
    complete: "Complete and release payout",
    start_return: "Start return to the seller",
    finish_return: "Return completed, cancel order",
  },

  verzending: {
    legs: {
      SELLER_TO_PLATFORM: "Seller → atelier",
      PLATFORM_TO_BUYER: "Atelier → buyer",
      PLATFORM_TO_SELLER_RETURN: "Return: atelier → seller",
    } as Record<string, string>,
    statussen: {
      PENDING: "Not yet created",
      LABEL_CREATED: "Label created",
      IN_TRANSIT: "In transit",
      DELIVERED: "Delivered",
    } as Record<string, string>,
    verzekerd: "insured",
  },

  papertrail: {
    titel: "Audit trail",
    intro: (n: number) =>
      `${n} entries · append-only, entries are never edited or deleted`,
    exporteer: "Export as CSV",
    entiteit: "Entity",
    actie: "Action",
    zoeken: "Search by id or note",
    zoekenPlaceholder: "e.g. an order id or 'return'",
    tijdstip: "Time",
    vanNaar: "From → to",
    door: "By",
    notitie: "Note",
    systeem: "system",
    geenRegels: "No entries found with these filters",
    voetnoot:
      "Entries are never edited or deleted; corrections are added as new entries.",
  },

  entiteiten: {
    USER: "User",
    LISTING: "Listing",
    OFFER: "Offer",
    ORDER: "Order",
    SHIPMENT: "Shipment",
    INSPECTION: "Inspection",
    PAYOUT: "Payout",
  },

  auditActies: {
    CREATED: "Created",
    STATUS_CHANGED: "Status changed",
    INSPECTED: "Inspected",
    PAYOUT_CREATED: "Payout prepared",
    LABEL_CREATED: "Shipping label created",
    RECEIVED: "Received",
    SHIPPED: "Dispatched",
    DELIVERED: "Delivered",
    RETURN_STARTED: "Return started",
    RETURN_FINISHED: "Return completed",
    RELISTED: "Returned to draft",
  } as Record<string, string>,

  account: {
    titel: "My account",
    zakelijkAccount: "business account",
    priveAccount: "private account",
    bestellingen: "My orders",
    geenBestellingen: "No orders yet.",
    bekijkCollectie: "Browse the collection",
    listings: "My listings",
    geenListings: "No listings yet.",
    plaatsEerste: "List your first piece",
    verkopen: "My sales",
    uitbetalingen: "Payouts",
    uitbetaald: "Paid out",
    inBehandeling: "In progress",
    mislukt: "Failed",
    uitbetalingLabel: "payout",
  },

  listingStatus: {
    DRAFT: "Draft",
    ACTIVE: "For sale",
    RESERVED: "Reserved",
    SOLD: "Sold",
    WITHDRAWN: "Withdrawn",
  } as Record<string, string>,

  offline: {
    voorregel: "No connection",
    titel: "You are offline",
    tekst:
      "We show prices and availability live, so this page needs a connection. Reconnect and try again.",
  },

  installeren: {
    voorregel: "Add to your home screen",
    tekstPrompt:
      "Install Still Iconic for quick access to the collection, your orders and offers.",
    tekstIos: "Tap the share icon, then choose Add to Home Screen.",
    installeer: "Install",
    nietNu: "Not now",
  },
} as const;

/** Bedragen in centen naar en-GB notatie: € 5,800 */
export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Datum en tijd in en-GB notatie */
export function formatDateTime(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(d);
}
