# Koppelingen met Shopify en andere marktplaatsen

Kan Still Iconic voorraad uitwisselen met Shopify, Vestiaire, eBay en
vergelijkbare kanalen? Ja. Maar de moeilijkheid zit niet in de koppeling zelf,
en dat is het belangrijkste van dit hele stuk.

## Het probleem dat je echt oplost

Bij een gewone webshop verkoop je twintig van hetzelfde shirt. Raakt de
voorraad op één kanaal een keer scheef, dan lever je een dag later.

Bij ons is elk stuk **één-van-één**. Staat dezelfde tas op Still Iconic én op
Shopify én op Vestiaire, en kopen twee mensen hem binnen dezelfde minuut, dan
heb je één tas en twee betalende klanten. Bij een tas van € 8.000 is dat geen
afrondingsfout maar een terugbetaling, een boze klant en een deuk in je naam.

**Dubbelverkoop is dus niet een risico van koppelen, het is hét risico.** Alles
hieronder is daaromheen gebouwd.

---

## Welke kant op, en wat er dan meekomt

### Naar binnen: voorraad ophalen uit een ander kanaal

Een dealer met 200 tassen in zijn Shopify gaat die niet met de hand overtikken.
Zonder import haal je die verkoper nooit binnen. Dit is de kant met de meeste
waarde, en het is ook de kant die je zelf het eerst kunt gebruiken.

Wat er mee kan komen: titel, beschrijving, foto's, prijs, en met wat geluk het
merk en model.

Wat er **niet** mee komt, en dat is het punt: onze conditie in vijf niveaus,
de slijtage per zone, hardware, materiaal, era, de acht vaste opnames. Die
velden bestaan in Shopify niet. Een geïmporteerde listing is dus standaard
mágerder dan een die hier is ingevoerd, terwijl juist die diepte je
onderscheidt van Vestiaire. Import zonder verrijkingsstap verwatert je eigen
aanbod.

**Conclusie:** importeren als concept, niet als publicatie. Wat binnenkomt komt
als concept in de verkoopflow, de verkoper vult de ontbrekende velden en de
foto's aan, en publiceert dan pas. Je bespaart het overtikken, niet de
kwaliteitscontrole.

### Naar buiten: onze listings elders tonen

Meer bereik, en in het begin heb je bereik nodig. Maar bedenk wat je koopt:
je betaalt hun commissie, de klant wordt hun klant, en je bouwt hun merk in
plaats van dat van jou. Voor een platform dat het van vertrouwen en herhaling
moet hebben is dat een dure manier van groeien.

**Advies:** hooguit als tijdelijke aanjager voor stukken die blijven liggen,
en dan met de afspraak dat ze bij ons als eerste weggaan.

### Orders en verzending terug

Verkoopt er iets op een ander kanaal, dan wil je dat hier weten: het stuk moet
op non-actief, en als het via jouw atelier loopt heb je de order nodig. Dit is
technisch het minste werk maar wel de kern van de dubbelverkoopbeveiliging.

---

## Hoe makkelijk is het per kanaal

| Kanaal | Toegang | Werk | Opmerking |
|---|---|---|---|
| **Shopify** | open, gedocumenteerd | **1 tot 2 weken** voor import, plus 2 tot 3 voor tweerichtingsverkeer | Admin API met webhooks op product, voorraad en order. Verreweg het makkelijkst |
| **eBay** | open | 2 tot 3 weken | Volwaardige verkoop-API, maar veel regels en categorie-eigenaardigheden |
| **Vestiaire, RealReal, Fashionphile** | **gesloten** | niet in te schatten | Geen openbare koppeling voor derden. Dit is geen programmeerklus maar een onderhandeling; je hebt een partnerafspraak nodig en die krijg je niet als beginnend concurrent |
| **Catawiki** | beperkt | onbekend | Werkt met eigen inbrengproces |

Voor de gesloten partijen bestaan tussenpartijen zoals **ChannelEngine**
(Nederlands) en **Channable**, die de koppelingen al hebben liggen. Je betaalt
dan een maandbedrag in plaats van bouwtijd. De moeite waard zodra je meer dan
twee kanalen wilt, niet daarvoor.

---

## Hoe we het zouden bouwen

Zelfde patroon als bij de foto-opslag in `web/src/lib/storage.ts` en zoals we
Stripe gaan doen: **één tussenlaag, per kanaal een aansluitstuk erachter.**
De rest van de app weet niet of iets uit Shopify of uit eBay komt.

Wat er in de database bij moet:

