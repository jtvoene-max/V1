# Stap voor stap online zetten

Geschreven voor iemand die dit voor het eerst doet. Volg het in deze volgorde; elke stap bouwt op de vorige.

Je hebt Vercel al op Hobby staan en aan GitHub gekoppeld. Mooi. Nu de rest.

---

## Stap 1: de code naar GitHub

De code staat nu alleen op jouw computer. Die moet naar GitHub, want daar haalt Vercel hem vandaan.

**1a. Maak een lege repository aan op GitHub**

Ga naar [github.com/new](https://github.com/new) en vul in:

- **Repository name**: `still-iconic`
- **Private** aanvinken (niet Public, je code moet privé blijven)
- **Voeg NIETS toe**: geen README, geen .gitignore, geen licentie. Die vinkjes moeten uit staan, anders botst het met wat je al hebt

Klik op **Create repository**. Je krijgt daarna een pagina met commando's; die heb je niet nodig, ik geef ze hieronder.

**1b. Koppel je computer aan die repository**

Kopieer eerst het adres van je nieuwe repository. Dat ziet er zo uit: `https://github.com/JOUWNAAM/still-iconic.git`

Dan in de terminal (vervang JOUWNAAM door je eigen GitHub-gebruikersnaam):

```bash
cd C:\Users\Marko\Desktop\Timeless-marketplace
git remote add origin https://github.com/JOUWNAAM/still-iconic.git
git push -u origin main
```

De eerste keer vraagt Git om in te loggen bij GitHub. Er opent een venster; log in en geef toestemming.

**Klaar als:** je de repository ververst op GitHub en je bestanden ziet staan.

---

## Stap 2: de database aanmaken (Neon)

De applicatie heeft een database nodig. Zonder dat draait de site wel, maar zie je geen listings.

1. Ga naar [neon.com](https://neon.com) en maak een account (gratis, kan met je GitHub-account)
2. Klik **Create project**
3. Vul in:
   - **Project name**: `still-iconic`
   - **Postgres version**: laat staan op de standaard
   - **Region**: kies **Europe (Frankfurt)**. Belangrijk voor de AVG, en achteraf verhuizen kan niet
4. Klik **Create**

Je krijgt nu een **connection string** te zien, iets als:

```
postgresql://neondb_owner:AbC123xyz@ep-koel-water-123456.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

**Kopieer die en bewaar hem even.** Je hebt hem zo nodig. Behandel hem als een wachtwoord: dit geeft volledige toegang tot je database.

---

## Stap 3: het project in Vercel zetten

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Je ziet je GitHub-repositories staan. Klik **Import** bij `still-iconic`
3. Nu het belangrijkste scherm. Vul in:

**Root Directory**: klik op **Edit** en kies de map `web`.
Dit is de stap die mensen vergeten. Onze applicatie staat niet in de hoofdmap maar in `web/`, en zonder dit vindt Vercel niets.

**Framework Preset**: moet automatisch op **Next.js** springen zodra je `web` kiest.

**Environment Variables**: klap dit open en voeg drie regels toe:

| Name | Value |
|---|---|
| `DATABASE_URL` | de connection string van Neon uit stap 2 |
| `AUTH_SECRET` | zie hieronder |
| `AUTH_TRUST_HOST` | `true` |

Voor `AUTH_SECRET` heb je een lange willekeurige tekst nodig. Draai dit in de terminal en kopieer wat eruit komt:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

4. Klik **Deploy**

Vercel gaat nu bouwen. Dat duurt twee tot drie minuten. Je ziet de voortgang meelopen.

**Klaar als:** je een felicitatiescherm krijgt met een adres als `still-iconic.vercel.app`.

---

## Stap 4: de database vullen

De site staat online, maar de database is nog leeg. We moeten de tabellen aanmaken en er testdata in zetten.

Open de terminal en zet tijdelijk de Neon-verbinding klaar (vervang de tekst tussen aanhalingstekens door jouw connection string):

```bash
cd C:\Users\Marko\Desktop\Timeless-marketplace\web
$env:DATABASE_URL="postgresql://...jouw-neon-string..."
npx prisma db push
npx tsx prisma/seed.ts
```

Dat maakt alle tabellen aan en vult ze met 550 testlistings en de testaccounts.

**Klaar als:** je site ververst en de collectie ziet staan.

---

## Stap 5: controleren of alles werkt

Ga naar je Vercel-adres en loop dit lijstje langs:

- [ ] De collectie toont listings met foto's
- [ ] Zoeken en filteren werkt
- [ ] Een listing openen werkt
- [ ] Inloggen met `team@test.local` en wachtwoord `Test1234!` werkt
- [ ] Het atelier is bereikbaar als je als team bent ingelogd
- [ ] Uitloggen werkt

Werkt er iets niet, dan staat in Vercel onder **Deployments → je laatste deploy → Runtime Logs** precies wat er misging. Stuur me die melding en ik los het op.

---

## Wat je vanaf nu gratis krijgt

Elke keer dat er iets aan de code verandert en dat naar GitHub gaat, zet Vercel automatisch een nieuwe versie live. Gaat er iets mis, dan klik je in Vercel op een oudere deploy en kies je **Promote to Production**: binnen tien seconden staat de vorige werkende versie er weer.

---

## Belangrijk om te weten

**Dit is nog niet je echte site.** Het adres eindigt op `.vercel.app` en er staat testdata in. Zet er nog geen echte klanten op. Het doel van deze stap is dat je het platform vanaf je telefoon aan iedereen kunt laten zien.

**Zet tweestapsverificatie aan** op je GitHub-, Vercel- en Neon-account. Doe dat nu meteen, het kost vijf minuten per account en het is de makkelijkste manier om alles te verliezen als je het niet doet.

**Foto's zijn nog tijdelijk.** Uploads worden nu op de server opgeslagen, en die wordt bij elke nieuwe deploy leeggemaakt. Dat lossen we op met Cloudflare Images, maar dat kan later.

---

## Als er iets misgaat

| Foutmelding | Wat het betekent | Oplossing |
|---|---|---|
| `No Next.js version detected` | Root Directory staat niet op `web` | Vercel → Settings → General → Root Directory → `web` |
| `Environment variable not found: DATABASE_URL` | De variabele ontbreekt of heeft een typefout | Vercel → Settings → Environment Variables, controleer de naam exact |
| `Can't reach database server` | De connection string klopt niet, of mist `?sslmode=require` aan het eind | Kopieer hem opnieuw uit Neon |
| Site laadt, maar geen listings | De database is nog leeg | Stap 4 uitvoeren |
| `MissingSecret` | `AUTH_SECRET` ontbreekt | Toevoegen en opnieuw deployen |

Na het wijzigen van een variabele moet je opnieuw deployen: **Deployments → de bovenste → drie puntjes → Redeploy**.
