# Proef Mercur op Medusa: bevindingen

Bijgewerkt tijdens de proef. Opstelling staat in `medusa-proef/` (staat bewust
niet in git: bevat een eigen `.env` met een databasesleutel).

## Opstelling

- Mercur 2.2.1 op Medusa 2.17.2
- Database: **een aparte lege database `medusa_proef` op de bestaande
  Neon-server**, los van `neondb`. De huidige data is niet aangeraakt
- Draait op Windows, zonder Docker en zonder Redis
- Backend op poort 9000, met beheerpaneel op `/dashboard` en verkoperspaneel
  op `/seller`

## Bevinding 1: het draait, met minder eromheen dan verwacht

| Onderdeel | Uitkomst |
|---|---|
| Installatie | gelukt, 1439 pakketten |
| Migraties tegen Neon | gelukt |
| Testdata | 3 verkopers, 244 aanbiedingen |
| `/health` | 200 |
| Beheerpaneel `/dashboard` | 200 |
| Verkoperspaneel `/seller` | 200 |

**Redis bleek niet nodig** om te draaien, ondanks dat de documentatie het als
vereiste noemt. Voor productie wel aan te raden, maar het is geen drempel om
te beginnen.

**Postgres bij Neon werkt gewoon.** Dat betekent dat de database in Frankfurt
kan blijven staan waar hij nu staat, inclusief de EU-datalocatie.

## Bevinding 2: correctie op mijn eerdere advies over uitbetalingen

Ik heb meermaals beweerd dat Mercur en Medusa de verkoper uitbetalen zodra hij
verzendt, en dat dat botst met ons model waarin pas na goedkeuring wordt
uitbetaald. **Dat klopt niet.** Nagekeken in de geïnstalleerde code:

- Er is een `createPayoutWorkflow`, maar **niets in Mercur roept die
  automatisch aan.** Geen enkele verwijzing buiten de workflow zelf
- Er is **geen map met geplande taken**
- Er is **geen enkele reactie op verzend- of afhandelingsgebeurtenissen**
- De beheerroutes voor uitbetalingen zijn **alleen opvragen**, geen aanmaken
- De enige automatische reactie is op `payout.webhook_received`, dus op een
  bericht van de betaalprovider achteraf

**Gevolg: wanneer er wordt uitbetaald bepalen wij zelf.** Uitbetalen na
goedkeuring door het atelier is dus geen gevecht met het framework, maar
gewoon die workflow aanroepen op ons eigen moment. Dat was mijn zwaarste
bezwaar en het houdt geen stand.

## Bevinding 3: Medusa Cloud is een bedoelde doelomgeving

De configuratie van Mercur noemt Medusa Cloud expliciet en bundelt de twee
dashboards voor omgevingen die alleen de server uitrollen. Draaien op Medusa
Cloud is dus voorzien en geen gok.

## Nog te onderzoeken

- **Het atelier als fase in de order.** Medusa's orderstatus is een vaste
  lijst. Kan een eigen fase ertussen, of moet dat via afhandeling en eigen
  velden? Dit is nu het enige zware punt dat nog open staat
- Uniek stuk: voorraad 1 met reservering bij afrekenen
- Onze eigen velden (conditie per zone, hardware, era) als eigen module
- Bruikbaarheid van het verkoperspaneel
- Papertrail: is er iets bruikbaars, of bouwen we dat opnieuw
