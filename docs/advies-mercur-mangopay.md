# Advies: Mercur en MangoPay

Getipt door een adviseur, onderzocht op 27 juli 2026. Kort antwoord: **MangoPay is een serieuze tip die je moet onthouden, Mercur is dat voor jouw model niet.**

---

## Mercur: niet doen

Mercur is een open-source marketplace-framework op MedusaJS, gemaakt door het Poolse bureau Rigby. Het is echt en het leeft (v2.2 in juli 2026, maandelijkse releases, MIT-licentie, gratis). Je krijgt er veel voor: verkopers-onboarding, commissieregels, split payments, vendor-dashboard, reviews, wishlist, zoeken.

**Waarom het toch niet past, drie redenen van zwaar naar licht:**

**1. De kernaanname botst frontaal met jouw model.** Mercur en Medusa gaan ervan uit dat de verkoper rechtstreeks aan de koper levert en dat jij de goederen nooit aanraakt. De hele orderafhandeling en de uitbetalingsjob zijn daarop gebouwd: uitbetalen gebeurt zodra de verkoper verzendt. Bij Still Iconic is het tegenovergestelde juist het punt: het stuk gaat fysiek naar jouw atelier, wordt gekeurd, en pas daarna door naar de koper, met uitbetaling ná goedkeuring. Je zou tegen het framework in werken op precies de plek waar je waarde zit.

**2. Je houdt je eigen statusflow toch.** Medusa's orderstatussen zijn vaste, niet-uitbreidbare waarden. Onze twaalf statussen met inspectie en retour passen daar niet in, dus die zouden náást de Medusa-statussen komen te staan. Dubbele boekhouding op de belangrijkste entiteit van het platform. Hetzelfde geldt voor het papertrail, dat Mercur simpelweg niet heeft.

**3. Wat je wint weegt niet op tegen de herbouw.** Je zou vendor-panel, commissie-engine en reviews overnemen, maar de uitbetalingsflow alsnog moeten herschrijven. Daar staat tegenover dat gebruikers, listings, orders, verzendingen, inspectierapporten, uitbetalingen en het papertrail al werken en precies passen.

**Los daarvan, drie waarschuwingen:** het project draait feitelijk op één hoofdontwikkelaar (636 van de commits), er stond eind januari 2026 een week lang kwaadaardige code in de admin-repository (pas half februari gemeld), en er staan drie openstaande beveiligingswaarschuwingen in een vastgezette dependency. Voor een platform waar geld en goederen van derden doorheen gaan telt dat zwaar.

**Wat wél verstandig is:** gebruik Mercur als ontwerpreferentie. Vier ideeën zijn het overnemen waard: één centrale goedkeuringswachtrij voor alles wat het team moet beoordelen (past perfect bij het atelier), verkopers-onboarding in expliciete stappen met een afvinkbare voortgang, commissieregels per categorie in plaats van één vast percentage, en verplichte velden per categorie zodat vintage-listings altijd compleet zijn.

**Wanneer je dit heroverweegt:** als het atelier ooit optioneel wordt en verkopers standaard zelf verzenden. Dan verdwijnt de botsing.

---

## MangoPay: goede tip, maar niet nu

MangoPay is een Luxemburgse e-money-instelling uit 2013, specifiek gebouwd voor marktplaatsen. **Vinted gebruikt het inderdaad**, al ruim tien jaar, en heeft het contract in mei 2026 verlengd. Elke gebruiker krijgt een e-wallet; geld gaat van betaling naar wallet, tussen wallets, en dan naar de bank.

### Het argument dat níet klopt

Vaak wordt gezegd: MangoPay omdat je geld langer moet vasthouden. Klopt technisch (MangoPay heeft geen tijdslimiet), maar Stripe mag fondsen tot **90 dagen** vasthouden bij handmatige uitbetaling. Onze keuring duurt vijf tot veertien dagen. Dat past ruimschoots. Dit is dus geen reden om over te stappen.

