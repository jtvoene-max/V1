# Wat we van Chrono24 kunnen leren

Aanvulling op [onderzoek-concullegas.md](onderzoek-concullegas.md). Dat stuk ging
over mode-platformen (Vestiaire, Fashionphile, Rebag, RealReal). Chrono24 zit in
een andere categorie, horloges, en juist daarom staan er dingen in die geen van
die mode-partijen doet.

Waarom het overdraagbaar is: Chrono24 verkoopt schaarse, unieke, duurzame
tweedehands luxe waar echtheid het hele koopbesluit bepaalt. Dat is precies onze
situatie. Kleding is vervangbaar en modegevoelig; een Classic Flap en een
Submariner niet.

---

## Les 1: een echte modelpagina, niet alleen een filter

**Wat zij doen.** Bij Chrono24 draait alles om het referentienummer. Elke
advertentie hangt onder een vaste modelpagina met de specificaties, het
prijsbereik, de geschiedenis en alle exemplaren die nu te koop staan. De
advertentie is de losse voorraad; de modelpagina is het naslagwerk.

**Waarom dat werkt.** Een koper die "Classic Flap Medium" intikt wil eerst weten
wat dat *is* en wat het waard is, en pas daarna welke er nu liggen. Bij ons is
model nu alleen een filter: je krijgt een lijst, geen antwoord.

**Bij ons.** Een pagina per model, bijvoorbeeld `/model/classic-flap-medium`,
met: wat het model is en sinds wanneer, de gangbare maten en materialen, waar je
op let bij echtheid, het huidige prijsbereik bij ons, en de exemplaren die nu te
koop staan. Chanel heeft geen officieel referentiesysteem, maar er is een
feitelijk systeem: model plus maat plus materiaal plus hardware plus serie-era.

Dit is tegelijk je sterkste zoekmachine-troef. Mensen zoeken op modelnamen, niet
op "vintage tas kopen".

## Les 2: prijsdata is de echte slotgracht

**Wat zij doen.** Chrono24 publiceert een prijsindex per referentie: wat is het
verloop, wat is de gangbare marktprijs, staat deze advertentie daarboven of
daaronder. Dat is de reden dat mensen er komen kijken zonder te willen kopen.

**Waarom dat werkt.** "Wat is mijn tas waard?" is de meestgestelde vraag in deze
markt, van zowel kopers als verkopers. Wie dat antwoord bezit, is de
standaardbestemming. En het is verdedigbaar: die data heeft niemand anders die
zich alleen op Chanel richt.

**Bij ons.** Op termijn een prijsoverzicht per model, opgebouwd uit onze eigen
verkopen. Dat kan pas als er volume is, dus dit is geen bouwpunt voor nu.

**Maar één ding moet wél nu**, en dat is de reden dat deze les hier staat: je
kunt geen geschiedenis maken van gegevens die je niet hebt bewaard. Zie het
laatste blok van dit stuk.

## Les 3: bewaarde zoekopdrachten met bericht

**Wat zij doen.** Je legt vast waar je naar zoekt en krijgt bericht als er iets
verschijnt dat past.

**Waarom dat werkt.** Bij unieke voorraad vindt vrijwel niemand zijn stuk op de
eerste dag. Zonder iets dat hen terugroept, komen ze niet terug. Bij ons is elk
stuk één-van-één, dus dit geldt hier nog sterker dan bij horloges, waar van
dezelfde referentie tientallen exemplaren liggen.

**Bij ons.** De filters staan er al. Een bewaarde zoekopdracht is niets anders
dan die filters opslaan bij een gebruiker, plus een bericht bij een nieuwe
listing die eraan voldoet. Dit is de goedkoopste functie met de grootste
opbrengst uit dit hele stuk.

## Les 4: de verkoper is een zichtbare partij

**Wat zij doen.** Elke verkoper heeft een profiel: hoe lang actief, hoeveel
verkocht, beoordelingen, land, hoe snel er geantwoord wordt. Bij particuliere
verkopers is dat het enige waar een koper zich aan vast kan houden.

