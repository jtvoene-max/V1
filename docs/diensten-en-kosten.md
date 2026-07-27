# Wat we moeten regelen, per fase, met kosten

Alle prijzen opgehaald van de officiële prijspagina's op 27 juli 2026, exclusief btw. Tarieven veranderen; controleer ze bij het aanmaken van elk account.

---

## Fase 1: nu meteen, om te kunnen bouwen

| Dienst | Wat het doet | Kosten |
|---|---|---|
| **GitHub** | Bewaart de code met volledige historie, zodat je nooit iets kwijtraakt en altijd terug kunt naar een werkende versie | **gratis** (privérepo) |
| **Dependabot** | Controleert dagelijks of er kwetsbaarheden in onze pakketten zitten en doet automatisch een voorstel tot bijwerken | **gratis** (zit bij GitHub) |
| **Neon** (database) | De database waar alle listings, orders, gebruikers en het papertrail in staan. PostgreSQL in de EU, met automatische back-ups | **gratis** om te beginnen: 0,5 GB opslag en 100 rekenuur per project |
| **Vercel** (hosting) | Draait de applicatie en zet elke wijziging automatisch live, met één klik terug naar de vorige versie | **gratis** op Hobby om te testen; Pro wordt pas nodig bij livegang |

**Totaal fase 1: € 0.** Alles wat nu gebouwd wordt kan hierop. Dependabot is op 27 juli 2026 al ingeschakeld.

---

## Fase 2: naar staging, zodat je het echt kunt laten zien

| Dienst | Wat het doet | Kosten |
|---|---|---|
| **Domein** | Je webadres. Koop het waar je wilt, wijs het via DNS naar Vercel | **€ 10 tot 20 per jaar** |
| **Cloudflare** (account) | Toegang tot Images en Turnstile hieronder. Je gebruikt Cloudflare níet als hosting | **gratis** |
| **Cloudflare Images** | Bewaart en levert alle productfoto's, en maakt automatisch de juiste maat per apparaat. Dit is de post die je bij Vercel honderden euro's zou kosten | **$ 5 per 100.000 foto's opslag per maand**, plus **$ 1 per 100.000 keer getoond**. Bij 10.000 listings met acht foto's: ruwweg **$ 10 tot 15 per maand** |
| **Resend** (e-mail) | Verstuurt alle automatische berichten: bestelling bevestigd, item ontvangen, expertise akkoord, uitbetaling onderweg | **gratis** tot 3.000 mails per maand (max 100 per dag); daarna **$ 20** voor 50.000 |
| **Clerk** (inloggen) | Registreren, inloggen, e-mailverificatie, wachtwoord vergeten, tweestapsverificatie en sessies. **Vervangt Auth.js**, zie de toelichting hieronder | **gratis** tot 50.000 actieve gebruikers; daarna **$ 25 per maand** |
| **Sentry** (foutmeldingen) | Waarschuwt je zodra er ergens een fout optreedt, met de pagina, de gebruiker en de regel code erbij. Anders hoor je storingen pas als een klant belt | **gratis** tot 5.000 fouten per maand; daarna **$ 26 per maand**. Kies bij aanmaken de **EU-regio (Frankfurt)**, want achteraf verhuizen kan niet |
| **Neon betaald** | Langere bewaartermijn voor back-ups, zodat je naar elk moment in de afgelopen dagen terug kunt in plaats van alleen naar gisteren | verbruiksafhankelijk: **$ 0,35 per GB** opslag, **$ 0,106 per rekenuur** |
| **Vercel Pro** | Nodig zodra het echt draait: eigen domein, meer rekenkracht, firewall en teamtoegang | **$ 20 per maand** per persoon met bewerkrechten. Kijkers zijn gratis |

**Totaal fase 2: ongeveer € 50 tot 60 per maand,** plus het domein per jaar.

### Waarom Clerk in plaats van Auth.js (het gratis alternatief)

Dit is de enige plek waar we bewust betalen voor iets dat ook gratis kan, en daar is een goede reden voor. Auth.js is **na jaren nog steeds beta**, en op **20 juli 2026 zijn er vier beveiligingsadviezen gepubliceerd, waarvan twee kritiek**. Eén daarvan is een inlog-omzeiling die *open faalt*: bij een configuratiefout wordt iedereen als ingelogd gezien, ook niet-ingelogde bezoekers. Wij stonden gelukkig al op de gepatchte versie, maar dit is het onderdeel waar je zoiets het minst wilt hebben.