- Een `Channel`: welk kanaal, van welke verkoper, met de sleutels
- Een `ChannelListing`: welke listing hoort bij welk extern nummer, en wanneer
  is er voor het laatst gesynchroniseerd

Wat er in de code bij moet:

- Per kanaal een aansluitstuk met vier handelingen: haal op, publiceer,
  markeer als verkocht, haal binnengekomen orders op
- **Webhooks** voor directe meldingen (Shopify stuurt netjes)
- **Plus een controleronde**, bijvoorbeeld elk kwartier. Webhooks raken kwijt,
  en juist bij unieke stukken mag je daar niet blind op varen
- Elke synchronisatie in de papertrail, net als al het andere

## De regel die alles bij elkaar houdt

**Eén systeem is de baas over beschikbaarheid, en dat zijn wij.**

Zodra een stuk hier live staat, bepaalt Still Iconic of het te koop is. Wordt
het elders verkocht, dan zetten we het hier direct op non-actief. Wordt het
hier verkocht, dan halen we het overal weg vóórdat we de koper bevestigen.

De reservering die er al is (`reservedUntil` op een listing) is precies het
haakje: bij het afrekenen zetten we het stuk vast, trekken het van de andere
kanalen af, en pas dan gaat de betaling door.

En dan nog: een gelijktijdige koop op twee kanalen blijft mogelijk. Daar hoort
een uitgeschreven procedure bij, geen improvisatie. Wie krijgt hem, hoe snel
staat het geld terug bij de ander, en wat krijgt die persoon erbij. Dat hoort
in de voorwaarden en op de
[checklist voor de livegang](checklist-livegang.md).

---

## De omkering: laat hén op ons aansluiten

Hierboven staat dat Vestiaire, The RealReal en Fashionphile dicht zitten. Dat
is een nadeel, maar er zit een kans in die je makkelijk over het hoofd ziet.

**Precies omdat zij dicht zijn, is open zijn een wapen.**

Een dealer met 200 tassen zit vast aan het inbrengproces van die platformen:
handmatig, per stuk, in hún formulier. Iedereen in die markt klaagt daarover.
Ben jij de partij waar zijn voorraad in een middag in staat, dan kies je niet
op bereik maar op gemak, en gemak is het enige waarop een nieuwkomer kán
winnen. Bereik heb je nog niet.

Dit is bovendien de kant die aansluit op wat er al staat: de winkelpagina voor
zakelijke verkopers is er, de handelsgegevens staan erop, en het datamodel
maakt al onderscheid tussen particulier en zakelijk.

### Drie niveaus, van eenvoudig naar volledig

**1. Bestandsimport (spreadsheet).** Onderschat dit niet: veel handelaren in
vintage draaien op een spreadsheet, op Instagram-berichten en op hun geheugen.
Geen API, geen systeem. Een import waarbij ze hun eigen kolommen aanwijzen en
de foto's per stuk toevoegen, dekt het grootste deel van die groep.
*Werk: ongeveer een week. Bereikt de meeste verkopers.*

**2. Verkopers-API met een sleutel per winkel.** Voor de dealer die wél een
systeem heeft. Listing aanmaken en bijwerken, foto's toevoegen, verkocht
melden, en een webhook terug zodra er hier iets verkocht is. Dat laatste is
niet optioneel: zonder terugmelding krijg je precies de dubbelverkoop uit het
begin van dit document.
*Werk: twee tot drie weken, inclusief sleutelbeheer en limieten.*

**3. Een Shopify-app die ze installeren.** De koninklijke weg voor dealers die
op Shopify zitten. Zij klikken installeren, kiezen welke producten mee moeten,
en klaar. Bouwt voort op niveau 2.
*Werk: twee tot drie weken bovenop de API. Publiceren in de Shopify-winkel
vraagt een beoordeling door Shopify.*

### Wat dit oplevert dat een gewone koppeling niet doet

- Het is een **reden om voor jou te kiezen** die niets met traffic te maken
  heeft, en dat is precies wat je in jaar één mist
- Elke aangesloten dealer levert **voorraad**, en voorraad trekt kopers
- Het is **niet na te doen door de grote partijen** zonder hun eigen model om
  te gooien: die willen juist de controle over de inbreng houden

### Wat je erbij moet regelen

- **Elke sleutel is een deur.** Een sleutel per winkel, alleen rechten op de
  eigen listings, een limiet op het aantal verzoeken, en intrekbaar. Dit hoort
  bij de beveiligingsronde op de
  [checklist voor de livegang](checklist-livegang.md)
