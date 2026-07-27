# Still Iconic

Marketplace voor vintage Chanel met fysieke authenticatie: items gaan via het atelier, worden gekeurd en daarna doorgestuurd naar de koper.

## Structuur

- `web/` — de applicatie (Next.js, Prisma, PostgreSQL)
- `docs/` — planning, onderzoek, kostenoverzichten en de klikbare demo

## Lokaal draaien

```bash
cd web
npm install
npx prisma dev --name timeless    # lokale database, laat dit venster open
npx prisma db push                # tabellen aanmaken
npx tsx prisma/seed.ts            # testdata
npm run dev
```

Testaccounts (wachtwoord `Test1234!`): `admin@test.local`, `team@test.local`, `koper@test.local`, `verkoper@test.local`, `zakelijk@test.local`.

## Documentatie

| Bestand | Waarover |
|---|---|
| `docs/PLANNING.md` | De complete planning met milestones |
| `docs/demo.html` | Klikbare demo van alle flows |
| `docs/onderzoek-concullegas.md` | Concurrentieonderzoek en de gekozen filterset |
| `docs/diensten-en-kosten.md` | Alle diensten met rol en kosten per fase |
| `docs/veiligheid-en-stabiliteit.md` | De acht beveiligingslagen |
| `docs/verzending-en-verzekering.md` | Verzendopzet en het verzekeringsknelpunt |
| `docs/btw-funnel.md` | BTW-structuur en margeregeling |
