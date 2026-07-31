# Checklist livegang

Eén lijst met alles dat waar moet zijn vóór de eerste echte klant. Niet vóór
de technische livegang, maar vóór het moment dat er andermans tas van
€ 8.000 in jouw atelier ligt en er geld overheen gaat.

Per punt staat wie het doet:
**[ik]** bouw ik, **[jij]** doe jij, **[pro]** hier heb je een jurist,
boekhouder of verzekeraar voor nodig.

Losse punten zijn goedkoop nu en duur later. Het gaat vooral om de blokken 2
tot en met 5: die kosten geen code, maar wel doorlooptijd.

---

## 1. Techniek en veiligheid

Uitgewerkt in [veiligheid-en-stabiliteit.md](veiligheid-en-stabiliteit.md) en
[cloudflare-en-beveiliging.md](cloudflare-en-beveiliging.md). Hier de poort:

- [ ] **[jij] NU: repo op privé zetten.** GitHub → Settings → General →
      Change repository visibility. De repo staat openbaar, en in
      `prisma/seed.ts` staat het testwachtwoord met `admin@test.local` erbij.
      Omdat test en live dezelfde database delen, werken die accounts op de
      live site. Er staat alleen testdata in, dus de schade is nu beperkt,
      maar dit moet dicht vóór er iets echts in komt.
- [ ] **[ik]** Geen werkende testaccounts meer in de database die live
      bedient. Vervalt vanzelf zodra de ontwikkeldatabase losstaat.
- [ ] **[ik]** Inloggen van Auth.js naar Clerk of Better Auth. Auth.js staat na
      jaren nog in beta en had in juli 2026 twee kritieke lekken, waarvan één
      die open faalt.
- [ ] **[ik]** Ontwikkeldatabase losknippen van live (Neon-branch `dev`). Nu
      delen beide werkcomputers en de live site één database, en het
      seed-script begint met alles wissen.
- [ ] **[jij]** Neon op een betaald plan, zodat je terug kunt naar elk moment
      van de afgelopen dagen. Bij items van duizenden euro's is dat geen luxe.
- [ ] **[jij]** Sentry aanmaken **met EU-regio**, dat kan achteraf niet meer
      verhuisd worden. Plus een uptime-monitor.
- [ ] **[ik]** Turnstile bij registreren en inloggen, limiet op mislukte
      inlogpogingen, limiet op biedingen per dag, linkfilter in berichten.
- [ ] **[ik]** Tweestapsverificatie verplicht voor atelier- en beheeraccounts.
      Wie daar binnenkomt, kan orders en uitbetalingen sturen.
- [ ] **[ik+jij]** Alle wachtwoorden en sleutels vernieuwen. De huidige
      `AUTH_SECRET` en de databasesleutel zijn tijdens het bouwen over chats en
      computers heen gegaan. Prima voor testdata, niet voor echte data.
- [ ] **[ik]** End-to-end tests op de vier kritieke flows: afrekenen,
      inspectie, retour, uitbetaling. Zodat een wijziging nooit stil iets sloopt.
- [ ] **[pro]** Pentest door iemand van buiten.

---

## 2. Juridisch

Dit blok is het grootste risico en kost de meeste doorlooptijd. Een jurist met
ervaring in e-commerce en platformen, niet je huisadvocaat.

- [ ] **[pro]** Merkenrecht rond Chanel. **Lees dit punt echt.** Doorverkoop
      van echte tweedehands Chanel mag in de EU, dat heet uitputting van het
      merkrecht. Maar er zitten harde grenzen aan hoe je de merknaam gebruikt
      in je domein, je advertenties en je vormgeving, en aan de suggestie dat
      je iets met het merk te maken hebt. Chanel procedeert hier actief tegen
      wederverkopers, ook over de vraag of je jezelf "geauthenticeerd" mag
      noemen. Leg je opzet vóór livegang voor aan een merkenrechtjurist.
- [ ] **[pro]** Wat beloof je precies met authenticatie, en wat als je een keer
      fout zit? Dit moet in je voorwaarden staan, inclusief wat de koper dan
      krijgt. Zonder die regeling is dit een open eind.
- [ ] **[pro]** Algemene voorwaarden in drie lagen: platform, verkoper, koper.
      Met daarin de consignatie: het item is fysiek bij jou, maar van wie is
      het onderweg, en wie draagt het risico wanneer.
- [ ] **[pro]** Privacyverklaring en AVG-register. Verwerkersovereenkomsten met
      Vercel, Neon, Stripe, Sendcloud, Clerk en Sentry.
