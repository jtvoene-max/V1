# Cloudflare, botbescherming en misbruik

Vraag: moeten we iets met Cloudflare voor hosting of botbescherming? Stand: 27 juli 2026.

## Kort antwoord

| Onderdeel | Advies |
|---|---|
| Cloudflare als hosting of proxy vóór Vercel | **Nee, niet doen** |
| Cloudflare als DNS-beheerder | Mag, maar zet de proxy uit (grijze wolk) |
| **Cloudflare voor de afbeeldingen** | **Ja, absoluut** (zie hieronder, dit is de grootste besparing) |
| Cloudflare Turnstile tegen bots op formulieren | **Ja, doen** (gratis, werkt ook zonder Cloudflare-hosting) |
| Vercel's eigen firewall en snelheidslimieten | **Ja, aanzetten** |
| Stripe Radar tegen betaalfraude | **Ja**, zit al bij Stripe inbegrepen |

Belangrijk om te weten: **Turnstile en Cloudflare Images werken los van je hosting.** Je hoeft je verkeer niet door Cloudflare te leiden om ze te gebruiken; de afbeeldingen komen gewoon van een eigen subdomein. Dat is precies de combinatie die je wilt: Vercel voor de applicatie, Cloudflare voor de beelden en de bots.

## Waarom geen Cloudflare vóór Vercel

Vercel heeft al een eigen wereldwijd netwerk dat je pagina's dicht bij de bezoeker serveert. Cloudflare daar nog eens voorzetten levert:

- **Dubbele caching**, waardoor je zelf niet meer weet welke versie een bezoeker ziet. Bij prijzen en voorraad is dat een reëel probleem: iemand koopt iets wat al verkocht is.
- **Extra vertraging** in plaats van minder, want het verkeer maakt een omweg.
- **Kapotte functies**: Vercel's previews, statistieken en firewall zien het echte IP-adres niet meer als Cloudflare ervoor staat.
- **Twee plekken om te debuggen** als er iets misgaat.

Voor AgriLearn is Cloudflare wél zinvol, want dat is een statische site op SiteGround zonder eigen randnetwerk. Andere situatie, ander antwoord.

**Uitzondering:** komt er later een piek die Vercel's rekening laat oplopen (bijvoorbeeld agressieve scrapers), dan kan Cloudflare ervoor als kostenrem. Dat is een probleem voor later, niet vooraf.

## De afbeeldingen: hier is Cloudflare wél het antwoord

Dit is de post die je het meeste geld kan kosten als je hem verkeerd inricht. Reken mee:

- 10.000 listings met acht verplichte foto's is **80.000 afbeeldingen**
- Foto's van een telefoon zijn 3 tot 8 MB per stuk, dus ruwweg **400 GB aan originelen**
- Elke bezoeker ziet die beelden in drie formaten: klein op de collectiepagina, groot op de detailpagina, en als miniatuur in de galerij

Als je dat door Vercel laat verwerken, betaal je per bewerking en per verstuurde byte. Bij dit volume loopt dat hard op: honderden euro's per maand is geen uitzondering, terwijl de site verder nauwelijks kost.

**Cloudflare Images doet hetzelfde voor een fractie:** ordegrootte enkele euro's per maand voor de opslag van 100.000 beelden, plus een paar euro voor de bezorging. Verifieer de actuele tarieven bij het aanmaken, maar de verhouding is niet subtiel: het scheelt een factor tien tot vijftig.

Wat je ervoor terugkrijgt:
- **Automatisch de juiste maat en het juiste formaat** (WebP of AVIF) per apparaat, uit één origineel. Jij uploadt één foto, Cloudflare levert de tien varianten.
- **Wereldwijd dichtbij de bezoeker**, wat bij een EU-brede marktplaats direct merkbaar is.
- **Geen kosten voor uitgaand verkeer**, waar de meeste opslagdiensten je juist daarop pakken.
- **Signed URLs** als je later beelden wilt afschermen, bijvoorbeeld inspectiefoto's die alleen koper en verkoper mogen zien.

