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