### De argumenten die wél kloppen

1. **Jouw vier handelsvormen.** Stripe Connect is gebouwd rond het idee dat een gekoppeld account de ontvanger van een betaling is. MangoPay's wallets zijn richtingsonafhankelijk: geld kan naar elke geverifieerde wallet, ongeacht wie koper of verkoper is. Voor C2B en B2B is dat structureel beter.
2. **Bedragen tot € 25.000 met particuliere verkopers.** Precies het profiel waarbij Stripe's risicoafdeling reserves oplegt of accounts beperkt. **Chrono24** (luxe horloges, vaak boven € 25.000, met een controlepunt onderweg) draait op MangoPay. Dat is functioneel bijna jouw model, en het sterkste signaal uit het hele onderzoek.
3. **De juridische positie van het geld.** Bij consignatie wil je kunnen aantonen dat het geld van de verkoper is en nooit van jou. Bij MangoPay staat het als afgescheiden e-geld in diens wallet; bij Stripe passeert het jouw platformsaldo. Boekhoudkundig en juridisch schoner, en het raakt direct de bemiddelaarsstatus uit het BTW-document.

### De argumenten tegen, nu

- **Geen prijstransparantie.** Tarieven zijn volledig op aanvraag, er is geen gratis instap en geen self-service. Je kunt je marges niet doorrekenen zonder salestraject, en met nul volume sta je zwak in die onderhandeling.
- **Verplicht contract en compliance-traject** voordat je überhaupt live kunt.
- **Implementatie duurt gemiddeld vier maanden** (volgens gebruikersreviews), tegenover dagen bij Stripe.
- **KYC-frictie bij verkopers**, en die is net aangescherpt: sinds 1 juli 2026 moet een verkoper in de EU in beginsel geverifieerd zijn vóórdat er geld naar zijn wallet mag. Er is een gedocumenteerd geval waarin deze frictie de verkoper-onboarding aantoonbaar deed dalen.

### Advies: Stripe nu, MangoPay bewust voorbereiden

1. **Bouw met Stripe Connect.** Je bent in dagen live, tegen bekende tarieven, zonder contract. Snelheid naar je eerste echte transactie is nu meer waard dan structurele elegantie.
2. **Zet de betaallaag achter een eigen abstractie.** De rest van de app praat nooit rechtstreeks met Stripe, maar met onze eigen begrippen: saldo, vasthouden, vrijgeven, uitbetalen. Dan kost overstappen later weken in plaats van een kwartaal. Dit kost nu nauwelijks extra werk en is sowieso beter.
3. **Voer nu al het gesprek met MangoPay-sales**, puur om tarieven en verplichtingen boven tafel te krijgen. Die informatie is gratis en je hebt hem nodig voor je model.
4. **Spreek de kantelpunten vooraf af.** Overstappen wordt logisch zodra C2B of B2B echt volume krijgt, zodra Stripe reserves oplegt vanwege je bedragen, of zodra je maandvolume groot genoeg is voor een serieuze offerte.

---

## Complete software- en kostenlijst

Alles wat we nodig hebben of overwogen, met de rol en de kosten. Prijzen van de officiële pagina's op 27 juli 2026, exclusief btw.

### Wat we gebruiken

