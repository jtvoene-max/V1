# Timeless Marketplace

Marketplace voor vintage Chanel met fysieke authenticatie: items gaan via het platform (verkoper stuurt in, team inspecteert, platform stuurt door naar koper). Alle vier handelsvormen (C2C/B2C/C2B/B2B) via één `accountType`-veld (PRIVATE/BUSINESS) op elke gebruiker. Ambitie: grootste vintage-Chanel-marketplace van de EU.

## Structuur

- `docs/PLANNING.md` — de complete planning met milestones en definities van "af". Volg deze.
- `docs/bouwplan.md` — het architectuurdocument (van Claude.ai; toevoegen zodra gedownload).
- `web/` — de Next.js-app (App Router, TypeScript, Tailwind, src-dir).

## Stack en afspraken

- Next.js 16 (App Router) + Prisma 7 + PostgreSQL. Client gegenereerd naar `web/src/generated/prisma` (staat in .gitignore; herstel met `npx prisma generate`).
- Prisma 7: connectie-URL's staan in `web/prisma.config.ts` + `web/.env`, NIET in schema.prisma. PrismaClient vereist de PrismaPg-adapter (zie `web/src/lib/prisma.ts`).
- Lokale database: `npx prisma dev --name timeless` (WASM-Postgres, geen Docker). Poort 51214, shadow 51215.
  - Let op: `prisma migrate dev` werkt NIET tegen deze lokale server (P1017). Gebruik `npx prisma db push` lokaal. Migratie-historie starten we zodra er een echte cloud-Postgres (Neon/Supabase) is.
  - Verbindings-URL's zonder extra parameters houden (alleen `sslmode=disable`); de lange parameterreeks die `prisma dev` toont breekt de schema-engine.
- Seed: `npx tsx prisma/seed.ts` (of `npx prisma db seed`). 550 listings, 40 gebruikers, 32 orders door de hele flow. Testaccounts (wachtwoord `Test1234!`): admin@test.local, team@test.local, koper@test.local, verkoper@test.local, zakelijk@test.local.
- Auth: Auth.js v5 (next-auth@beta), credentials + JWT-sessies. Sessie bevat `user.id`, `user.role`, `user.accountType`.
- Bedragen altijd in centen (Int), prijzen in EUR. Bedragen op een Order zijn vastgelegd op koopmoment, nooit herleiden uit de listing.
- Elke listing is een uniek item: geen stock-veld, dubbele verkoop voorkomen via `reservedUntil` + status RESERVED.
- Elke orderstatus-overgang krijgt een OrderEvent (audit-log).
- Dev-server via de preview-tool met configuratie `timeless-web` (poort 3000).

## Regels

- Geen em-dashes in user-facing content; gewoon duidelijke taal (NL eerst, EN volgt).
- Sandbox-modus voor alles (Stripe, Sendcloud) tot de launch-checklist in docs/PLANNING.md.
- Na elke werkende stap committen.
- Zelf testen na elke wijziging: typecheck (`npx tsc --noEmit`) en de flow doorlopen in de preview.