Wat je voor die $ 25 krijgt: een commercieel product met SOC 2 Type 2-certificering, waar e-mailverificatie, wachtwoordherstel, tweestapsverificatie en bot-detectie standaard in zitten. Dat zijn drie stukken bouwwerk minder, en de aansprakelijkheid ligt bij hen in plaats van bij jou.

**Eén ding om bewust te beslissen:** Clerk heeft geen EU-datacenter, je gebruikersgegevens staan in de VS onder het EU-VS Data Privacy Framework. Juridisch in orde voor de AVG, maar als je per se data in de EU wilt houden, is **Better Auth** het alternatief (gratis, open source, sinds juli 2026 eigendom van Vercel). Dan blijf je wel zelf verantwoordelijk voor verificatie en tweestapsverificatie.

### Over die Vercel-sprong die je zag

Je zag € 20 en daarna Enterprise, en dat schrikt af. Het zit anders:

- **Boven Pro zit inderdaad geen tussenplan**, maar dat betekent niet dat je naar Enterprise moet. Pro groeit gewoon mee met verbruik.
- In Pro zit inbegrepen: **1 TB dataverkeer** en **10 miljoen aanvragen** per maand, plus **$ 20 aan tegoed** voor al het overige. Dat is voor een startende marktplaats ruim voldoende.
- Kom je erboven, dan betaal je bij: **$ 0,15 per GB** dataverkeer en **$ 2 per miljoen aanvragen**. Geen plafond, geen gedwongen upgrade.
- Enterprise koop je alleen voor zaken als SSO en contractuele garanties, niet omdat je te groot wordt.
- **Stel wel een uitgavenwaarschuwing in.** Vercel zet die standaard op $ 200 per maand; verlaag hem naar wat jij acceptabel vindt, dan krijg je bericht voordat het oploopt.

Dit is precies waarom de foto's naar Cloudflare gaan: die zijn verreweg de grootste verbruikspost, en daarmee blijf je op Vercel binnen het inbegrepen deel.

---

## Fase 3: kunnen verkopen

