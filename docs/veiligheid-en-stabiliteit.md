# Hoe veilig en stabiel is deze stack?

Je vraag: open source en gratis is mooi, maar ik wil stabiel en geen gezeur. Terecht. Hier het eerlijke antwoord, met wat we vandaag al gedaan hebben en wat er nog moet. Peildatum 27 juli 2026.

---

## Eerst: "gratis en open source" is hier niet wat je denkt

De verwarring zit in het woord gratis. Er zijn drie heel verschillende soorten:

**1. Commercieel gebouwd, gratis te gebruiken.** Next.js is het product van Vercel, een bedrijf met honderden werknemers dat er zijn omzet mee verdient. React komt van Meta. PostgreSQL bestaat dertig jaar en draait bij banken en overheden. Prisma is een gefinancierd bedrijf. Dit is geen hobbywerk; dit is infrastructuur waar duizenden bedrijven op draaien.

**2. Betaald en commercieel.** Vercel, Neon, Stripe, Cloudflare, Resend, Sendcloud. Precies de partijen die jouw data, je geld en je foto's vasthouden, en die daar contractueel voor aansprakelijk zijn.

**3. Community-projecten met één onderhouder.** Dit is de categorie waar je terecht huiverig voor bent. Mercur viel hierin, en dat was precies een van mijn redenen om het af te raden.

Het punt: bijna alles in onze stack zit in categorie 1 of 2. Er is één uitzondering, en die is echt relevant.

---

## Het zwakke punt: Auth.js

Dit is de eerlijke waarschuwing. **Auth.js (waar ons inloggen op draait) is de minst stabiele keuze in de stack:**

- Versie 5 is **na jaren nog steeds beta** (nu 5.0.0-beta.32)
- Op **20 juli 2026, vorige week dus, zijn vier beveiligingsadviezen gepubliceerd**, waarvan twee kritiek (9.1 van de 10). Een daarvan is een inlog-omzeiling die *open faalt*: bij een configuratiefout wordt iedereen als ingelogd gezien, ook niet-ingelogde bezoekers
- Het project is inmiddels overgedragen aan het Better Auth-team, dat in juli 2026 door Vercel is overgenomen

**Wat we vandaag gecontroleerd en gedaan hebben:** we bleken al op de gepatchte versies te staan (next-auth 5.0.0-beta.32, @auth/core 0.41.3). We hebben verder de verouderde ontwikkelpakketten bijgewerkt (van 16 meldingen naar 9, allemaal in gereedschap dat niet naar productie gaat) en Dependabot ingesteld, dat vanaf nu dagelijks controleert op kwetsbaarheden en automatisch een voorstel doet.

**Advies: stap over op Clerk vóór livegang.** Kosten: gratis tot 50.000 actieve gebruikers, daarna $ 25 per maand.

| | Auth.js (nu) | Clerk |
|---|---|---|
| Status | beta, kritieke lekken vorige week | commercieel product, SOC 2 Type 2 gecertificeerd |
| E-mailverificatie | zelf bouwen | inbegrepen |
| Wachtwoord vergeten | zelf bouwen | inbegrepen |
| Tweestapsverificatie | zelf bouwen | inbegrepen (Pro) |
| Bot-detectie bij inloggen | zelf bouwen | inbegrepen |
| Wie is aansprakelijk | jij | Clerk |
| Kosten | gratis | gratis tot 50.000 gebruikers, dan $ 25 |

Dat is niet alleen veiliger, het scheelt ook drie stukken bouwwerk die anders op de lijst stonden. Eén kanttekening die je moet weten: **Clerk heeft geen EU-datacenter**, je gebruikersgegevens staan in de VS onder het EU-VS Data Privacy Framework. Juridisch in orde voor de AVG, maar het is een keuze die je bewust maakt. Wil je per se data in de EU, dan is **Better Auth** het alternatief (open source, MIT, 6,2 miljoen downloads per week, sinds juli 2026 eigendom van Vercel), maar dan blijf je zelf verantwoordelijk.

---

## De acht beveiligingslagen

Zo ziet het er compleet uit. Wat er al staat, wat er nog moet.

### Laag 1: Infrastructuur — geregeld door de leveranciers
Vercel, Neon, Cloudflare en Stripe hebben allemaal SOC 2- of ISO 27001-certificering, DDoS-bescherming, versleutelde opslag en 24/7 monitoring. Dit is precies waarom je hiervoor betaalt in plaats van zelf servers te beheren. **Status: geregeld.**

### Laag 2: Toegangscontrole in onze eigen code
Elke pagina en elke actie controleert zelf wie je bent en wat je mag, in plaats van te vertrouwen op een centrale poortwachter.

