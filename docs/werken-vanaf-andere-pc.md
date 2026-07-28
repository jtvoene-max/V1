# Werken op twee computers

## Google Drive: niet doen

Begrijpelijke gedachte, maar bij code werkt het averechts. Drie redenen:

1. **Drive synchroniseert continu op de achtergrond.** Terwijl jij of ik een bestand aan het bewerken zijn, kan Drive er middenin springen. Dat levert half opgeslagen bestanden en conflictkopieën op ("bestand (1).tsx"), en die breken de applicatie.
2. **De map `node_modules` bevat tienduizenden bestanden.** Drive wordt daar traag van, en die bestanden horen sowieso niet gesynchroniseerd te worden: ze worden per computer opnieuw geïnstalleerd.
3. **Je hebt geen geschiedenis.** Gaat er iets stuk, dan kun je niet terug naar een werkende versie.

**Git doet precies wat je wilt, en beter.** Dat is er letterlijk voor gemaakt: code delen tussen computers, met volledige historie en de mogelijkheid om altijd terug te gaan. Je code staat al veilig op GitHub; je hoeft er alleen op die tweede pc bij te komen.

## Hoe het werkt met twee computers

Denk aan GitHub als de waarheid, en aan je computers als werkplekken die daarmee bijpraten:

**Begin van een werksessie** (op welke pc dan ook):

```bash
git pull
```

Dat haalt op wat er op de andere computer is gedaan.

**Einde van een werksessie:**

```bash
git push
```

Dat zet jouw werk erop, zodat de andere computer het kan ophalen. Ik doe dit trouwens automatisch na elke wijziging, dus in de praktijk hoef je alleen `git pull` te onthouden.

**De enige regel:** werk niet op beide computers tegelijk aan hetzelfde. Sluit af met een push, begin met een pull.

## Eenmalige installatie op de tweede pc

### Stap 1: de drie programma's

Open PowerShell (Windows-toets, typ `powershell`, Enter) en plak:

```bash
winget install --id Git.Git -e; winget install --id OpenJS.NodeJS.LTS -e
```

**Sluit PowerShell daarna helemaal af en open hem opnieuw.** Zonder dat kent Windows de nieuwe programma's niet, en dat is waar bijna iedereen op vastloopt.

Controleren of het gelukt is:

```bash
git --version; node --version
```

Twee versienummers betekent goed. Claude Code installeer je zoals op je andere pc.

### Stap 2: het project ophalen

```bash
cd $HOME\Desktop; git clone https://github.com/jtvoene-max/V1.git Still-Iconic; cd Still-Iconic\web; npm install
```

Bij het klonen opent een GitHub-venster: kies **Sign in with your browser** en log in als **jtvoene-max**. De installatie daarna duurt een paar minuten.

### Stap 3: het sleutelbestand

De sleutels staan bewust niet in GitHub (dat zou onveilig zijn). Maak ze aan met dit commando; je hoeft alleen de waarden in te vullen die je in Vercel vindt onder **je project → Settings → Environment Variables** (klik op het oogje om ze te tonen):

```bash
notepad .env
```

Notepad vraagt of je het bestand wilt aanmaken: ja. Plak dit erin en vul de waarden aan:

```
DATABASE_URL="hier de waarde uit Vercel"
AUTH_SECRET="hier de waarde uit Vercel"
AUTH_TRUST_HOST="true"
```

Opslaan en sluiten.

### Stap 4: draaien

```bash
npm run dev
```

De site staat dan op `http://localhost:3000`.

## Let op: één database

Beide computers gebruiken dezelfde database in Frankfurt, dezelfde als de live site. Wat je op de ene pc in de data verandert, zie je dus overal. Voor testdata is dat prima; zeg het als je liever een aparte oefendatabase wilt.

---

# De starttekst voor een nieuwe sessie

Alles hieronder kopiëren en plakken als eerste bericht in Claude Code op de andere computer:

---

Ik werk aan **Still Iconic**, een marketplace voor vintage Chanel met fysieke authenticatie. Het project staat in deze map en de volledige geschiedenis zit in git.

**Achtergrond**: ik ben ondernemer, geen programmeur. Leg dingen uit in gewone taal en zonder jargon. Ik beslis en test, jij bouwt en verifieert. Schrijf in het Nederlands tegen mij, maar de site zelf is Engelstalig.

**Waar we staan:**
- De echte app draait live op https://v1-tc-f383.vercel.app (Vercel Hobby, team tc-f383)
- Code op GitHub: jtvoene-max/V1, database bij Neon in Frankfurt
- Apart account voor dit project: jtvoene@gmail.com, bewust gescheiden van mijn AgriLearn-projecten
- Elke push naar GitHub zet automatisch een nieuwe versie live

**Al gebouwd in de echte app:** collectie met zoeken en filteren op categorie, conditie, kleur, materiaal, hardware, era, verkoperstype en prijs; mega-menu per categorie; productpagina met conditierapport per zone; verkoopflow in vijf stappen met foto-upload; atelier-dashboard met orderverwerking; papertrail met CSV-export; mijn account; installeerbare webapp. Alles Engelstalig.

**Lees eerst deze bestanden:**
- `CLAUDE.md` — de stackafspraken en werkwijze
- `docs/PLANNING.md` — de planning met milestones
- `docs/demo.html` — de klikbare demo met alle ontwerpbeslissingen (open in een browser)
- `docs/onderzoek-concullegas.md` — concurrentieonderzoek en de gekozen filterset
- `docs/verzending-en-verzekering.md`, `docs/btw-funnel.md`, `docs/veiligheid-en-stabiliteit.md`, `docs/diensten-en-kosten.md`

**Belangrijk verschil:** `docs/demo.html` is een schets met verzonnen data waarin we ontwerpbeslissingen namen. `web/` is de echte applicatie. Een deel uit de demo moet nog worden overgebouwd.

**Wat nog uit de demo moet komen:** verificatie gekozen door de koper bij het afrekenen (fotocontrole / atelier / Entrupy voor tassen), wishlist, berichten, archief van verkochte stukken, expertise- en verkooppagina, atelier als fasenbord met tracking, rapportage, en het verkoopformulier uitbreiden naar acht foto's.

**Werkwijze die ik prettig vind:** bouw het, test het zelf in de browser, commit en push zodat het live komt. Ik hoef niets in de terminal te doen. Vertel me daarna kort wat er veranderd is en wat ik moet controleren.

Begin met `git pull` en kijk even rond in de map, dan zeg je waar we gebleven waren.
