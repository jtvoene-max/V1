# Overstap naar Medusa

**Besluit 28 juli 2026.** Still Iconic wordt gebouwd op een standaard
opensource marktplaatsplatform in plaats van volledig maatwerk. Reden: niet
techniek maar overdraagbaarheid. Je kunt een Medusa-ontwikkelaar inhuren, een
Still Iconic-ontwikkelaar niet, en bij verkoop of investering is "draait op
Medusa" een bekend risicoprofiel terwijl maatwerk een korting is.

De afweging staat in [connectors-en-kanalen.md](connectors-en-kanalen.md).
Dit document gaat over de uitvoering.

## Eerst een verduidelijking: Medusa of Mercur

Die twee worden door elkaar gebruikt maar zijn niet hetzelfde.

- **Medusa** is de commerce-motor: producten, orders, klanten, betalingen,
  verzending. Eén winkel, één verkoper.
- **Mercur** is de marktplaatslaag bovenop Medusa: verkopers, onboarding,
  commissies, uitbetalingen per verkoper, order splitting, beoordelingen, en
  een apart verkopers-panel.

Een marktplaats met vier handelsvormen bouwen op kaal Medusa betekent dat je
die hele verkoperslaag zelf schrijft, en dan ben je precies terug bij maatwerk
met een extra framework eromheen. **Dus: Mercur op Medusa**, niet Medusa
alleen.

## Wat er niet verloren gaat

Belangrijk om te zien voordat dit als weggegooid werk voelt. Het meeste van wat
er ligt is geen code maar besluitvorming, en die is platformonafhankelijk:

- **Alle onderzoeksdocumenten**: filterset, conditie in vijf niveaus, slijtage
  per zone, de drie verificatieniveaus, de btw-funnel, verzending en
  verzekering, de checklist voor de livegang, de lessen van Chrono24
- **Alle teksten.** `web/src/lib/i18n.ts` is een compleet, doordacht
  tekstbestand voor de hele site. Dat gaat één op één mee
- **De acht vaste opnames** met silhouetten en de bijbehorende SVG's
- **Het datamodel als ontwerp**: welke velden een listing heeft, welke twaalf
  orderstatussen er zijn, wat er in het papertrail moet
- **De demo en de designtaal**: maison-stijl, typografie, de hele opmaak

**Wat opnieuw gebouwd wordt is de bedrading**, niet het denkwerk. Reken erop
dat je ongeveer de helft van de doorlooptijd terugkrijgt doordat alle vragen
al beantwoord zijn.

## Wat wél echt anders wordt

**Hosting.** Dit is de grootste praktische verandering. Medusa is een echte
Node-server met Postgres én Redis, en dat draait niet op Vercel zoals nu.
Je hebt een serveromgeving nodig: Railway, Render, DigitalOcean of Medusa
Cloud. De winkelkant kan wel een Next.js-app op Vercel blijven.

Gevolg: hogere en andere kosten, plus serveronderhoud dat je nu niet had.
Dat moet in [diensten-en-kosten.md](diensten-en-kosten.md) worden bijgewerkt
zodra de keuze gemaakt is.

**Auth.** Medusa heeft een eigen gebruikers- en sessiesysteem. Auth.js verdwijnt
daarmee, en dat lost meteen het zwakke punt op dat in
[veiligheid-en-stabiliteit.md](veiligheid-en-stabiliteit.md) staat.

**De database.** Medusa gebruikt zijn eigen datamodel en migraties, geen
Prisma-schema van ons. Onze extra velden (conditie per zone, hardware, era,
verificatieniveau) komen erbij als eigen modules.

**Wat je zelf blijft bouwen, ook op Mercur:** het atelier als fase in de
orderflow, de drie verificatieniveaus met de routering die daaruit volgt,
uitbetaling pas na goedkeuring, het papertrail, en de conditie per zone. Dat
is de tien procent die van jou is, en die is er niet minder om.

## Aanpak: eerst een proef, niet meteen alles

Niet omgooien wat werkt voordat bewezen is dat het nieuwe kan wat het moet.

### Stap 1: proef van één tot twee weken

Doel is één vraag beantwoorden: **kan de atelier-flow hier fatsoenlijk in?**
Concreet uitproberen:

1. Mercur lokaal draaiend krijgen met een verkoper en een product
2. Een product als uniek stuk (voorraad 1) met onze extra velden
3. Een eigen orderstatus toevoegen tussen betaling en verzending, namelijk
   "bij het atelier", en kijken hoeveel weerstand dat geeft
4. Uitbetaling uitstellen tot ná goedkeuring in plaats van bij verzending
5. Een blik op het verkopers-panel: is dat bruikbaar of moet het toch eigen

Komt daar uit dat punt 3 en 4 vechten tegen het framework, dan weet je dat
vóór je maanden investeert in plaats van erna. Dat is precies het risico waar
ik eerder voor waarschuwde, en een proef is de goedkoopste manier om te weten
of het klopt.

### Stap 2: parallel bouwen

Het huidige platform blijft draaien als **werkende specificatie**. Niet als
product dat je moet onderhouden, maar als iets dat je naast je kunt openen om
te zien hoe iets moest werken. Dat is meer waard dan een document.

### Stap 3: overzetten

Data overzetten is nu triviaal, want er staat alleen testdata in. **Dat is een
argument om dit nu te doen en niet over een half jaar**, en die timing had je
goed aangevoeld: over een half jaar met echte klanten en orders erin was dit
een migratieproject geweest in plaats van een herstart.

## Wat dit betekent voor de planning

De livegang schuift op. Eerlijk: reken op **twee tot drie maanden extra**,
waarvan een deel wordt terugverdiend doordat verkopers-onboarding, commissies,
uitbetalingen, beoordelingen en het verkopers-panel al bestaan.

Wat **niet** opschuift en gewoon doorloopt, want dat is platformonafhankelijk:

- De merknaam vaststellen, want die blokkeert Stripe
- De merkenrechtvraag rond Chanel
- De verzekering voor goederen van derden
- De schriftelijke bevestiging van PostNL en DHL
- Jurist, boekhouder, voorwaarden

Dat zijn precies de punten met de langste doorlooptijd, dus die winst raak je
niet kwijt.

## Wat je zelf moet uitzoeken

- **Wat kost Mercur?** Op mercurjs.com staat geen prijs, dus dat is een
  gesprek. Vraag ook naar ondersteuning en naar wat er in de betaalde versie
  zit dat er in de open versie niet in zit
- **Hoe staat het project ervoor** qua onderhoud en beveiliging. Mijn eerdere
  notitie daarover is van vorige maand en verdient een frisse blik
- **Is er een bureau of ontwikkelaar** die je kent en die hiermee werkt? Dat
  was per slot van rekening de reden voor deze keuze; het is de moeite waard
  om vóór de bouw te toetsen of dat aanbod er echt is