| Dienst | Wat het doet | Kosten |
|---|---|---|
| **Stripe** (betalingen) | Rekent af met kopers, houdt het geld vast tot levering, betaalt verkopers uit | **1,5% + € 0,25** per Europese kaart, **€ 0,29** per iDEAL-transactie. Geen abonnement |
| **Stripe Connect** | Verifieert wie je verkopers zijn (paspoort bij particulieren, KVK en UBO's bij bedrijven) en regelt de uitbetalingen | Twee modellen. Laat Stripe de tarieven bepalen: **geen extra kosten**. Bepaal je ze zelf: **€ 2 per maand per actief verkopersaccount** plus **0,25% + € 0,10 per uitbetaling** |
| **Stripe Radar** | Blokkeert frauduleuze betalingen en het testen van gestolen kaarten | **inbegrepen** bij standaardtarieven |
| **Cloudflare Turnstile** | Houdt bots weg bij registreren, inloggen en berichten. Vriendelijker dan een CAPTCHA | **gratis en onbeperkt** |

**Vaste kosten fase 3: € 0.** Je betaalt alleen per transactie, dus pas als er geld binnenkomt.

Rekenvoorbeeld bij een tas van € 5.800 met iDEAL: € 0,29 aan Stripe. Jouw commissie is € 580 plus de kopersfee. De betaalkosten zijn verwaarloosbaar; bij kaartbetaling is het € 87,25, nog altijd ruim onder je marge.

---

## Fase 4: verzenden

| Dienst | Wat het doet | Kosten |
|---|---|---|
| **Sendcloud** | Maakt verzendlabels voor alle drie de trajecten (verkoper naar atelier, atelier naar koper, retour), met tracking die de order automatisch bijwerkt | **gratis** pakket: onbeperkt zendingen tegen Sendcloud-tarieven, 1 gebruiker. **€ 35 per maand** (Lite) voor 400 labels en meerdere gebruikers. **€ 109** (Growth) voor 1.000 labels met retourportaal |
| **Verzendkosten zelf** | De daadwerkelijke pakketten | Per zending, doorberekend aan koper en verkoper |
| **Verzekering** | Dekking voor items die in het atelier liggen | Offerte opvragen; dit staat nog open |

**Advies:** begin op het **gratis pakket**. Stap naar Lite of Growth zodra je meer dan een handvol zendingen per week hebt of het retourportaal wilt.

---

## Fase 5: livegang

| Wat | Waarom | Kosten |
|---|---|---|
| **Jurist** | Algemene voorwaarden, consignatievoorwaarden, privacyverklaring | Eenmalig, afhankelijk van je jurist |
| **Boekhouder** | BTW-structuur, margeregeling, DAC7-rapportage | Eenmalig plus doorlopend |
| **Pentest** | Externe controle of niemand bij andermans gegevens kan | Eenmalig, honderden tot enkele duizenden euro's |
| **Authenticatiepartner** (optioneel) | LegitApp of Entrupy als steun bij twijfelgevallen | Per controle |

---

## Wat het per maand kost als het draait

| Dienst | Bij de start | Bij volume |
|---|---|---|
| Vercel Pro | $ 20 | $ 20 plus verbruik boven 1 TB |
| Neon | gratis, daarna verbruik | $ 0,35 per GB opslag, $ 0,106 per rekenuur |
| Cloudflare Images | $ 5 tot 10 | $ 15 tot 25 bij 10.000+ listings |
| Clerk (inloggen) | gratis tot 50.000 gebruikers | $ 25 |
| Sentry (foutmeldingen) | gratis tot 5.000 fouten | $ 26 |
| Resend | gratis | $ 20 boven 3.000 mails |
| Sendcloud | gratis | € 35 tot 109 |
| Turnstile, Dependabot, GitHub | gratis | gratis |
| Stripe | per transactie | per transactie |

**Bij de start: ongeveer € 25 tot 30 per maand** (Clerk en Sentry zitten dan nog in hun gratis bereik).
**Draaiend met 10.000 listings en echte handel: ongeveer € 150 tot 200 per maand.**

Ter vergelijking: één verkochte tas van € 3.000 levert je € 300 commissie op. Twee verkopen per maand dekt de hele infrastructuur voor een jaar.

### Wat de beveiligingskeuzes kosten

De stap van € 100-150 naar € 150-200 komt volledig door twee keuzes die je bewust maakt:

| Keuze | Kosten | Wat je ervoor krijgt |
|---|---|---|
| Clerk in plaats van Auth.js | $ 25 per maand | Geen betaversie met kritieke lekken onder je inlog, plus drie stukken bouwwerk minder (verificatie, wachtwoordherstel, tweestapsverificatie) |
| Sentry | $ 26 per maand | Je weet van een storing vóórdat een klant belt |
| Neon betaald | verbruik | Terug kunnen naar elk moment in de afgelopen dagen, niet alleen naar gisteren |

Bij items van € 25.000 en geld van derden op je platform is dat ongeveer vijftig euro per maand voor aanzienlijk minder risico. Mijn advies is het te doen.

---

## Wat jij moet aanmaken, en wanneer

| Wanneer | Account | Wat jij doet |
|---|---|---|
| Nu | GitHub, Neon, Vercel | Aanmaken en de inloggegevens delen; ik koppel alles |
| Naar staging | Clerk, Sentry | Aanmaken. **Bij Sentry meteen de EU-regio kiezen**, achteraf verhuizen kan niet |
| Zodra de merknaam er is | Domein, Cloudflare, Resend | Domein registreren, DNS-regels zetten (tien minuten) |
| Zodra KVK en merknaam rond zijn | Stripe | Bedrijfsgegevens invullen en verificatie doorlopen (dit kan dagen duren, begin op tijd) |
| Vóór de eerste verkoop | Sendcloud | Aanmaken en vervoerders kiezen |

Alles wat daarna komt is instellen en koppelen; dat doe ik.

**Eén ding dat alleen jij kunt doen:** zet **tweestapsverificatie aan op al deze accounts**. Vercel, Neon, Stripe, Cloudflare, GitHub, Clerk. Dat is de makkelijkste manier om alles kwijt te raken als je het niet doet, en het kost vijf minuten per account.
