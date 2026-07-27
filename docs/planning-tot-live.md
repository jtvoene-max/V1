# Planning tot live, met echte cijfers

Vraag: als we Vercel, e-mail, database, verzending en Stripe nemen, hoe lang duurt het dan tot het live kan? En hoe zit het met een app?

Stand: 27 juli 2026.

## Eerst een correctie op de vraag

De demo wordt niet aan die diensten gekoppeld. De demo is een schets die we weggooien. Wat er gebeurt is dit:

1. De beslissingen uit de demo worden gebouwd in de echte app (`web/`)
2. Die echte app wordt aan de diensten gekoppeld

Stap 1 is verreweg het meeste werk, en het goede nieuws is dat een derde daarvan er al staat.

## De vijf blokken, met tijd

Onderstaande weken zijn **bouwweken**: aaneengesloten werk aan dat blok. Hoeveel kalendertijd dat is hangt af van hoeveel dagen per week je meekijkt en test, want zonder jouw akkoord op elke stap loopt het vast. Zie de kalenderberekening onderaan.

### Blok A: demo-beslissingen bouwen in de echte app — 6 tot 8 weken

Dit is de grootste post en heeft niets of niemand nodig om te beginnen.

| Onderdeel | Weken |
|---|---|
| Engels als sitetaal, met structuur voor FR/DE/ES later | 1 |
| Datamodel uitbreiden: kleur, materiaal, hardware, afmetingen, inclusies, conditie naar 5 niveaus, slijtage per zone | 1 |
| Filters, mega-menu, categoriepagina's, archief, expertise-pagina, verkooppagina | 1,5 |
| Verkoopformulier met tien fotovakken en eisen per beeld | 1 |
| Berichtensysteem gekoppeld aan stuk en order | 1 |
| Account met zijnavigatie en alle secties | 1 |
| Atelier: fasenbord, tracking, inspectierapport, voorraad, rapportage | 1,5 |
| Routing: tassen via atelier, rest boven € 1.000, overige rechtstreeks | 0,5 |

### Blok B: infrastructuur — 2 tot 3 weken

| Onderdeel | Weken |
|---|---|
| Neon-database, Vercel-hosting, staging-omgeving, foto's naar cloud-opslag | 1 |
| E-mail via Resend: alle automatische berichten, plus e-mailverificatie en wachtwoord vergeten | 1,5 |

Vanaf hier staat het platform online en kun je het aan iedereen laten zien.

### Blok C: Stripe — 5 tot 7 weken

De zwaarste en de minst voorspelbare, omdat je hier met echt geld en echte regels te maken krijgt.

| Onderdeel | Weken |
|---|---|
| Connect-onboarding: KYC voor particulieren, KYB voor bedrijven | 1 |
| Checkout met Payment Element, plus reserveringslogica tegen dubbele verkoop | 1,5 |
| Webhooks, betaalstatussen, mislukte betalingen, terugbetalingen | 1 |
| Uitbetalingen en de verdeling van beide fees | 1 |
| Facturen: drie documenttypes, margeregeling, VIES-controle | 1,5 |

Wacht op: merknaam en het KVK-account.

### Blok D: Sendcloud — 2 weken

Labels voor alle drie de verzendbenen, tracking-webhooks die de order automatisch bijwerken, retourlabels bij afkeuring.

### Blok E: klaarmaken voor livegang — 2 tot 3 weken

End-to-end tests op checkout, inspectie, retour en uitbetaling. Beveiligingsronde. AVG. Snelheidstest met 10.000+ listings. Pentest-bevindingen oplossen.

## Wat betekent dat in kalendertijd

**Optelling: 17 tot 23 bouwweken.**

| Jouw inzet | Kalendertijd tot live |
|---|---|
| Fulltime meekijken en testen | 4 tot 5 maanden |
| Halve dagen, wat realistisch is naast je andere werk | 6 tot 8 maanden |
| Een paar uur per week | 10 maanden of meer |

De rem zit niet in het bouwen. Die zit in testen, jouw akkoord per stap, en het debuggen van integraties met Stripe en Sendcloud, want daar bepaalt hun sandbox het tempo.

**Sneller live kan, door minder te bouwen.** Een uitgeklede eerste versie is haalbaar in **10 tot 12 bouwweken**: blok A halveren (geen berichten, geen archief, geen rapportage, alleen NL/EN met de bestaande filters), blok B en C volledig, blok D handmatig doen (labels met de hand aanmaken tot het volume te groot wordt), blok E ingekort tot alleen de kritieke tests. Dat is een platform waarmee je echt kunt verkopen, en de rest bouw je terwijl er al geld binnenkomt. Mijn advies is deze route.

## De app

Belangrijk om te scheiden van bovenstaande: een app is een **apart traject**, geen onderdeel van de livegang.

### Optie 1: installeerbare webapp (PWA) — 1 tot 2 weken

De site is al mobiel bruikbaar. Met een paar aanpassingen (app-icoon, offline-scherm, "toevoegen aan beginscherm") krijg je iets dat op een telefoon voelt als een app: eigen icoon, eigen venster, geen browserbalk.

- Werkt op iOS en Android zonder appstore
- Geen goedkeuring van Apple of Google nodig
- Geen aparte codebase, dus geen dubbel onderhoud
- Nadeel: pushmeldingen op iPhone werken beperkt, en je staat niet in de appstore

### Optie 2: echte app (Expo, React Native) — 8 tot 12 weken

Een echte app in de App Store en Play Store. Je hebt hier al ervaring mee vanuit de leerapps voor Claire en Cas, dus de gereedschapskist is bekend.

- Volwaardige pushmeldingen ("uw bod is geaccepteerd", "uw stuk is geëxpertiseerd")
- Camera-integratie voor het fotograferen van stukken, wat de verkoopflow flink verbetert
- Vindbaar in de stores
- Nadeel: tweede codebase, doorlopend onderhoud, en Apple's beoordelingsproces per update
- Let op: Apple wil 15 tot 30% commissie over digitale aankopen. Fysieke goederen vallen daarbuiten, dus voor jou geen probleem, maar het moet wel goed worden aangevraagd

### Advies over de app

**Doe de PWA vóór livegang** (1 tot 2 weken, past in blok B) en **de echte app pas als het platform loopt**. Redenen:

1. Je weet nu nog niet of je kopers of je verkopers de app het hardst nodig hebben, en dat bepaalt wat je bouwt
2. Elke wijziging in de flow moet straks twee keer, dus je wilt de flows eerst laten uitkristalliseren
3. Verkopers zijn de meest waarschijnlijke app-gebruikers: fotograferen met de camera, meldingen bij biedingen. Dat kan een verkopers-app worden in plaats van een app voor alles

Reken voor de app dus op **plus 8 tot 12 weken, ergens in het jaar na livegang**.

## Samengevat

| Route | Bouwweken | Kalendertijd bij halve dagen |
|---|---|---|
| Uitgeklede eerste versie, echt kunnen verkopen | 10 tot 12 | 4 tot 5 maanden |
| Volledig platform zoals in de demo | 17 tot 23 | 6 tot 8 maanden |
| Plus een echte app | plus 8 tot 12 | daarna |

Wat nu al kan beginnen zonder op iets te wachten: blok A. Wat wacht op de merknaam: Stripe, e-mail op eigen domein, en dus de livegang.