**Bij ons.** We hebben `accountType` (particulier of zakelijk) en dat staat op de
listing, maar er is geen verkoperspagina. Die zou moeten bestaan met: sinds
wanneer actief, aantal verkochte stukken, of het atelier alles heeft goedgekeurd,
en de andere stukken die deze verkoper nu aanbiedt.

Let op: bij een particulier is dat een privacy-afweging. Geen achternaam, geen
woonplaats, wel een staat van dienst.

## Les 5: trust is een product met een naam

**Wat zij doen.** Hun afhandeling met borg heet "Trusted Checkout" en heeft een
eigen uitlegpagina en een eigen keurmerk. Het is geen voetnoot in de
voorwaarden; het is waar ze op adverteren.

**Bij ons.** Ons atelier *is* het product, maar het heeft nog geen naam en geen
eigen pagina. De drie niveaus staan al in het onderzoek (fotocontrole,
atelier-expertise, Entrupy-certificaat). Wat ontbreekt is de pagina die het
uitlegt, met foto's van het atelier en de mensen die het doen, en een keurmerk
dat op elke listing terugkomt.

## Les 6: totaalprijs per land, vooraf

**Wat zij doen.** Verzendkosten, invoerrechten en btw zitten in het bedrag dat je
ziet, afhankelijk van waar je zit.

**Waarom dat werkt.** Verrassingen bij de afrekenpagina zijn de grootste
afhaakoorzaak bij grensoverschrijdende luxe.

**Bij ons.** Direct relevant voor de EU-ambitie en het sluit aan op
[btw-funnel.md](btw-funnel.md). Bij de checkout-milestone meenemen, niet eerder.

---

## Wat we níet moeten overnemen

- **De dichtheid.** Chrono24 staat vol met tientallen bijna identieke
  advertenties van dezelfde referentie, met een prijzenslag tussen dealers. Dat
  werkt daar omdat horloges in series bestaan. Bij ons is elk stuk uniek, en
  die drukke opzet vloekt met de maison-uitstraling.
- **Verkoper verstuurt zelf.** Hun borgconstructie gaat ervan uit dat de dealer
  rechtstreeks naar de koper verstuurt. Dat botst met consignatie, waar het stuk
  fysiek langs ons gaat. Dezelfde denkfout zat in het Mercur-advies, zie
  [advies-mercur-mangopay.md](advies-mercur-mangopay.md).
- **Dealers boven particulieren.** Chrono24 is in de praktijk een dealerplatform.
  Wij willen alle vier de handelsvormen, dus onze verkoperspagina moet ook een
  particulier met drie verkopen geloofwaardig kunnen maken.

---

## Advies: wat eerst

1. **Bewaarde zoekopdracht met bericht.** Weinig werk, direct effect, en het
   werkt beter naarmate je voorraad schaarser is.
2. **Modelpagina's.** Zoekmachine-opbrengst en het geeft een koper eindelijk een
   antwoord in plaats van een lijst.
3. **Verkoperspagina.** Nodig zodra er echte particuliere verkopers komen.
4. **Expertisepagina met keurmerk.** Stond al op de lijst uit de demo.
5. **Prijsoverzicht per model.** Pas bij volume, maar zie hieronder.

## Het enige dat nu moet: verkoopdata vastleggen

De prijsindex is later te bouwen, de data ervoor niet later te verzamelen.

Onze `Order` legt de bedragen al vast op het moment van koop, los van de
listing, en dat is precies goed. Wat nog niet vastligt is *wat* er verkocht is:
model, materiaal, hardware, conditie en productiejaar staan alleen op de
listing, en die kan na de verkoop nog gewijzigd worden.

Voor een betrouwbaar prijsoverzicht wil je die kenmerken bevroren hebben op het
moment van verkoop, net als de bedragen. Dat is een kleine uitbreiding van het
datamodel en kost nu niets. Doen we het niet, dan is de geschiedenis over twee
jaar onbruikbaar en valt les 2 definitief af.

Zelfde patroon als bij de DAC7-rapportage in de
[checklist voor de livegang](checklist-livegang.md): bewaren vanaf dag één,
anders is het achteraf niet meer op te bouwen.
