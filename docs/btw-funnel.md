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
- Items die niet marge-waardig zijn (nieuw, of ingekocht mét afgetrokken BTW) zijn niet toegestaan op het platform. Een STANDARD-BTW-flow kan later alsnog gebouwd worden als daar vraag naar is.

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

## Checklist voor de boekhouder (afspraak A3)

- [ ] Bevestig de bemiddelaarsstatus in combinatie met fysiek bezit (consignatie) en Stripe Connect-geldstromen
- [ ] Bevestig de marge-attest-constructie en de factuurtekst namens de verkoper (machtiging in de voorwaarden regelen)
- [ ] Plaats van dienst voor fees aan EU-consumenten buiten NL (OSS ja/nee voor de fees)
- [ ] DAC7-rapportageproces (drempels: 30 transacties of € 2.000 per verkoper per jaar)
- [ ] Wat te doen bij export buiten de EU (latere fase)
