import "dotenv/config";
import { defineConfig } from "prisma/config";

// De shadow-database is alleen nodig voor migraties op de eigen computer.
// Op Vercel bestaat die variabele niet, dus daar laten we hem weg in plaats
// van hem verplicht te stellen (anders faalt `prisma generate` bij het bouwen).
const shadow = process.env.SHADOW_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "",
    ...(shadow ? { shadowDatabaseUrl: shadow } : {}),
  },
});