Dat is een bewuste keuze en belangrijker dan het klinkt: **Next.js middleware is in 2025 en tweemaal in 2026 gebroken** met kritieke omzeilingen (CVE-2025-29927 en CVE-2026-64642). Wie zijn autorisatie alleen daar heeft staan, stond op die momenten open. Wij niet, omdat de controle in de pagina zelf zit. **Status: geregeld, en bewust zo gebouwd.**

### Laag 3: Geen gevoelige gegevens bij ons
Wat we bewust *niet* opslaan is net zo belangrijk als wat we wel beveiligen:
- **Creditcardnummers**: nooit, die gaan rechtstreeks naar Stripe
- **Paspoorten en KVK-documenten**: nooit, die gaan naar Stripe voor de verificatie
- **Wachtwoorden**: alleen versleuteld (bcrypt), en na overstap naar Clerk zelfs helemaal niet meer

Wat er wél staat: namen, adressen, orders. Dat is onvermijdelijk en normaal. **Status: geregeld.**

### Laag 4: Toeleveringsketen (de Mercur-les)
Elke npm-pakket dat je installeert is code van een vreemde die op jouw server draait. Bij Mercur stond een week lang kwaadaardige code in de repository. Maatregelen:
- **Dependabot** (vandaag ingesteld): dagelijkse controle op kwetsbaarheden, automatisch voorstel tot bijwerken
- **Vastgezette versies** via package-lock.json, dus niemand kan stiekem een andere versie inschuiven
- **Weinig pakketten**: hoe minder afhankelijkheden, hoe kleiner het aanvalsoppervlak

**Status: ingericht vandaag.**

### Laag 5: Misbruik weren
Uit het eerdere Cloudflare-document: Turnstile bij registreren en inloggen, limiet op mislukte inlogpogingen, limiet op biedingen per dag, linkfilter in berichten, Stripe Radar tegen kaartfraude. **Status: te bouwen vóór livegang.**

### Laag 6: Back-ups en herstel
Neon maakt automatisch back-ups met herstelpunten. Op het gratis plan is de bewaartermijn kort; **neem het betaalde plan zodra er echte data in staat**, dan kun je terug naar elk moment in de afgelopen dagen. Dat is bij items van € 25.000 geen luxe. **Status: te regelen bij de stap naar staging.**

### Laag 7: Weten wanneer er iets misgaat
Nu zou je het pas horen als een klant belt. Dat wil je niet.

**Toevoegen: Sentry** ($ 26 per maand, of gratis tot 5.000 fouten per maand, mét EU-hosting in Frankfurt). Die stuurt je een melding zodra er ergens een fout optreedt, met precies welke pagina, welke gebruiker en welke regel code. Let op: kies bij het aanmaken meteen de EU-regio, want achteraf verhuizen kan niet.

Daarnaast een simpele uptime-monitor die je waarschuwt als de site onbereikbaar is. **Status: toevoegen bij de stap naar staging.**

### Laag 8: Onafhankelijke controle
Een pentest vóór livegang, waarbij iemand van buiten probeert binnen te komen. Plus end-to-end tests op de vier kritieke flows (afrekenen, inspectie, retour, uitbetaling) zodat een wijziging nooit stilletjes iets sloopt. **Status: staat in de planning voor de laatste fase.**

---

## Aangepaste softwarelijst

Op basis van bovenstaande, twee toevoegingen:

| Software | Rol | Kosten | Waarom |
|---|---|---|---|
| **Clerk** *(vervangt Auth.js)* | Inloggen, registreren, tweestapsverificatie, wachtwoordherstel | gratis tot 50.000 gebruikers, daarna $ 25/maand | Commercieel en gecertificeerd in plaats van een betaversie met kritieke lekken; scheelt ook drie stukken bouwwerk |
| **Sentry** *(nieuw)* | Foutmeldingen: je weet het vóór je klant het weet | gratis tot 5.000 fouten, daarna $ 26/maand | Zonder dit merk je storingen pas als iemand belt. EU-hosting in Frankfurt |
| **Dependabot** *(nieuw, vandaag)* | Waarschuwt bij kwetsbare pakketten | gratis (zit bij GitHub) | De Mercur-les: toeleveringsketen bewaken |
| **Neon betaald plan** | Langere bewaartermijn voor back-ups | verbruiksafhankelijk | Terug kunnen naar elk moment, niet alleen naar gisteren |

**Nieuwe totaalkosten: ongeveer € 50 tot 60 per maand bij de start, € 130 tot 180 draaiend.** Dat is ongeveer € 30 per maand meer dan de eerdere lijst, en dat is het waard: je ruilt drie stukken zelfbouw en een betaversie in voor commerciële partijen die aansprakelijk zijn.

