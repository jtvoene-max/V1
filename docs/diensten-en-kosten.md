# Wat we moeten regelen, per fase, met kosten

Alle prijzen opgehaald van de officiële prijspagina's op 27 juli 2026, exclusief btw. Tarieven veranderen; controleer ze bij het aanmaken van elk account.

---

## Fase 1: nu meteen, om te kunnen bouwen

| Dienst | Wat het doet | Kosten |
|---|---|---|
| **GitHub** | Bewaart de code met volledige historie, zodat je nooit iets kwijtraakt en altijd terug kunt naar een werkende versie | **gratis** (privérepo) |
| **Neon** (database) | De database waar alle listings, orders, gebruikers en het papertrail in staan. PostgreSQL in de EU, met automatische back-ups | **gratis** om te beginnen: 0,5 GB opslag en 100 rekenuur per project |
| **Vercel** (hosting) | Draait de applicatie en zet elke wijziging automatisch live, met één klik terug naar de vorige versie | **gratis** op Hobby om te testen; Pro wordt pas nodig bij livegang |

**Totaal fase 1: € 0.** Alles wat nu gebouwd wordt kan hierop.

---

## Fase 2: naar staging, zodat je het echt kunt laten zien

| Dienst | Wat het doet | Kosten |
|---|---|---|
| **Domein** | Je webadres. Koop het waar je wilt, wijs het via DNS naar Vercel | **€ 10 tot 20 per jaar** |
| **Cloudflare** (account) | Toegang tot Images en Turnstile hieronder. Je gebruikt Cloudflare níet als hosting | **gratis** |
| **Cloudflare Images** | Bewaart en levert alle productfoto's, en maakt automatisch de juiste maat per apparaat. Dit is de post die je bij Vercel honderden euro's zou kosten | **$ 5 per 100.000 foto's opslag per maand**, plus **$ 1 per 100.000 keer getoond**. Bij 10.000 listings met acht foto's: ruwweg **$ 10 tot 15 per maand** |
| **Resend** (e-mail) | Verstuurt alle automatische berichten: bestelling bevestigd, item ontvangen, expertise akkoord, uitbetaling onderweg | **gratis** tot 3.000 mails per maand (max 100 per dag); daarna **$ 20** voor 50.000 |
| **Vercel Pro** | Nodig zodra het echt draait: eigen domein, meer rekenkracht, firewall en teamtoegang | **$ 20 per maand** per persoon met bewerkrechten. Kijkers zijn gratis |

**Totaal fase 2: ongeveer € 35 tot 40 per maand,** plus het domein per jaar.

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
| Resend | gratis | $ 20 boven 3.000 mails |
| Sendcloud | gratis | € 35 tot 109 |
| Turnstile | gratis | gratis |
| Stripe | per transactie | per transactie |

**Bij de start: ongeveer € 25 tot 30 per maand.**
**Draaiend met 10.000 listings en echte handel: ongeveer € 100 tot 150 per maand.**

Ter vergelijking: één verkochte tas van € 3.000 levert je € 300 commissie op. Twee verkopen per maand dekt de hele infrastructuur voor een jaar.

---

## Wat jij moet aanmaken, en wanneer

| Wanneer | Account | Wat jij doet |
|---|---|---|
| Nu | GitHub, Neon, Vercel | Aanmaken en de inloggegevens delen; ik koppel alles |
| Zodra de merknaam er is | Domein, Cloudflare, Resend | Domein registreren, DNS-regels zetten (tien minuten) |
| Zodra KVK en merknaam rond zijn | Stripe | Bedrijfsgegevens invullen en verificatie doorlopen (dit kan dagen duren, begin op tijd) |
| Vóór de eerste verkoop | Sendcloud | Aanmaken en vervoerders kiezen |

Alles wat daarna komt is instellen en koppelen; dat doe ik.
