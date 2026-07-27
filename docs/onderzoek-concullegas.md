# Concurrentie-onderzoek: klantflow en zoek-/filterattributen

Onderzocht op 27 juli 2026: Vestiaire Collective, Vinted, Fashionphile, Rebag, The RealReal, Catawiki, Marktplaats en eBay. Focus: designertassen, waar mogelijk specifiek Chanel. Live categoriepagina's en productpagina's waar bereikbaar; anders officiële help-bronnen. Doel: bepalen welke filters, conditie-schaal en flow-elementen Timeless overneemt.

## 1. Filterattributen per platform (samenvatting)

| Attribuut | Vestiaire | Vinted | Fashionphile | Rebag | RealReal | Catawiki | Marktplaats | eBay |
|---|---|---|---|---|---|---|---|---|
| Merk | ja | ja | ja | ja | ja | ja | **nee** | ja |
| Model (bv. "Classic Flap") | ja | nee | ja (Styles) | ja (Style) | **ja, als klikbaar facet** | ja | nee | via aspecten |
| Conditie | 5 niveaus | 5 niveaus | 7 niveaus | 6-7 niveaus | 6 niveaus | ~9 labels (rommelig) | 3 niveaus | 6 niveaus |
| Kleur | ja | ja | ja | ja (Exterior Color) | ja | ja | ja | ja |
| Materiaal/leersoort | ja | ja | ja | via titel | **nee** | ja (Caviar, Lambskin...) | nee | ja |
| Hardware-kleur | nee (wel op PDP) | nee | op PDP | niet bevestigd | nee | nee | nee | nee |
| Maat/afmetingen | ja | nee | via size guides | via titel | nee | ja (Dimensions) | nee | ja |
| Prijs | ja | ja | ja | ja (buckets) | ja | ja (Budget) | ja | ja |
| Era/jaar | nee | nee | nee | nee | "Vintage"-toggle | **ja (Era + Period)** | nee | nee |
| Verkoperstype | badge | nee | n.v.t. | n.v.t. | n.v.t. | ja (disclosure) | beperkt | zichtbaar |
| Inclusies (dustbag/kaart) | vrije tekst | vrije tekst | gestructureerd | per item | "comes with" | **ja, als filter!** | nee | nee |
| Locatie/verzendland | ja | nee | n.v.t. | n.v.t. | winkel | ja | ja | ja |
| Verkocht-archief | nee | nee | **ja, openbaar** | toggle | toggle | n.v.t. | nee | ja |
| Authenticiteit als filter/badge | keuze bij checkout | badge >€100 | standaard | standaard | standaard | expert per lot | **niets** | badge ≥$500 |

## 2. Conditie-schalen (letterlijk)

- **Vestiaire (5):** Never worn with tag · Never worn · Very good condition · Good condition · Fair condition
- **Vinted (5):** Nieuw met prijskaartje · Nieuw zonder prijskaartje · Heel goed · Goed · Redelijk
- **Fashionphile (7):** Giftable · New · Excellent · Shows Wear · Worn · Fair · Flawed, plus **slijtage per zone** (Exterior/Handle/Hardware/Interior) met vaste termen en detailfoto's
- **Rebag (6-7):** New · Pristine · Excellent · Great · Very Good · Good · Fair
- **The RealReal (6):** Pristine · Excellent · Very Good · Good · Fair · As Is (met tooltip-definities)
- **Catawiki (~9):** historisch gegroeid en inconsistent (drie "new"-varianten naast elkaar); waarschuwend voorbeeld
- **Marktplaats (3):** Nieuw · Zo goed als nieuw · Gebruikt (te grof voor luxe)
- **eBay (6, vernieuwd juli 2025):** Nieuw met labels · Nieuw zonder labels · Nieuw met fouten · Tweedehands-Uitstekend · Tweedehands-Goed · Tweedehands-Redelijk, met **verplichting gebreken te fotograferen en beschrijven**