---

## "Is een standaard platform niet veiliger?"

Terugkerende vraag, meestal in de context van Mercur of Medusa. Het antwoord is
niet zwart-wit, dus hier de drie stukken apart.

### Waar zo'n platform écht wint

**Veiligheidsfuncties die je anders zelf bouwt.** Wachtwoord vergeten,
e-mailverificatie, sessiebeheer, tweestapsverificatie, een rollen- en
rechtensysteem. Zelf gebouwde inlogsystemen zijn een klassieke bron van
ellende, en dat is precies waar wij nu nog zwak staan.

**Veel ogen op dezelfde code.** Duizenden gebruikers, een meldproces voor
kwetsbaarheden, updates die je installeert in plaats van zelf schrijven.

### Waar het gelijk staat

**Jouw eigen logica blijft jouw probleem.** Wie mag welke order zien, klopt de
uitbetaling, kan iemand andermans listing wijzigen. Dat is bij ons maatwerk en
op Mercur óók maatwerk, want consignatie en het atelier zitten in geen enkel
framework. En dat is nu net de code waar geld en goederen doorheen gaan.

**Configuratie is waar het in de praktijk misgaat.** Niet in slimme aanvallen,
maar in vergeten deuren. Het probleem dat vandaag boven kwam, een openbare
repo met een beheerderswachtwoord erin en één database voor test en live, was
op Mercur precies hetzelfde geweest. Dat is discipline, geen architectuur.

### Waar het juist minder veilig is

**Aanvalsoppervlak.** Een marktplaatsframework kan honderd dingen; jij gebruikt
er twintig. Die andere tachtig draaien wel mee. Onze app heeft een handvol
pagina's en een korte lijst afhankelijkheden, en alles wat er niet is kan ook
niet lek zijn.

**Toeleveringsketen.** Dit is in deze wereld het grootste reële risico, niet
hackers. Elk pakket dat je installeert is code van een vreemde op jouw server.
Een standaard platform met plugins betekent al snel een veelvoud aan
afhankelijkheden. Bij Mercur stond eind januari 2026 een week lang kwaadaardige
code in de admin-repository voordat het gemeld werd. Dat is geen verwijt aan
dat project in het bijzonder, het overkomt grotere ook, maar het laat zien
welke kant het risico op zit.

**Bekende deuren.** Een standaard platform heeft een beheerderspagina op een
adres dat iedereen kent. Dat wordt structureel afgezocht. Onze atelierpagina
staat op een pad dat verder niemand kent en geeft een harde 403.

### De praktische conclusie

Wat je van zo'n platform zou willen, zijn de veiligheidsfuncties rond inloggen.
Die kun je **kopen zonder te verhuizen**: Clerk of Better Auth geeft je
tweestapsverificatie, e-mailverificatie, wachtwoordherstel en botbescherming,
met een partij die er aansprakelijk voor is. Dat staat al als eerste punt op de
[checklist voor de livegang](checklist-livegang.md).

Je krijgt dan het voordeel van een standaard platform op precies het punt waar
het telt, zonder de nadelen op de andere drie.

---

## Eerlijk antwoord op "geen gezeur"

Wat je koopt met deze keuzes:

- **Geen serverbeheer.** Geen updates draaien, geen back-ups regelen, geen schijven die vollopen. Dat doen Vercel en Neon.
- **Geen betaalgedoe.** Stripe is aansprakelijk voor de betaalveiligheid, niet jij. Kaartgegevens raken je server nooit.
- **Geen inlogzorgen** (na de overstap naar Clerk). Wachtwoorden, tweestapsverificatie en sessies zijn dan hun probleem.
- **Automatische waarschuwingen** bij kwetsbaarheden (Dependabot) en storingen (Sentry).

Wat er altijd jouw verantwoordelijkheid blijft:

- **Onze eigen code.** Wie mag wat zien, klopt de uitbetalingslogica. Daarom de pentest en de end-to-end tests.
- **Bijwerken.** Elke maand komen er updates. Dependabot doet het voorstel, maar iemand moet op de knop drukken. Reken op een half uur per maand.
- **Toegang tot je accounts.** Zet tweestapsverificatie aan op Vercel, Neon, Stripe, Cloudflare en GitHub. Dat is de makkelijkste manier om alles te verliezen als je het niet doet.

Dat is het hele verhaal. Geen enkele stack is gezeurvrij, maar deze legt het gezeur zo veel mogelijk bij partijen die ervoor betaald worden.