| Software | Rol in het platform | Kosten start | Kosten bij volume |
|---|---|---|---|
| **Next.js + React** | De applicatie zelf: alle pagina's, het atelier, de accounts | gratis (open source) | gratis |
| **Prisma + PostgreSQL** | Datamodel en database-toegang | gratis | gratis |
| **GitHub** | Codeopslag met volledige historie | gratis | gratis |
| **Vercel** | Hosting, automatische deploys, staging per wijziging | gratis (Hobby) | $ 20 per maand, plus verbruik boven 1 TB en 10 miljoen aanvragen |
| **Neon** | De database in de cloud, EU-servers, back-ups | gratis (0,5 GB) | $ 0,35 per GB opslag, $ 0,106 per rekenuur |
| **Cloudflare Images** | Opslag en bezorging van alle productfoto's, automatisch juiste maat | $ 5 per 100.000 foto's | $ 10 tot 25 per maand bij 10.000 listings |
| **Cloudflare Turnstile** | Bots weren bij registreren, inloggen en berichten | gratis | gratis, onbeperkt |
| **Resend** | Alle automatische e-mails per statusovergang | gratis (3.000/maand) | $ 20 voor 50.000 |
| **Stripe** | Betalingen: kaarten, iDEAL, Bancontact, SEPA | geen abonnement | 1,5% + € 0,25 per kaart, € 0,29 per iDEAL |
| **Stripe Connect** | Verificatie van verkopers en uitbetalingen | geen vaste kosten | € 2 per maand per actief verkopersaccount, plus 0,25% + € 0,10 per uitbetaling |
| **Stripe Radar** | Fraudedetectie, blokkeert het testen van gestolen kaarten | inbegrepen | inbegrepen |
| **Sendcloud** | Verzendlabels voor alle drie de trajecten, met tracking | gratis pakket | € 35 (400 labels) tot € 109 (1.000 labels) |
| **Auth.js** | Inloggen, registreren, sessies | gratis (open source) | gratis |
| **Domein** | Je webadres | € 10 tot 20 per jaar | idem |

**Bij de start: ongeveer € 25 tot 30 per maand. Draaiend met 10.000 listings: ongeveer € 100 tot 150 per maand.**

### Wat we onderzocht en niet nemen

| Software | Wat het zou doen | Waarom niet | Kosten |
|---|---|---|---|
| **Mercur** | Kant-en-klaar marketplace-framework | Botst met het consignatiemodel; we hebben al werkende code die beter past | gratis, maar hoge herbouwkosten |
| **MangoPay** | Betalingen met e-wallets per gebruiker | Later heroverwegen; nu te traag en geen prijszekerheid | op aanvraag |
| **SiteGround** | Hosting | Geen omgeving voor server-side applicaties; prima voor je andere sites | n.v.t. |
| **Cloudflare als proxy** | CDN vóór de site | Dubbele caching gevaarlijk bij prijzen en voorraad | n.v.t. |
| **Sharetribe, CS-Cart** | Marketplace-platformen uit het eerdere stackonderzoek | Zelfde bezwaar als Mercur: de trust-laag moet je toch zelf bouwen | $ 299 tot $ 3.599 per jaar |

### Nog te onderzoeken

| Wat | Waarvoor | Wanneer |
|---|---|---|
| **Entrupy** | Machinale authenticatie van tassen, als premium-optie bij de checkout | Kosten opvragen (abonnement plus apparatuur) vóór je het aanbiedt |
| **Verzekering** | Dekking voor items die in het atelier liggen | Offertes opvragen, staat al open |
| **Pentest** | Externe beveiligingscontrole vóór livegang | Inplannen, honderden tot enkele duizenden euro's |

### Eenmalige kosten buiten software

| Wat | Waarom |
|---|---|
| Jurist | Algemene voorwaarden, consignatievoorwaarden, privacyverklaring |
| Boekhouder | BTW-structuur, margeregeling, DAC7 |
| Merkregistratie | Naam vastleggen in de EU |

---

## Samengevat

Je adviseur zit goed op MangoPay: het is echt de betaalpartner voor EU-marktplaatsen, Vinted en Chrono24 gebruiken het, en op termijn past het beter bij consignatie en bij vier handelsvormen. Maar met nul volume, geen prijstransparantie en vier maanden implementatie is het nu het verkeerde moment. Bouw met Stripe, achter een eigen abstractielaag, en houd de deur open.

Op Mercur zou ik niet ingaan. Het is goed gemaakt, maar voor een ander model dan het jouwe, en je hebt al werkende code die precies past.