## 3. Klantflow: wat werkt

**Bieden/onderhandelen**
- Vestiaire: bod tussen 70-100% van vraagprijs, vervalt na 48 uur, verkoper kan accepteren/weigeren/tegenbod doen, offerknop per item uitzetbaar. Strak, kopieerbaar model.
- Vinted: max 25 biedingen per dag, bod max 40% onder vraagprijs, niet-bindend (eerste "Kopen" wint). Frictieloos maar chaotisch.
- Fashionphile/Rebag/RealReal: géén bieden, vaste prijzen met promocodes. Rustiger, maar mist het onderhandelgevoel van vintage.
- eBay "Beste voorstel": gestructureerd onderhandelen in de checkout in plaats van vrije chat.
- Catawiki: veiling met countdown, vaste biedstappen, max-bod (autobid), openbare biedhistorie. Sterke urgentie-mechanica.

**Vertrouwen tonen in de flow**
- eBay Authenticity Guarantee: authenticatie als zichtbare badge én trackbare tussenstap in de verzending; koper ziet live dat de tas via het authenticatiecentrum gaat. Precies ons model, maar bij ons op élke order.
- Catawiki: expert met naam en foto op elke lotpagina + estimate. Goedkoop en menselijk vertrouwensmechanisme.
- Vestiaire: "Expert Seller"-badge en verkoperland op de kaart; authenticatie verplicht boven €1.000, optioneel eronder.
- Vinted: totaalprijs inclusief kopersbescherming al op de listingkaart. Transparantie die klachten voorkomt.
- Marktplaats: escrow-principe met 7-dagen-meldtermijn, status zichtbaar voor beide partijen in de chat.

**Betaalmethoden overal:** kaarten + PayPal + Apple/Google Pay + lokaal (iDEAL/Bancontact) + BNPL (Klarna/Affirm) onder een drempel. Bevestigt onze Stripe Payment Element-keuze.

**Retour:** Fashionphile 15 dagen; Rebag 7 dagen (krap); RealReal: tassen zijn final sale (vertrouwensgat); EU-wet verplicht ons al tot 14 dagen bij zakelijke verkopers.

## 4. Valkuilen (niet doen)

1. Catawiki's gegroeide wildgroei aan conditie-labels: kies één schaal en houd vast.
2. Marktplaats' ongestructureerdheid: geen merkfacet, vrije chat, cash bij ophalen. Alles gestructureerd bij ons.
3. Vestiaire's kostenstapeling (fee tot 30% + verzending + authenticatiedoorlooptijd) zonder all-in-prijs vooraf.
4. eBay's twee vertrouwensklassen (authenticatie alleen boven een drempel): bij ons is élke order geauthenticeerd, dat is juist de merkbelofte.
5. Rebag/Fashionphile's permanente promocode-labels op elke kaart: oogt rommelig, ondermijnt prijsvertrouwen.

## 5. Advies voor Timeless

### 5a. Filterset (koperzijde)

**Fase 1 (nu, milestone-2-uitbreiding):**
1. Model, als genormaliseerd veld met vaste lijst (Classic Flap, Boy, 2.55 Reissue, Chanel 19, WOC, Vanity...): het belangrijkste luxe-facet (RealReal bewijst dit) én SEO-goud
2. Kleur (vaste lijst zoals RealReal: Black, Beige, Red, ...)
3. Materiaal (Chanel-specifiek: Caviar, Lambskin, Patent, Tweed, Canvas, Exotisch)
4. Hardware-kleur (Goud, Zilver, Ruthenium, Zwart): geen enkel platform biedt dit als filter terwijl elke Chanel-koper erop zoekt; goedkope differentiator
5. Conditie (zie 5b), Prijs, Categorie, Verkoperstype (hebben we al)
6. Era/decennium (jaren '80, '90, '00, '10): alleen Catawiki heeft dit, past perfect bij "vintage" als positionering (afleidbaar uit productionYear, geen apart veld nodig)

