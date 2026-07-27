# Van demo naar echt platform

Beantwoordt: waar bouwen we dit echt, hoe zit het met de database, inloggen, e-mail en hosting. Stand: 27 juli 2026.

## Twee dingen die je niet moet verwarren

| | `docs/demo.html` | `web/` |
|---|---|---|
| Wat het is | Eén HTML-bestand, alles nep | De echte applicatie |
| Data | Verzonnen lijstjes in JavaScript | Echte database |
| Blijft bestaan? | Nee, wordt weggegooid na de bouw | Ja, dit wordt het platform |
| Waarvoor | Ontwerpen, uitproberen, beslissingen nemen | Het product |

Alles wat je in de demo tweakt is een **beslissing**, geen bouwwerk. Blijf gerust tweaken: het is vele malen goedkoper om daar iets te veranderen dan in de echte app. Zodra iets goed voelt, bouw ik het over.

## Wat er al écht werkt in `web/`

Dit is geen prototype meer, dit draait op een echte database met echte inlog:

- **Database met 11 tabellen**: gebruikers (particulier/zakelijk), listings met foto's, orders met volledige statusflow, verzendingen, biedingen, inspectierapporten, uitbetalingen, adressen en het audit-logboek
- **Inloggen en registreren**, inclusief de keuze particulier/zakelijk met KVK- en BTW-velden
- **Collectie met zoeken en filteren**, listingdetailpagina, verkoopflow met foto-upload
- **Atelier-dashboard** met wachtrijen, orderverwerking en verplichte inspectienotities
- **Papertrail** met filters en CSV-export
- **Mijn account** met bestellingen, listings, verkopen en uitbetalingen

Wat er in de demo bij is gekomen (mega-menu, conditie in 5 niveaus, kleur/materiaal/hardware-filters, berichten, archief, expertise-pagina, rapportage, Engels, routing) staat nog **niet** in de echte app. Dat is de volgende bouwronde.

## De database

**Nu:** een lokale database op je eigen computer (Prisma Postgres, start met `npx prisma dev`). Prima om te bouwen, maar hij bestaat alleen bij jou en verdwijnt als je de map weggooit.

**Straks:** een cloud-database. Aanbeveling: **Neon** (of Supabase). Beide zijn PostgreSQL, dus we hoeven niets aan het datamodel te veranderen; het is één regel in een instellingenbestand.

- Neon: gratis om te starten, ongeveer € 19 per maand zodra je serieus draait
- Automatische back-ups en herstelpunten, wat je bij items van € 25.000 echt wilt
- Servers in de EU (Frankfurt), belangrijk voor de AVG

**Wat jij moet doen:** een account aanmaken zodra we naar staging gaan. Verder niets; ik regel de koppeling.

## Inloggen

**Nu:** e-mail en wachtwoord, met veilig gehashte wachtwoorden (Auth.js). Werkt, maar mist nog drie dingen die je vóór livegang wilt:

1. **E-mailverificatie** bij registratie, zodat niemand zich met andermans adres aanmeldt
2. **Wachtwoord vergeten**, anders ben je zelf de helpdesk
3. **Tweestapsverificatie** voor jou en je team, want jullie accounts kunnen bij alle orders en gegevens

Optioneel later: inloggen met Google of Apple. Dat verlaagt de drempel, maar is niet nodig om te starten.

