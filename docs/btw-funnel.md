# BTW-funnel: ontwerp

Status: ontwerp, 27 juli 2026. Te valideren door de boekhouder/jurist (afspraak A3 in de planning) vóór livegang. Dit document beschrijft hoe het platform de BTW-stromen kanaliseert; het is de bouwspecificatie voor de factuur-engine in milestone 5.

## Uitgangspunten

1. **Twee strikt gescheiden stromen.** Het item (via Stripe Connect, nooit platformomzet) en de platformfees (wél platformomzet). Deze mogen nooit vermengd raken, ook niet op facturen.
2. **Het platform is bemiddelaar, geen wederverkoper.** Ook al ligt het item fysiek in het atelier: het eigendom gaat rechtstreeks van verkoper naar koper. De consignatievoorwaarden moeten dit expliciet vastleggen (jurist). Zonder dit fundament vervalt de hele funnel.
3. **Platformregel: zakelijke verkopers mogen alleen marge-waardige items aanbieden.** Tweedehands, ingekocht zonder aftrekbare BTW, binnen de EU. De verkoper bevestigt dit per listing met een attest-vinkje. Zo is "altijd marge" geen aanname maar een afgedwongen eigenschap, en ligt de verantwoordelijkheid bij de verkoper.
4. **EU, niet EER.** De margeregeling is EU-BTW-recht. EER-landen buiten de EU (Noorwegen, IJsland, Liechtenstein) doen niet mee; verkopen daarheen zijn export en komen pas later op de agenda.

## Stroom 1: het item

| Verkoper | Behandeling | Document |
|---|---|---|
| Particulier | Geen BTW | Aankoopbevestiging (geen factuur) |
| Zakelijk | Margeregeling (afgedwongen via attest) | Factuur namens de verkoper, vermelding "Bijzondere regeling – gebruikte goederen", GEEN BTW-bedrag |

- De koper kan bij marge-items nooit BTW aftrekken, ook een zakelijke koper niet. Dit staat op de factuur.
- De BTW over de marge berekent en voldoet de verkoper zelf in de eigen aangifte. Het platform kent de inkoopprijs niet en hoeft die niet te kennen.
- EU-breed voordeel: marge-goederen vallen buiten de afstandsverkopen-/OSS-regels; heffing blijft in het land van de verkoper. Grensoverschrijdend verkopen binnen de EU verandert niets aan de item-factuur.
- Items die niet marge-waardig zijn (ingekocht mét afgetrokken BTW) zijn in fase 1 niet toegestaan op het platform. Zie hieronder: "Beide regimes hanteren?"

## Beide regimes hanteren? (marge én standaard-BTW)

Overwogen en bewust gefaseerd:

**Fase 1 (launch): alleen marge, afgedwongen via het attest.**
- Dekt vrijwel de hele vintage-markt (C2C, B2C)
- Eén uniforme factuur- en prijsweergave, snelste route naar live

**Fase 2 (zodra B2B-handel loopt): STANDARD erbij, verkoper kiest per listing.**
- Bij standaard-BTW-items kan een zakelijke koper de BTW aftrekken: aantrekkelijk voor handelaren die voorraad inkopen (C2B/B2B), eventueel zelfs als B2B-filter "BTW-aftrekbaar"
- Consequenties die dan gebouwd moeten worden: prijsweergave incl./excl. BTW per koperstype; grensoverschrijdend B2C raakt afstandsverkopen/OSS van de verkoper; grensoverschrijdend B2B wordt een intracommunautaire levering (0%, VIES); de keuze van de verkoper wordt vastgelegd in het papertrail zodat de verantwoordelijkheid aantoonbaar bij de verkoper ligt

**Nu al geregeld in het datamodel:** `Order.vatScheme` is vanaf dag één een enum (MARGIN | STANDARD), en het attest-vinkje wordt een keuzeveld zodra fase 2 aangaat. Fase 2 is daarmee een schakelaar, geen verbouwing.

## Stroom 2: de platformfees (kopersfee + verkopersfee)

Altijd een dienst van het platform, met deze beslistabel per ontvanger:

| Ontvanger | Behandeling |
|---|---|
| NL (particulier of zakelijk) | 21% BTW |
| EU-consument (ander land) | Plaats-van-dienst-nuance: AGENDAPUNT BOEKHOUDER (bemiddelingsdienst B2C volgt de plaats van de onderliggende transactie) |
| EU-bedrijf met geldig BTW-nummer | BTW verlegd (0%, vermelding "btw verlegd"), nummer live gevalideerd via VIES |
| Buiten EU | 0% (plaats van dienst buiten EU); pas relevant na EU-fase |

## Technische vertaling (milestone 5)