**Fase 2 (later):** afmetingen-ranges, inclusies als filter (Catawiki-stijl), verkocht-archief openbaar (Fashionphile-stijl, sterk voor SEO en prijsvertrouwen).

### 5b. Conditie: verfijnen naar 5 niveaus + zone-notities

De huidige 3 niveaus (Uitstekend/Goed/Gebruikssporen) zijn te grof vergeleken met alles behalve Marktplaats. Advies:

- **5 niveaus:** Nieuw (met of zonder labels) · Uitstekend · Heel goed · Goed · Gebruikssporen
- Plus per listing **slijtagenotities per zone** (buitenkant, hoeken/randen, hardware, binnenkant), Fashionphile-stijl, ingevuld/aangescherpt door het atelier bij inspectie. Dit wordt het professionele hart van elke productpagina.

### 5c. Productpagina-velden (aanvullen)

- Inclusies als gestructureerd veld (dustbag, authenticiteitskaart, box, bon, ...): Catawiki bewijst dat dit zelfs filterbaar kan
- Afmetingen (b×h×d, hengseldrop) als velden in plaats van vrije tekst
- Serienummer-jaartal tonen als "era" (bv. "serie 5xxxxxxx · 1997-1999") zonder het volledige nummer publiek te maken
- Atelier-blok: "Geauthenticeerd door [naam]" met foto, Catawiki-stijl, na inspectie

### 5d. Flow-beslissingen

1. **Bieden:** Vestiaire-model overnemen: bod 70-100% van vraagprijs, 48-72 uur geldig, accepteren/weigeren/tegenbod, offerknop per listing uitzetbaar (allowOffers bestaat al)
2. **All-in-prijs:** totaalprijs inclusief kopersfee tonen vóór de checkout (Vinted-les)
3. **Authenticatie als zichtbare, trackbare stap** in de ordertijdlijn (hebben we al gebouwd; eBay bevestigt dat dit hét vertrouwensmoment is)
4. **Retour:** 14 dagen bij zakelijke verkopers (wettelijk), bij particuliere verkopers geen herroepingsrecht maar wél de inspectie-zekerheid; precies zoals nu gecommuniceerd
5. **Verkocht blijft zichtbaar** (met "Verkocht"-label) in plaats van verdwijnen: prijsreferentie en SEO

### 5e. Routing: wat gaat wel en niet langs het atelier

De duurste operationele keuze. Vestiaire bewijst dat een drempel werkt: boven €1.000 verplicht via de hub, eronder mag rechtstreeks ("Direct Shipping"). Alles langs het atelier sturen is puur verlies op een sjaal van €200: de authenticatie kost meer tijd dan de marge oplevert, en de koper wacht onnodig lang.

**Besluit (27 juli 2026): de KOPER kiest bij het afrekenen, in drie niveaus.**

Niet het platform en niet de verkoper bepaalt de route, maar de koper kiest bij de checkout hoeveel zekerheid hij wil. Elke listing start dus gelijk; wat de koper kiest bepaalt of het stuk rechtstreeks gaat of eerst langs het atelier.

| Niveau | Wat er gebeurt | Prijs | Voor wie | Verzendroute |
|---|---|---|---|---|
| **1. Fotocontrole** | Ons team beoordeelde de acht standaardbeelden en het conditierapport vóór de listing live ging | inbegrepen | alle categorieën | rechtstreeks van verkoper naar koper, 2 tot 4 dagen |
| **2. Atelier-expertise** | Het stuk komt fysiek binnen, wordt met de hand beoordeeld op echtheid en conditie, en gaat daarna door naar de koper | + € 39 | **alle categorieën** | via het atelier, 5 tot 7 dagen |
| **3. Entrupy-certificaat** | Onze expertise plus machinale authenticatie met microscopische beeldanalyse; het certificaat blijft bij het stuk en gaat mee naar de volgende eigenaar | + € 89 | **alleen tassen** (Entrupy dekt geen kleding, sieraden of accessoires) | via het atelier, 5 tot 7 dagen |