- **Kwaliteitsdrempel.** Wat via een koppeling binnenkomt is standaard te mager
  (zie hierboven). Ook hier: binnen als concept, publiceren pas nadat de
  ontbrekende velden en de acht opnames er zijn. Anders koop je voorraad met
  je eigen onderscheidend vermogen
- **Beschikbaarheid blijft van ons.** Zodra iets hier live staat, bepalen wij
  of het te koop is. De dealer meldt door wat hij elders verkoopt, wij melden
  terug wat hier verkoopt

## "Neem een standaard opensource platform, dat kan dit al"

Een terugkerend advies, en geen dom advies. Medusa, Saleor, Vendure en Mercur
hebben een plugin-ecosysteem waar koppelingen met Shopify en marktplaatsen al
in zitten. Bouwde je een gewone webshop met meerdere verkopers, dan zou dat
waarschijnlijk de juiste keuze zijn. Waarom het hier alsnog niet klopt:

**1. Die connectors lossen de makkelijke helft op.** Producten en voorraad heen
en weer sturen is het werk van een week, ook zelf. Wat geen enkele plugin voor
je oplost is de regel dat een stuk uniek is, dat een reservering over alle
kanalen tegelijk moet gelden, en dat het stuk bij niveau 2 en 3 eerst naar jouw
atelier gaat en pas daarna naar de koper. Dat is geen instelling maar je
bedrijfsmodel. Je zou de connector krijgen en de moeilijke helft alsnog zelf
bouwen, maar dan binnen de aannames van iemand anders.

**2. Uitbetalen botst nog steeds.** Die platformen betalen de verkoper uit
zodra hij verzendt. Bij ons gaat het geld pas naar de verkoper ná levering, en
bij een atelier-expertise pas na goedkeuring. Dat is precies de plek waar jouw
kopersbescherming zit, en precies de plek waar je tegen het framework in werkt.

**3. Wat je zou weggooien staat er al.** Modelpagina's, het verkocht-archief,
conditie per zone, de drie verificatieniveaus, het papertrail, de winkelpagina
met handelsgegevens. Dat opnieuw bouwen binnen andermans abstracties is
zelden minder werk dan het zelf houden; meestal meer.

**4. Je optimaliseert nu voor iets van later.** Koppelingen komen ná de
livegang. Je architectuur vandaag kiezen op een eis van over een jaar is de
verkeerde volgorde, zeker als die eis met een week werk alsnog te bouwen is.

### Wat er wél veranderd is sinds het eerdere advies

In [advies-mercur-mangopay.md](advies-mercur-mangopay.md) staat wanneer je dit
zou heroverwegen: *"als het atelier ooit optioneel wordt en verkopers standaard
zelf verzenden"*. Dat is sinds het besluit over de drie verificatieniveaus
gedeeltelijk gebeurd: bij niveau 1 verstuurt de verkoper rechtstreeks naar de
koper.

Eerlijk is eerlijk, die botsing is dus kleiner geworden. Maar hij is niet weg:
bij niveau 2 en 3 loopt het nog steeds via het atelier, en dát zijn de niveaus
met de marge en het onderscheidend vermogen. Een framework dat je op de
goedkoopste route helpt en op de waardevolste tegenwerkt, is geen winst.

### Wanneer ik van gedachten verander

Concreet, zodat je me eraan kunt houden:

- Als na een jaar blijkt dat verreweg de meeste kopers niveau 1 kiezen en het
  atelier een uitzondering is
- Als koppelingen met kanalen je belangrijkste groeikanaal blijken en niet je
  eigen aanbod
- Als je een team krijgt dat een standaard platform kan onderhouden en
  aanpassen, want dat is een vak apart

## Advies: wat wanneer

**Niet nu.** Voor de livegang heb je Stripe, de jurist, de verzekering en de
vervoerders nodig. Een koppeling die niets oplevert zolang er nog niet
afgerekend kan worden, hoort daar niet tussen.

**Eerste koppeling na de livegang: Shopify importeren, één richting.** En het
eerste kanaal dat je aansluit is je eigen Timeless Camelia-winkel. Dat is de
veiligste manier om het te leren: je kent de data, je kunt zelf opruimen als
het misgaat, en je vult je platform met echt aanbod in plaats van testdata.
Reken op een week of twee.

**Daarna pas beschikbaarheid in twee richtingen**, met webhooks en een
controleronde. Dat is de stap waar de dubbelverkoop-beveiliging in zit, en die
wil je rustig kunnen testen met eigen voorraad voordat er dealers op zitten.

**Externe marktplaatsen als laatste**, en waarschijnlijk via ChannelEngine in
plaats van zelf bouwen. Op dat moment is het een rekensom van commissie tegen
bereik, geen technische vraag meer.