- [ ] **[ik]** Cookie- en toestemmingsbanner, alleen als er tracking bij komt.
- [ ] **[ik]** Herroepingsrecht van 14 dagen zichtbaar bij zakelijke
      verkopers, en zichtbaar afwezig bij particuliere. Staat al in het model,
      moet in de flow bevestigd worden.
- [ ] **[pro]** Digital Services Act. Als marketplace heb je een meldpunt, een
      klachtenprocedure en een geschillenregeling nodig, en je moet zakelijke
      verkopers natrekken en hun gegevens tonen. Dat laatste raakt de code.
- [ ] **[ik]** Wettelijk verplichte gegevens op de site: bedrijfsnaam,
      vestigingsadres, KVK-nummer, BTW-nummer, contactgegevens.

---

## 3. Fiscaal

- [ ] **[pro]** Margeregeling: hoe boek je die, en hoe zichtbaar maak je hem op
      de factuur. Uitgewerkt in [btw-funnel.md](btw-funnel.md), maar de
      boekhouder moet er ja tegen zeggen.
- [ ] **[pro]** BTW bij verkoop naar andere EU-landen, en of je de
      One Stop Shop-regeling nodig hebt.
- [ ] **[ik]** Facturen: jouw fee aan koper en verkoper, en de factuur van een
      zakelijke verkoper aan de koper. Twee verschillende stromen.
- [ ] **[ik+pro]** DAC7-rapportage over particuliere verkopers boven 30
      transacties of € 2.000 per jaar. Je moet de gegevens vanaf dag één
      bewaren, anders kun je het achteraf niet meer opbouwen.

---

## 4. Verzekering en logistiek

Hier zit het gat dat we eerder vonden, uitgewerkt in
[verzending-en-verzekering.md](verzending-en-verzekering.md).

- [ ] **[jij]** Schriftelijke bevestiging van PostNL en DHL of vintage
      designertassen onder hun uitgesloten kostbaarheden vallen. Mondeling
      is waardeloos als er iets zoekraakt.
- [ ] **[pro]** Verzekering voor goederen van derden in jouw pand. Je
      inboedelverzekering dekt dit vrijwel zeker niet. Dit is een aparte polis
      en je hebt hem nodig vóór het eerste item binnenkomt.
- [ ] **[pro]** Transportverzekering voor de waarde die je echt verstuurt.
- [ ] **[jij]** Schriftelijk vastleggen wat er gebeurt als een item zoekraakt,
      beschadigt of afgekeurd wordt. Wie betaalt de retour, binnen hoeveel
      dagen, en tegen welke waarde.
- [ ] **[jij]** Fysieke beveiliging van het atelier: kluis, alarm, en wie er
      toegang heeft.

---

## 5. Operationeel

- [ ] **[jij]** Wat gebeurt er als jij ziek bent of op vakantie? Nu ben jij de
      enige die kan authenticeren. Twee weken stilstand met items van klanten
      in huis is geen optie. Regel een tweede paar handen of een expliciete
      pauzestand op het platform.
- [ ] **[jij]** Klantenservice: waar komt het binnen, hoe snel antwoord je, wie
      antwoordt er.
- [ ] **[jij]** Wat doe je als er een namaakstuk binnenkomt? De verkoper
      informeren, terugsturen, of aangifte. Schrijf het op vóór het gebeurt,
      niet erna.
- [ ] **[ik]** Testronde met een echt item van begin tot eind, met echt geld,
      voordat de site open gaat.

---

## 6. Inhoud en vertrouwen

- [ ] **[jij]** Echte foto's van het atelier en van jezelf. Bij luxe
      tweedehands koopt men de persoon die het nakijkt.
- [ ] **[ik]** Alle testdata eruit. Geen verzonnen listings, geen verzonnen
      verkopers, geen verzonnen reviews.
- [ ] **[ik]** Pagina die uitlegt hoe de authenticatie werkt, stap voor stap.
      Dat is je hele verkoopargument.
- [ ] **[jij]** Alle Engelse teksten laten nalezen door iemand die het als
      moedertaal spreekt. Je richt je op de hele EU.

---

## Wat dit betekent voor de planning

De code is het kortste pad. Blok 1 en 6 kan ik bouwen. Blok 2 tot en met 5
kosten weinig geld maar wel wachttijd: een jurist, een verzekeraar en een
boekhouder werken niet in dagen.

**Begin daarom nu alvast met drie dingen, terwijl ik doorbouw:** de
merkenrechtvraag rond Chanel, de verzekering voor goederen van derden, en de
schriftelijke bevestiging van de vervoerders. Dat zijn de drie die de livegang
kunnen tegenhouden en waar jij niets aan kunt versnellen zodra ze lopen.