**Waarom de koper moet kiezen en niet de verkoper:**
- De verkoper heeft geen enkele drempel meer: hij plaatst zijn stuk, klaar. Dat levert meer aanbod op
- De koper betaalt voor de zekerheid die híj wil, en dat is precies de partij met het risico
- Jij verdient aan verificatie in plaats van dat het een kostenpost is
- Het pakt goed uit per prijsklasse: bij een sjaal van € 200 kiest niemand € 89 extra, bij een tas van € 8.000 vrijwel iedereen
- De verzendroute volgt vanzelf: het label wordt pas ná de koop aangemaakt, dus wij sturen de verkoper naar het atelier of rechtstreeks naar de koper

**Wat je moet vastleggen:**
- De prijzen (€ 39 en € 89 in de demo) moeten je werkelijke kosten dekken, inclusief de extra verzendstap en ateliertijd. Reken dit door zodra je de Entrupy-tarieven kent
- Entrupy vereist een abonnement plus apparatuur; onderzoek de kosten voordat je het aanbiedt
- Bij niveau 1 blijft de kopersbescherming volledig gelden: het platform houdt het geld vast tot levering, en bij een geschil beslist ons team
- Op de productkaart staat "verification from € 39", zodat de koper weet dat de mogelijkheid er is voordat hij doorklikt

### 5f. Nog te overwegen (later, uit het onderzoek)

Vier ideeën van concullega's die nu niet passen, maar wel waarde hebben zodra het platform loopt:

1. **Terugkoopgarantie (Rebag Infinity).** Rebag koopt binnen een jaar terug voor 70-80% van de aankoopprijs, met 20% extra als je het in tegoed neemt. Dit maakt een aankoop van €6.000 minder definitief en voedt tegelijk je eigen inkoop. Voor de C2B-kant het interessantste model dat we zijn tegengekomen. Wel: vereist werkkapitaal en een prijsmodel dat je pas kunt maken met genoeg eigen verkoopdata. Fase: na het eerste jaar.
2. **Directe waardebepaling (Rebag Clair).** "Wat is mijn tas waard?" als los instrument op de site, ook voor wie nog niet wil verkopen. Sterke leadmagneet en de directe voedingsbodem voor aanbod. Jouw archief met gerealiseerde prijzen is precies de data die je ervoor nodig hebt. Fase: zodra het archief een paar honderd verkopen telt.
3. **Gespreid betalen zonder BNPL-partij (Fashionphile Reserve).** 10% niet-restitueerbare aanbetaling, daarna vrij afbetalen binnen 60 dagen, rentevrij, verzending na de laatste betaling. Bij stukken van duizenden euro's verlaagt dit de drempel fors zonder dat je marge weglekt naar Klarna. Wel: het stuk staat 60 dagen vast en het geld ook. Fase: als je merkt dat dure stukken blijven liggen.
4. **Openbaar verkocht-archief (Fashionphile).** Al gebouwd in de demo; hier vooral als herinnering dat dit ook een SEO-motor is: elke verkochte tas blijft een vindbare pagina met een gerealiseerde prijs.

### 5g. Impact op het datamodel

Nieuwe velden op Listing: `model` bestaat al; toevoegen: `color`, `material`, `hardwareColor`, `dimensions` (b/h/d/drop), `inclusions` (array), conditie-enum uitbreiden naar 5, en `wearNotes` per zone (JSON of aparte velden). Alles filterbaar met de bestaande indexstrategie.

Voor de routing (5e): `Order.fulfilmentRoute` (VIA_ATELIER | DIRECT), bepaald op koopmoment uit categorie en prijs en daarna vastgelegd. Bij DIRECT bestaat er maar één Shipment (verkoper naar koper) in plaats van drie, en slaat de orderflow de inspectiefasen over. De statusflow blijft dezelfde enum, zodat er geen tweede model ontstaat.
