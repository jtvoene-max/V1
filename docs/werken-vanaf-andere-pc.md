# Werken vanaf een andere computer

Kopieer de tekst onderaan dit bestand als eerste bericht in een nieuwe Claude Code-sessie. Daarmee weet ik direct waar we staan.

## Wat je eerst op die computer installeert

1. **Git** — [git-scm.com/download/win](https://git-scm.com/download/win), alles op de standaardinstellingen laten staan
2. **Node.js LTS** — [nodejs.org](https://nodejs.org), de linkerknop met "LTS"
3. **Claude Code** — zoals je hem hier ook hebt

## Het project ophalen

Open PowerShell en plak dit (pas het pad aan als je hem ergens anders wilt):

```bash
cd C:\Users\JOUWNAAM\Desktop; git clone https://github.com/jtvoene-max/V1.git Still-Iconic; cd Still-Iconic\web; npm install
```

Bij de eerste keer vraagt GitHub om in te loggen; kies "Sign in with your browser" en log in als **jtvoene-max**.

## Het instellingenbestand

De sleutels staan bewust niet in GitHub. Maak in de map `web` een bestand `.env` met deze inhoud:

```
DATABASE_URL="postgresql://neondb_owner:...@ep-frosty-unit-asy52045.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="..."
AUTH_TRUST_HOST="true"
```

De juiste waarden vind je in Vercel: **je project → Settings → Environment Variables**, en dan bij elke regel op het oogje klikken om hem te tonen.

## Klaar

```bash
npm run dev
```

Daarna staat de site op `http://localhost:3000`.

Let op: dit gebruikt dezelfde database als de live site. Wat je lokaal aanpast in de data, verandert dus ook online. Wil je dat niet, zeg het dan, dan zet ik een aparte testdatabase op.

---

# De starttekst voor een nieuwe sessie

Alles hieronder kopiëren en plakken als eerste bericht:

---

Ik werk aan **Still Iconic**, een marketplace voor vintage Chanel met fysieke authenticatie. Het project staat in deze map en de volledige geschiedenis zit in git.

**Achtergrond**: ik ben ondernemer, geen programmeur. Leg dingen uit in gewone taal en zonder jargon. Ik beslis en test, jij bouwt en verifieert. Schrijf in het Nederlands tegen mij, maar de site zelf is Engelstalig.

**Waar we staan (27 juli 2026):**
- De echte app draait live op https://v1-tc-f383.vercel.app (Vercel Hobby, team tc-f383)
- Code op GitHub: jtvoene-max/V1, database bij Neon in Frankfurt
- Apart account voor dit project: jtvoene@gmail.com, bewust gescheiden van mijn AgriLearn-projecten
- Elke push naar GitHub zet automatisch een nieuwe versie live

**Lees eerst deze bestanden, dan weet je alles:**
- `CLAUDE.md` — de stackafspraken en werkwijze
- `docs/PLANNING.md` — de planning met milestones
- `docs/demo.html` — de klikbare demo waarin alle ontwerpbeslissingen staan (open in een browser)
- `docs/onderzoek-concullegas.md` — concurrentieonderzoek en de gekozen filterset
- `docs/verzending-en-verzekering.md`, `docs/btw-funnel.md`, `docs/veiligheid-en-stabiliteit.md`, `docs/diensten-en-kosten.md`

**Belangrijk verschil om te snappen:** `docs/demo.html` is een schets met verzonnen data waarin we ontwerpbeslissingen hebben genomen. `web/` is de echte applicatie. Veel uit de demo moet nog naar de echte app worden overgebouwd.

**Wat er nog uit de demo overgebouwd moet worden:**
mega-menu met categorieën, filters op kleur/materiaal/hardware/era, conditie in 5 niveaus met slijtage per zone, verificatie gekozen door de koper bij het afrekenen (fotocontrole / atelier / Entrupy voor tassen), wishlist, berichten, archief van verkochte stukken, expertise- en verkooppagina, atelier als fasenbord met tracking, rapportage, en het uitgebreide verkoopformulier met acht foto's.

**Werkwijze die ik prettig vind:** bouw het, test het zelf in de browser, commit en push zodat het live komt. Ik hoef niets in de terminal te doen. Vertel me daarna kort wat er veranderd is en wat ik moet controleren.

Kijk even rond in de map en zeg waar we gebleven waren.
