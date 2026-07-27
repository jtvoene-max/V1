# Complete planning: Timeless Marketplace

Marketplace voor vintage Chanel (items tot ca. 25.000 euro per stuk), met de ambitie de grootste van de EU te worden. Items gaan fysiek via het platform: verkoper stuurt in, jij inspecteert en authenticeert, jij stuurt door naar de koper. Geld wordt vastgehouden via Stripe Connect, fee bij koper en verkoper.

## Eén platform, vier handelsvormen (C2C, B2C, C2B, B2B)

Je bouwt geen vier platforms. Je geeft elke partij een type, en de vier combinaties volgen daaruit vanzelf:

- **Elke gebruiker (koper én verkoper) is `PRIVATE` of `BUSINESS`.** Dat ene veld, plus BTW-nummer en bedrijfsgegevens bij zakelijke accounts, stuurt alles aan: KYC-variant, facturatie, belastingregels, consumentenbescherming.
- **Stripe Connect dekt beide kanten.** Particuliere verkopers krijgen een Individual-account (KYC: identiteit), zakelijke verkopers een Company-account (KYB: KVK-gegevens, UBO's). Stripe doet de verificatie, jij slaat nooit zelf ID-documenten op. Precies waarom Stripe hier de juiste keuze is.
- **De verschillen per combinatie zitten niet in de flow maar in de randen:**
  - *Particuliere verkoper (C2C, C2B):* geen factuurplicht, wel DAC7-rapportage boven 30 transacties of 2.000 euro per jaar.
  - *Zakelijke verkoper (B2C, B2B):* factuurplicht, vaak margeregeling voor gebruikte goederen (BTW alleen over de marge, geen BTW-aftrek voor de koper). Bespreek dit met de boekhouder.
  - *Zakelijke koper (C2B, B2B):* wil een factuur met BTW-nummer; bij EU-grensoverschrijdend kan verlegde BTW spelen.
  - *Particuliere koper (C2C, B2C):* consumentenbescherming; bij aankoop van een zakelijke verkoper geldt wettelijk herroepingsrecht (14 dagen), bij aankoop van een particulier niet. Dit moet zichtbaar zijn op de listing.
- **Jouw eigen fee is in alle vier de gevallen hetzelfde:** een dienst van het platform, met een eigen factuur van jou aan koper en verkoper.

Bouwkundig betekent dit: `accountType` op de gebruiker vanaf milestone 1, factuurgeneratie en de fiscale randen in milestone 4-5, en op elke listing zichtbaar of de verkoper particulier of zakelijk is.

Deze planning gaat ervan uit dat dit je eerste platform is. Alles staat in volgorde, met per stap wat "af" betekent. Bouwen doe je met Claude Code, dus de tijdsinschattingen zijn daarop gebaseerd: reken in totaal op 3 tot 4 maanden tot livegang naast je andere werk, waarvan het bouwen zelf het minst spannende deel is.

## De keuze die al gemaakt is

Je stack-onderzoek (Downloads) concludeert: koop de rails, bouw de trust-laag. Concreet:

- **Zelf bouwen (custom Next.js + database):** koper-UX, verkoper-UX, listings, bied-logica, inspectie-workflow, admin-dashboard. Dit is je onderscheidend vermogen.
- **Inkopen als dienst:** betalingen en KYC (Stripe Connect), verzendlabels en tracking (Sendcloud), e-mail (bv. Resend), hosting (Vercel), database (bv. Neon of Supabase).

Het bouwplan van Claude.ai beschrijft het datamodel en de flows. Dat document is je blauwdruk; deze planning is je routekaart.

---

## Week 0: alles klaarzetten (1 tot 2 dagdelen)

Doel: je kunt bouwen zonder onderweg te hoeven stoppen voor accounts of tools.

**Bestanden**
- [ ] Download `marketplace-bouwplan.md` van Claude.ai en zet het in deze map. Dit wordt later `docs/bouwplan.md` in de repo.

**Accounts aanmaken (allemaal gratis om te starten)**
- [ ] GitHub-account (code-opslag en versiebeheer), als je die nog niet hebt
- [ ] Vercel (hosting, koppel aan GitHub)
- [ ] Neon of Supabase (PostgreSQL-database; Supabase als je ook hun auth en file-opslag wilt gebruiken, dat scheelt losse diensten)
- [ ] Stripe (start in testmodus, geen KVK nodig voor sandbox)
- [ ] Sendcloud (heeft een test-/sandbox-modus)
- [ ] Resend of vergelijkbaar voor transactionele e-mail

**Op je computer**
- [ ] Node.js LTS installeren (via nodejs.org)
- [ ] Git installeren en configureren
- [ ] Controleer dat Claude Code werkt in een lege testmap

**Definitie van af:** je kunt in elke dienst inloggen en Node + Git werken lokaal.

---

## Spoor A: zakelijk (parallel aan het bouwen, blokkeert alleen de livegang)

| # | Actie | Wanneer | Blokkeert |
|---|---|---|---|
| A1 | Merknaam en domein afronden (loopt al, parallel spoor) | Week 1-4 | huisstijl, e-mail, Stripe-naam, juridische docs |
| A2 | ~~KVK~~ Geregeld, entiteit bestaat al | Klaar | niets meer |
| A3 | Afspraak boekhouder/jurist: BTW/facturatiestructuur voor alle vier de handelsvormen (margeregeling zakelijke verkopers, verlegde BTW bij B2B over de grens, herroepingsrecht B2C), algemene voorwaarden + consignatievoorwaarden, DAC7-rapportageplicht | Week 2-4 | livegang |
| A4 | Verzekering voor items in bewaring: offertes opvragen (standaard voorraadverzekering dekt luxegoederen van derden meestal niet, vraag naar "goederen van derden onder beheer") | Week 2-6 | livegang, of je accepteert bewust het risico bij een zachte start |
| A5 | Authenticatiepartner kiezen (LegitApp of Entrupy, uit je stack-onderzoek) voor de echtheidscheck bij inspectie | Week 4-8 | de inspectie-operatie, niet de bouw |

Niets in spoor A hoeft af te zijn om te beginnen met bouwen. Alles werkt in sandbox-modus.

---

## Spoor B: bouwen, in 7 milestones

Werk milestone voor milestone. Begin geen nieuwe voordat de vorige aantoonbaar werkt (zie "definitie van af" per stap). Elke milestone is 1 tot 3 weken naast ander werk.

### Milestone 1: fundament (week 1-2)
Repo aanmaken, Next.js-project opzetten, database koppelen, en het volledige datamodel uit het bouwplan implementeren: Listing (uniek, stock 1, conditieschaal, reservering), Order met statusflow, Shipment (3 benen inclusief retour), Offer, User met rollen (koper, verkoper, team) én `accountType` (PRIVATE/BUSINESS, met BTW-nummer en bedrijfsgegevens bij BUSINESS). Plus inloggen en registreren.

**Definitie van af:** je kunt lokaal een account aanmaken, inloggen, en in de database staan alle tabellen. Seed-script vult de database met testdata (denk aan honderden nep-listings, want je verwacht 10.000+ producten en wilt vroeg zien hoe dat voelt).

### Milestone 2: listings en zoeken (week 3-4)
Verkoper kan een listing aanmaken (foto's uploaden volgens richtlijnen, conditie kiezen, prijs zetten). Kopers kunnen bladeren, zoeken en filteren. Zoekindex vanaf het begin goed opzetten (database-indexen, paginering), niet alles client-side laden.

**Definitie van af:** met 500+ seed-listings is zoeken en filteren snel, en een testverkoper kan een echte listing met foto's plaatsen die direct vindbaar is.

### Milestone 3: checkout en betaling (week 5-7)
De spannendste milestone, neem er de tijd voor. Stripe Connect in testmodus: verkoper-onboarding voor beide accounttypes (Individual-KYC voor particulieren, Company-KYB voor bedrijven), checkout met Payment Element (iDEAL, kaarten, Bancontact, SEPA; Klarna alleen onder het BNPL-maximum), geld vasthouden tot levering, reserveringslogica zodat twee kopers nooit hetzelfde unieke item kunnen kopen.

**Definitie van af:** volledige testaankoop met Stripe-testkaarten werkt, inclusief het scenario waarin twee browsers tegelijk hetzelfde item proberen te kopen (één wint, één krijgt nette melding). Webhooks van Stripe worden geverifieerd en verwerkt.

### Milestone 4: de operatie-flow (week 8-9)
Het hart van jouw model. Teamdashboard-basis: item binnenboeken bij ontvangst, inspectie goedkeuren of afkeuren, bij afkeuring de retourflow (kosten verkoper), bij goedkeuring doorsturen naar koper. Sendcloud-sandbox voor labels op alle drie de benen. Directe payout naar verkoper zodra de order op COMPLETED staat.

**Definitie van af:** je kunt een complete order doorspelen van aankoop tot payout, en ook het afkeur-pad van begin tot eind, allemaal in sandbox.

### Milestone 5: bieden, facturen, e-mails en support (week 10-11)
Offer-model activeren: bieden, tegenbod, accepteren, verlopen. Factuurgeneratie: platformfee-facturen aan koper en verkoper (altijd), verkoopfactuur namens zakelijke verkopers, herroepingsrecht-vermelding op B2C-orders. E-mailnotificaties bij elke relevante statusovergang (bod ontvangen, item onderweg, inspectie akkoord, uitbetaald). Supportkanaal: contactformulier/e-mail gekoppeld aan order- en listingcontext, eventueel later chat.

**Definitie van af:** een bied-onderhandeling van bod tot geaccepteerde koop werkt, bij elke stap valt de juiste mail in een test-inbox, en elke orders-combinatie (particulier/zakelijk aan beide kanten) levert de juiste documenten op.

### Milestone 6: dashboard afmaken en meertaligheid (week 12-13)
Team-dashboard compleet met rolgebaseerde toegang. Meertaligheid technisch opzetten met NL en EN volledig; FR/DE/ES zijn daarna alleen nog vertaalwerk, geen bouwwerk.

**Definitie van af:** een teamlid zonder admin-rechten ziet alleen wat mag, en de site is volledig te gebruiken in NL en EN.

### Milestone 7: hardening en staging (week 14-15)
End-to-end tests op de vier kritieke flows (checkout, inspectie, retour, payout). Security-ronde: row-level security of gelijkwaardige toegangscontrole, webhook-verificatie nalopen, AVG-check (welke data bewaar je, hoe lang, verwerkersovereenkomsten met Stripe/Sendcloud/hosting). Staging-omgeving op Vercel die identiek is aan productie. Pentest inplannen (extern).

**Definitie van af:** de e2e-tests draaien groen, staging staat live op een testdomein, en je hebt zelf als "kwaadwillende gebruiker" geprobeerd bij andermans data te komen en dat lukte niet.

---

## Launch (week 15-16, mits spoor A rond is)

- [ ] Stripe naar live-modus (vereist KVK en merknaam, A1 + A2)
- [ ] Juridische documenten live: algemene voorwaarden, consignatievoorwaarden, privacyverklaring, retourbeleid (A3)
- [ ] Verzekering geregeld of risico bewust geaccepteerd (A4)
- [ ] Domein gekoppeld, e-mail op eigen domein
- [ ] Pentest-bevindingen opgelost
- [ ] Zachte start: eerst een handvol echte verkopers en items, pas daarna open aanmeldingen

## EU-schaal: wat "grootste Chanel-marketplace van de EU" praktisch betekent

De ambitie verandert niets aan de bouwvolgorde, wel aan een paar keuzes die je nu al goed wilt zetten:

- **Valuta:** start in euro's. SEK/PLN/DKK pas als die markten er echt om vragen; Stripe kan het aan wanneer het zover is.
- **Verzending:** Sendcloud dekt de EU met meerdere vervoerders. Verzekerde verzending is bij deze itemwaardes belangrijker dan snelheid; neem dat mee in de vervoerderskeuze per land.
- **BTW over de grens:** verkopen aan consumenten in andere EU-landen raakt de OSS-regeling (One Stop Shop); B2B over de grens raakt verlegde BTW. Beide op de agenda voor de boekhouder (A3), niet iets om zelf te verzinnen.
- **Talen:** het plan (NL/EN eerst, dan FR/DE/ES) past precies bij deze ambitie. FR en DE zijn de grootste vintage-Chanel-markten van de EU, dus die volgen direct na launch.
- **Trust als moat:** de reden dat een EU-koper bij jou koopt in plaats van bij Vestiaire Collective is de fysieke authenticatie en de consignatie-zekerheid. Dat is het deel dat je zelf bouwt en dat niemand kan kopiëren door alleen software te kopen. Vandaar: inspectie-workflow en team-dashboard krijgen dezelfde kwaliteitseisen als de koperservaring.

## Werkwijze met Claude Code (belangrijk omdat dit je eerste platform is)

1. **Eén milestone per periode, kleine sessies.** Geef Claude Code per sessie één afgebakende taak uit deze planning, niet "bouw milestone 3".
2. **Documenten in de repo.** Zet `bouwplan.md` en deze `PLANNING.md` in een `docs/`-map en verwijs ernaar; maak ook een `CLAUDE.md` in de repo-root met de stackkeuzes en afspraken.
3. **Commit na elke werkende stap.** Dan kun je altijd terug. Vraag Claude Code om te committen zodra iets werkt.
4. **Test zelf mee.** Klik na elke sessie zelf door de flow heen als gebruiker. De "definitie van af" hierboven is jouw checklist, niet die van de AI.
5. **Sandbox tot het einde.** Geen echte betaalgegevens of live-keys tot de launch-checklist.

## Valkuilen bij een eerste platform

- **Te vroeg mooi maken.** Design polish komt na milestone 4, niet ervoor. Eerst moet de motor draaien.
- **Scope-kruip.** Nieuwe ideeën (wishlist, reviews, app) op een lijst "na launch" zetten, niet inbouwen.
- **Betalingslogica onderschatten.** Milestone 3 en 4 zijn samen de helft van het werk. Dat is normaal.
- **Alleen het happy path testen.** Juist het afkeur-pad, de dubbele koper en de mislukte betaling maken of breken het vertrouwen in je platform.
- **Live gaan zonder spoor A.** De techniek is af wanneer jij dat wilt, maar zonder KVK, voorwaarden en verzekering loop je persoonlijk risico bij items van 25.000 euro.
