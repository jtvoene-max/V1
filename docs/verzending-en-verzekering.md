# Verzending en verzekering

Onderzocht op 27 juli 2026. Dit is het onderwerp met het grootste onvoorziene risico in het hele project.

---

## De kern in één alinea

**Geen enkele gewone pakketvervoerder verzekert een designertas van € 25.000.** De praktische bovengrens bij standaarddiensten ligt tussen € 500 en € 5.000, en juist de categorie luxegoederen, sieraden en horloges staat bij vrijwel alle vervoerders op de uitsluitingslijst. Je besluit om op **€ 5.000 tot € 10.000** te gaan zitten in plaats van € 25.000 maakt dit probleem aanzienlijk beter hanteerbaar, maar het verdwijnt niet vanzelf.

---

## Wat de vervoerders werkelijk dekken

| Vervoerder | Maximum verzekerd | Belangrijke uitsluiting |
|---|---|---|
| **PostNL** particulier | € 500 | |
| **PostNL** zakelijk | **€ 5.000** per zending, in stappen van € 100/250/500 | **Sieraden en kostbaarheden** mogen niet mee met de gewone verzekerde dienst; daarvoor is Verzekerservice met Sealbag nodig. Uitkering boven de standaardlimiet alleen bij een acceptatiescan |
| **DHL eCommerce** zakelijk | **€ 100.000**, waarde zelf instelbaar | Geen uitsluiting van luxegoederen gevonden op de verzekeringspagina; **moet schriftelijk bevestigd worden** |
| **DHL Express** | tot € 500.000 internationaal, premie **1% met minimum € 10** | De Amerikaanse versie sluit sieraden expliciet uit tenzij schriftelijk toegestaan; de EU-lijst kon niet geverifieerd worden |
| **UPS** | **$ 500 voor juwelen en uurwerken**, $ 50.000 algemeen | Verboden: artikelen van ongewone waarde, kunst, antiek, unieke items. **Ongeschikt voor jouw segment** |
| **DPD** | € 520 standaard, verhoging per € 500, max 20 zendingen per maand | Uitsluitingslijst niet te verifiëren |
| **GLS** | € 750 | **Horloges, kunst, verzamelobjecten en antiek boven € 750 uitgesloten** |
| **Sendcloud Protection** | **€ 5.000** per zending | Sluit edelmetalen, edelstenen, antiek en kunst uit. Of handtassen eronder vallen is niet te verifiëren |

Zonder verzekering is de wettelijke aansprakelijkheid ongeveer **€ 3,40 per kilo** binnen Nederland. Een tas van anderhalve kilo levert dan € 5 op bij verlies.

Een praktijkvoorbeeld uit een horlogeforum: bij UPS werd voor een horloge van $ 900, netjes aangegeven als $ 900, **niets uitgekeerd** bij verlies, omdat het de limiet van $ 500 overschreed. UPS-support adviseerde zelf een andere vervoerder.

---

## Wat je prijsgrens verandert

Met een plafond van **€ 5.000 tot € 10.000** in plaats van € 25.000:

- **Onder € 5.000** kun je in principe uit de voeten met een verzekerd DHL-label, mits schriftelijk bevestigd is dat vintage tassen niet als uitgesloten kostbaarheid gelden
- **Tussen € 5.000 en € 10.000** heb je een aparte polis nodig, maar de premies zijn goed te overzien (zie hieronder)
- **Boven € 10.000** hoef je voorlopig niets te regelen, en dat scheelt de duurste en ingewikkeldste categorie

Het scheelt ook aan de betaalkant: bedragen tot € 10.000 vallen ruim onder het risicoprofiel waarbij Stripe reserves gaat opleggen. En bij je verzekering voor de opslag in het atelier is het verschil tussen "maximaal € 10.000 per stuk" en "maximaal € 25.000 per stuk" direct merkbaar in de premie.

**Advies: leg de grens vast op € 10.000** en bouw hem als harde controle in het verkoopformulier ("neem contact met ons op voor stukken boven € 10.000"). Dan kun je die uitzonderingen handmatig en verzekerd afhandelen in plaats van dat ze automatisch door je systeem glippen.

---

## De aanbevolen opzet

**Combineer drie dingen** in plaats van te vertrouwen op één partij:

**1. Sendcloud voor labels en tracking.** Het platform is goed: 160+ vervoerders, webhooks bij elke statuswijziging (met tien herhaalpogingen als jouw kant even niet reageert), een eigen trackingpagina in je huisstijl, en automatische meldingen per e-mail, sms en WhatsApp in meerdere talen. Precies wat je nodig hebt om koper en verkoper op de hoogte te houden.

**2. Je eigen DHL-contract, gekoppeld in Sendcloud.** Dit kan vanaf het Lite-pakket. Zo krijg je de verzekerde waarde van DHL eCommerce zakelijk (tot € 100.000 zelf instelbaar) in plaats van de € 5.000-limiet van Sendcloud, én je claim loopt rechtstreeks bij DHL in plaats van via een tussenlaag.