**Datamodel:**
- `Listing.marginAttest` (boolean): verplicht vinkje voor zakelijke verkopers bij plaatsen: "Dit item is tweedehands en door mij ingekocht zonder aftrekbare BTW." Gelogd in het papertrail.
- `Order.vatScheme` (NONE | MARGIN): vastgelegd op koopmoment, nooit herleiden.
- `User.vatNumber` + `vatValidatedAt`: VIES-validatie bij zakelijke registratie en periodiek opnieuw.

**Factuur-engine, drie documenttypes per order:**
1. Fee-factuur platform → koper (BTW volgens beslistabel)
2. Fee-factuur platform → verkoper (BTW volgens beslistabel)
3. Alleen bij zakelijke verkoper: item-factuur namens de verkoper (marge-vermelding, geen BTW-bedrag)

Alle documenten genummerd, onveranderlijk opgeslagen, en gelogd in het papertrail (AuditLog).

## Kunnen we de margeregeling zelf inbouwen?

Vraag van 27 juli 2026. Antwoord: **deels, en het deel dat kan is een echte differentiator.**

### Wat we sowieso bouwen (dat is geen keuze)

1. Het **attest-vinkje** bij het plaatsen van een listing door een zakelijke verkoper
2. De **factuur namens de verkoper**, met de verplichte vermelding "Bijzondere regeling – gebruikte goederen" en zonder BTW-bedrag
3. Vastlegging van `vatScheme` op de order, plus een regel in het papertrail

Dat is het minimum en dekt de verplichting. De BTW over de marge berekent en betaalt de verkoper vervolgens zelf.

### Wat we extra zouden kúnnen bouwen: marge-administratie voor je verkopers

Hier zit de kans. Een zakelijke verkoper moet per verkocht stuk zijn marge bijhouden: verkoopprijs min inkoopprijs, en over dat verschil BTW afdragen. De meeste kleine handelaren doen dat in een spreadsheet, en doen het slordig.

**Wat we kunnen aanbieden:** de verkoper vult bij elke listing zijn **inkoopprijs** in (alleen zichtbaar voor hemzelf), en het platform rekent na elke verkoop automatisch uit wat zijn marge is en hoeveel BTW hij daarover verschuldigd is. Aan het eind van het kwartaal downloadt hij één overzicht dat zijn boekhouder direct kan gebruiken.

**Waarom dit sterk is:**
- Geen enkele concurrent doet dit. Vestiaire, Vinted en Catawiki laten de verkoper zelf uitzoeken
- Het bindt zakelijke verkopers aan je platform: hun administratie zit bij jou
- Het maakt je aantrekkelijk voor precies de doelgroep die je voor de B2C-kant nodig hebt
- Het kost weinig extra bouwwerk: één veld op de listing, één berekening, één exportknop

**Waar je op moet letten:**
- Je bewaart dan **inkoopprijzen**, gevoelige bedrijfsinformatie. Die mag nooit zichtbaar zijn voor kopers of andere verkopers, en hoort in het beveiligingsontwerp
- Je komt dicht bij belastingadvies. Zet er expliciet bij dat het een hulpmiddel is en dat de verkoper zelf verantwoordelijk blijft, en laat die formulering door de jurist bevestigen
- **De rekenmethode moet de boekhouder bevestigen.** In Nederland bestaat naast de individuele methode ook de globalisatiemethode, waarbij de marge per tijdvak wordt berekend in plaats van per stuk, en het hangt van het soort goed af welke is toegestaan of verplicht. Bij stukken van duizenden euro's is dat een relevant verschil dat we niet moeten gokken

**Advies:** bouw fase 1 (het verplichte deel) meteen mee, en zet de marge-administratie op de lijst voor ná livegang. Neem de rekenmethode wel nu al mee in het gesprek met de boekhouder, dan weet je of het kan voordat je het belooft.

## Checklist voor de boekhouder (afspraak A3)

- [ ] Bevestig de bemiddelaarsstatus in combinatie met fysiek bezit (consignatie) en Stripe Connect-geldstromen
- [ ] Bevestig de marge-attest-constructie en de factuurtekst namens de verkoper (machtiging in de voorwaarden regelen)
- [ ] Bevestig de gefaseerde aanpak: fase 1 alleen marge, fase 2 ook standaard-BTW met verkoperskeuze per listing
- [ ] **Individuele methode of globalisatiemethode?** Welke is toegestaan of verplicht bij gebruikte luxegoederen van duizenden euro's, en mag het platform die berekening voor de verkoper uitvoeren?
- [ ] Mag het platform inkoopprijzen van verkopers bewaren en daarop een marge-overzicht baseren, of raakt dat aan belastingadvies?
- [ ] Plaats van dienst voor fees aan EU-consumenten buiten NL (OSS ja/nee voor de fees)
- [ ] DAC7-rapportageproces (drempels: 30 transacties of € 2.000 per verkoper per jaar)
- [ ] Wat te doen bij export buiten de EU (latere fase)