Alternatief als je alles bij één partij wilt: **Cloudflare R2** voor de originelen plus Images voor de bewerking. Ook prima, iets meer werk om in te richten.

**Wat dit betekent voor de bouw:** de app slaat nu foto's lokaal op in `public/uploads`. Bij de stap naar staging vervang ik dat door uploads die rechtstreeks naar Cloudflare gaan, waarbij de database alleen nog de afbeelding-id bewaart. Dat is een halve dag werk, en dan is dit voor altijd geregeld, ook bij 100.000 stuks.

## Wat er wél nodig is, en waartegen

Een marktplaats met dure spullen trekt specifiek misbruik aan. Vijf soorten, met de bijbehorende maatregel:

### 1. Scrapers die je hele catalogus kopiëren
Concurrenten en prijsvergelijkers die elke listing binnenharken. Bij 10.000+ stukken is je collectie zelf waarde: je aanbod, je prijzen, je conditiegegevens.

**Maatregel:** Vercel's firewall met snelheidslimieten per IP op de collectiepagina's, plus een `robots.txt` die alleen echte zoekmachines toelaat. Bij aanhoudende overlast: Vercel Bot Management (zit bij Pro).

### 2. Nepaccounts en spamverkopers
Bots die accounts aanmaken om nep-listings te plaatsen of te phishen.

**Maatregel:** Turnstile op het registratieformulier, plus e-mailverificatie (staat al op de lijst) en Stripe's identiteitscontrole voordat iemand kan uitbetalen. Die drie samen maken massaal misbruik onbetaalbaar.

### 3. Inbraakpogingen op accounts
Geautomatiseerd wachtwoorden proberen met gelekte lijsten van elders.

**Maatregel:** Turnstile op de inlogpagina, een limiet op mislukte pogingen per account en per IP, en tweestapsverificatie voor jou en je team.

### 4. Kaartjes testen bij de checkout (carding)
Fraudeurs gebruiken je betaalpagina om gestolen kaartnummers te testen met kleine bedragen. Kost je chargeback-kosten en beschadigt je reputatie bij Stripe.

**Maatregel:** **Stripe Radar** doet dit voor je, standaard inbegrepen. Aanvullend: alleen ingelogde gebruikers laten afrekenen, wat bij ons toch al zo is omdat er een adres en order aan hangt.

### 5. Spam in berichten en biedingen
Nepbiedingen om verkopers te bereiken, of links in berichten.

**Maatregel:** limiet op het aantal biedingen per dag (Vinted doet 25, wij kunnen lager), Turnstile bij het eerste bericht van een nieuwe gebruiker, en een filter dat externe links en betaalverzoeken blokkeert. Dat laatste beschermt tegelijk tegen de klassieke oplichting: "betaal me buiten het platform om".

## Concreet plan, en wanneer

**Bij de stap naar staging** (blok B in de planning):
1. Domein-DNS bij Cloudflare of Vercel, proxy uit
2. **Cloudflare Images aansluiten** en de foto-upload omzetten van lokale opslag naar Cloudflare
3. Vercel firewall aan met snelheidslimieten
4. `robots.txt` met alleen echte zoekmachines

**Vóór livegang:**
5. Turnstile op registratie, inloggen, wachtwoord vergeten en het eerste bericht
6. Limiet op mislukte inlogpogingen, met tijdelijke blokkade
7. Limiet op biedingen per gebruiker per dag
8. Linkfilter in berichten, met de waarschuwing die al in de demo staat
9. Tweestapsverificatie voor team- en adminaccounts
10. Stripe Radar-regels controleren en aanscherpen

**Kosten:** Turnstile is gratis en onbeperkt. Cloudflare Images kost enkele euro's per maand en bespaart er honderden. Vercel's firewall zit bij het Pro-abonnement dat je toch nodig hebt. Stripe Radar zit bij de standaardtarieven.

## Wat jij moet doen

Eén gratis Cloudflare-account aanmaken; daar komen zowel Turnstile als Images uit. Voor Images kun je meteen beginnen zodra het account er is; Turnstile heeft je definitieve domein nodig. Al het andere regel ik in de code of in de instellingen van Vercel.