**3. Verzekering apart onderbrengen.** Sendcloud Protection stopt bij € 5.000 en sluit aangrenzende categorieën uit. Gespecialiseerde partijen dekken wel wat jij verzendt:

| Partij | Maximum | Premie |
|---|---|---|
| **Claisy** | € 100.000 | 0,6% van de waarde; bij € 8.000 is dat € 48 |
| **Secursus** | circa € 90.000 tot € 110.000 | 0,6% tot 1% | 
| **Goederentransportverzekering** via een makelaar | doorlopende polis op maat | afhankelijk van volume en waarde |
| **Malca-Amit / Brink's** | onbeperkt, gespecialiseerd in luxe | op aanvraag, alleen relevant bij uitzonderlijke stukken |

Bij een gemiddelde verkoop van € 3.500 kost de verzekering ongeveer € 21 per zending. Dat is te doen als je het doorberekent, en het is precies waarom je verzendkosten per been apart in het datamodel staan.

**Waarom Sendcloud niet alles:** de klachten over Sendcloud gaan bijna allemaal over claimafhandeling. Gebruikers melden maandenlange trajecten, alleen e-mailcontact, en verloren zendingen die uiteindelijk niet vergoed werden. Dat is precies de plek waar jij het niet wilt laten misgaan.

---

## Hoe de grote spelers het doen

Het patroon is overal hetzelfde en bevestigt onze aanpak:

- **Vestiaire Collective** routeert hoogwaardige items eerst naar een eigen authenticatiecentrum en daarna naar de koper. Boven $ 5.000 adviseren ze FedEx of UPS met volledige dekking in plaats van standaardpost
- **Chrono24** biedt escrow, maar **geen verzendverzekering voor particuliere verkopers**. Boven ongeveer € 100.000 verwijzen ze naar Malca-Amit
- **The RealReal** verzendt inclusief verzekering, met optionele extra dekking voor kopers
- **Catawiki** legt het risico volledig bij de verkoper

Geen van hen lost het op met de standaardverzekering van een vervoerder. Allemaal gebruiken ze een eigen hub plus een aparte polis. Dat is precies het model dat wij al hebben.

---

## Verplichte verzendinstellingen

Voor elk been van elke zending, zonder uitzondering:

- **Handtekening bij ontvangst.** Bij DHL zakelijk is dit standaard verplicht; bij PostNL zit het inbegrepen bij verhoogde aansprakelijkheid
- **Alleen huisadres.** Geen buren, geen afhaalpunt, geen pakketkluis
- **Aangegeven waarde gelijk aan de verkoopprijs.** Te laag opgeven om premie te besparen betekent dat je bij een claim niets krijgt

Zonder deze drie is een claim van duizenden euro's vrijwel kansloos.

## Levertijden binnen de EU vanuit Nederland

| Bestemming | PostNL | DHL |
|---|---|---|
| België | 1-2 werkdagen | 2 |
| Duitsland | 2-3 | 3 |
| Frankrijk | 2-4 | 4-5 |
| Italië | 3-5 | 5 |
| Spanje | 3-5 | 4 |

DHL Express levert doorgaans de volgende werkdag in de meeste EU-hoofdsteden. Binnen de EU zijn geen douanepapieren nodig.

Reken voor een order via het atelier dus op: verkoper naar atelier (1-3 dagen), expertise (1-2 dagen), atelier naar koper (1-3 dagen). Dat komt uit op de vijf tot zeven dagen die we in de demo communiceren, wat dus realistisch is.

---

## Wat jij moet uitzoeken, in volgorde

1. **Vraag PostNL en DHL schriftelijk** of vintage designertassen onder hun uitgesloten kostbaarheden vallen. Dit is de belangrijkste openstaande vraag van het hele project; als het antwoord "ja" is, verandert je hele verzendopzet. Doe dit per e-mail zodat je het zwart op wit hebt.
2. **Vraag een offerte bij DHL eCommerce zakelijk** voor een eigen contract, met de vraag of je de verzekerde waarde tot € 10.000 zelf mag instellen.
3. **Vraag offertes bij Claisy en bij een verzekeringsmakelaar** voor een doorlopende goederentransportverzekering, en vergelijk met per-zending-premies.
4. **Neem de opslag in het atelier mee** in die gesprekken. Dat is een aparte dekking en staat al langer open.
5. **Zet € 10.000 als harde grens** in het verkoopformulier zodra we dat overbouwen naar de echte app.

**Wat je nog niet moet doen:** iets over verzekering beloven in je algemene voorwaarden voordat punt 1 schriftelijk beantwoord is. Als een vervoerder bij een claim naar zijn uitsluitingsclausule wijst, sta jij voor de kosten.
