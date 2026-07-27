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

## Herziene inschatting (die weken hierboven zijn te ruim)

De weken hierboven zijn traditionele inschattingen: wat een ontwikkelaar die alles typt eraan kwijt is. Dat klopt niet met hoe wij werken. Kijk naar één dag, 27 juli 2026: in die dag zijn milestone 1, 2 en 4 van de echte app gebouwd (datamodel, auth, zoeken/filteren, verkoopflow, atelier-dashboard, account), plus het platformbrede papertrail met CSV-export, plus de complete demo, plus het concurrentie-onderzoek over acht platformen. Traditioneel is dat maanden werk.

**Het typen van code is niet meer de rem.** Wat wél tijd kost:

| Wat | Waarom het niet sneller kan |
|---|---|
| Jouw beslissingen en testrondes | Jij moet elke flow zelf doorlopen en goedkeuren |
| Stripe-integratie | Hun sandbox, webhooks, echte betaalstatussen en randgevallen; hier gaat het echt om geld |
| Stripe-verificatie van je bedrijf | Dagen tot weken wachten op goedkeuring, buiten onze invloed |
| Sendcloud-koppeling | Echte labels, echte tracking-webhooks |
| Pentest | Externe partij inplannen en bevindingen oplossen |
| Jurist, boekhouder, verzekering | Afspraken, doorlooptijd, geen regel code |

**Realistische herziene inschatting:**

| Blok | Traditioneel | Met deze werkwijze |
|---|---|---|
| A. Demo-beslissingen overbouwen | 6-8 weken | **3 tot 5 werksessies** |
| B. Infrastructuur en e-mail | 2-3 weken | **2 tot 3 sessies**, plus jouw accountaanmaak |
| C. Stripe | 5-7 weken | **1 tot 2 weken**, want testen en randgevallen bepalen het tempo |
| D. Sendcloud | 2 weken | **2 tot 3 sessies** |
| E. Klaarmaken voor livegang | 2-3 weken | **1 week bouwen, plus wachttijd op de pentest** |

**Van hier tot live: 4 tot 8 weken kalendertijd,** als jij de testrondes bijhoudt.

En daarmee verschuift de kritieke lijn: **niet de techniek is bepalend, maar het zakelijke spoor.** De merknaam vastleggen, Stripe-verificatie doorlopen, algemene voorwaarden laten opstellen, verzekering regelen. Als dat spoor stilligt, ligt de livegang stil, hoe snel de app ook af is. Begin daar dus vandaag mee, niet als de bouw af is.

**De uitgeklede route** (geen berichten, geen archief, geen rapportage, verzendlabels eerst met de hand) scheelt nu nog maar een week of twee. Dat is het verschil niet meer waard: bouw het gewoon compleet.

## De app

Belangrijk om te scheiden van bovenstaande: een app is een **apart traject**, geen onderdeel van de livegang.

### Optie 1: installeerbare webapp (PWA) — AF, gebouwd op 27 juli 2026

De echte app is nu installeerbaar. Wat erin zit:

- **Manifest** met naam, kleuren en snelkoppelingen naar de collectie, verkopen en je account (die verschijnen als je het icoon ingedrukt houdt)
- **App-icoon** in maison-stijl: zwart met het ruitpatroon en de gouden initialen
- **Standalone-weergave**: opent zonder browserbalk, met de donkere statusbalk
- **Installatie-uitnodiging** onderin beeld, met de juiste tekst per apparaat (Android en desktop krijgen een installeerknop, iPhone de uitleg via het deelicoon), eenmalig weg te klikken
- **Service worker** die statische bestanden bewaart voor snelheid, maar prijzen en voorraad altijd vers ophaalt, plus een offline-scherm

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

| Route | Kalendertijd |
|---|---|
| Volledig platform zoals in de demo, live | 4 tot 8 weken |
| Installeerbare webapp | af |
| Echte app in de stores | plus 8 tot 12 weken, ná livegang |

De techniek is niet meer de kritieke lijn. **Het zakelijke spoor is dat wel:** merknaam, Stripe-verificatie, algemene voorwaarden, verzekering. Start daar deze week mee, dan lopen beide sporen gelijk op en gaat het platform live zodra het klaar is in plaats van te wachten op papierwerk.