Belangrijk: **identiteitsverificatie doet Stripe**, niet wij. Een verkoper bewijst bij Stripe wie hij is (paspoort, of KVK en UBO's bij bedrijven). Wij slaan die documenten nooit op, en dat is precies wat je wilt.

## E-mail

**Nu:** nog niets. Dat is het grootste gat in de echte app.

**Straks: Resend** (of Postmark). Twee soorten mail:

*Automatisch, per gebeurtenis:*
- Verkoper: item verkocht, verzendlabel, bod ontvangen, uitbetaling onderweg
- Koper: bestelling bevestigd, item ontvangen in atelier, expertise akkoord, onderweg met tracking, geleverd
- Beide: registratie bevestigen, wachtwoord herstellen, bericht ontvangen

*Handmatig, vanuit het team:* antwoorden op vragen via het berichtensysteem.

**Wat jij moet doen:** je domein bij Resend koppelen (drie DNS-regels: SPF, DKIM en DMARC) zodat mail niet in de spam belandt. Kost tien minuten, maar pas als de merknaam definitief is.

Kosten: gratis tot 3.000 mails per maand, daarna ongeveer € 20.

## Hosting: waarom SiteGround hier niet werkt

SiteGround is prima voor je andere sites (AgriLearn, Quinta Hoekstra, Coached by Stijn): dat zijn statische sites of WordPress, en daar is SiteGround voor gemaakt.

Dit platform is iets anders. Het is een Next.js-applicatie die **server-side draait**: bij elk bezoek berekent de server welke listings je ziet, of je mag inloggen, wat je in je account hoort te zien. SiteGround draait PHP op gedeelde servers en heeft geen Node.js-omgeving die dit aankan. Je zou het misschien werkend krijgen op hun cloud-pakketten, maar dan ben je zelf systeembeheerder aan het spelen: geen automatische schaling, geen makkelijke rollback, handmatig deployen, en betaalproblemen bij piekverkeer.

**Aanbeveling: Vercel.** Dat is gebouwd door de makers van Next.js.

- Elke `git push` zet automatisch een nieuwe versie live, met één klik terug naar de vorige
- Automatische staging-omgeving per wijziging, precies wat je in het bouwplan wilde
- Servers in de EU, schaalt vanzelf mee
- Gratis om te starten, ongeveer € 20 per maand per teamlid zodra het serieus wordt

**Je domein mag gewoon blijven waar het is.** Je koopt het waar je wilt en laat het via DNS naar Vercel wijzen. SiteGround kan zelfs je domeinbeheer blijven doen; alleen de site zelf draait ergens anders.

## Wat je moet aanschaffen, en wanneer

| Wanneer | Wat | Kosten om te starten |
|---|---|---|
| Zodra we naar staging gaan | Neon (database), Vercel (hosting), GitHub (code) | gratis |
| Zodra de merknaam er is | Domein, Resend (e-mail), Stripe-account | domein ~€ 15 per jaar, rest gratis |
| Bij livegang | Sendcloud (verzendlabels), cloud-opslag voor foto's | vanaf ~€ 45 per maand |
| Doorlopend, na livegang | Neon + Vercel + Resend + Sendcloud | ruwweg € 100 tot 150 per maand |

Dat is de hele infrastructuur. Geen serverbeheer, geen updates draaien, geen back-ups regelen: dat doen deze diensten voor je.

## De volgorde vanaf hier

1. **Blijven tweaken in de demo** tot de flows kloppen. Kost bijna niets, verandert alles.
2. **Demo-beslissingen overbouwen** naar `web/`: Engels, nieuwe filters, conditie in 5 niveaus, mega-menu, berichten, archief, routing, verkoopformulier. Dit is de grootste bouwronde en kan nu al beginnen.
3. **E-mail aanzetten** (Resend), plus e-mailverificatie en wachtwoord vergeten.
4. **Naar staging**: Neon-database, Vercel-hosting, foto's naar cloud-opslag. Vanaf dan kun je het platform vanaf je telefoon laten zien aan wie je maar wilt.
5. **Stripe aansluiten** zodra de merknaam en het KVK-account rond zijn: checkout, verkopersverificatie, uitbetalingen.
6. **Sendcloud aansluiten** voor echte verzendlabels en tracking.
7. **Launch-checklist** uit `PLANNING.md`: tests, beveiliging, juridische documenten, verzekering.

Stap 2 hoeft niet te wachten op iets of iemand. Dat is gewoon bouwen.
