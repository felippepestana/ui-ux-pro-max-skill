#!/usr/bin/env node
/**
 * scripts/check-backend.mjs
 *
 * Diagnoses the backend wiring before you run migrations.
 * Run with: `npm run backend:check`
 *
 * Reports:
 *  - Which env vars are present
 *  - Whether Prisma can reach the DATABASE_URL (pooled)
 *  - Whether Prisma can reach the DIRECT_URL (direct, for migrations)
 *  - Whether Supabase Auth endpoint is reachable
 */

import { config } from "node:process";
import { setTimeout as wait } from "node:timers/promises";

const dotenv = await import("@next/env").then((m) => m.loadEnvConfig);
dotenv(process.cwd());

const RESET = "\x1b[0m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function ok(label, detail = "") {
  console.log(`  ${GREEN}✓${RESET} ${label}${detail ? `${DIM} — ${detail}${RESET}` : ""}`);
}
function warn(label, detail = "") {
  console.log(`  ${YELLOW}!${RESET} ${label}${detail ? `${DIM} — ${detail}${RESET}` : ""}`);
}
function fail(label, detail = "") {
  console.log(`  ${RED}✗${RESET} ${label}${detail ? `${DIM} — ${detail}${RESET}` : ""}`);
}

function header(title) {
  console.log(`\n${BOLD}${title}${RESET}`);
}

async function main() {
  let hadFailure = false;

  header("1. Variáveis de ambiente");

  const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  for (const [key, value] of Object.entries(env)) {
    if (value) {
      const preview =
        key.includes("KEY") || key.includes("URL")
          ? `${value.slice(0, 24)}…${value.slice(-6)}`
          : value;
      ok(key, preview);
    } else {
      fail(key, "ausente");
      hadFailure = true;
    }
  }

  if (hadFailure) {
    console.log(
      `\n${YELLOW}Configure as variáveis em .env.local antes de prosseguir.${RESET}`,
    );
    console.log(`Veja apps/aiox-squads-ui/.env.example.\n`);
    process.exit(1);
  }

  header("2. Conexão Postgres (pooler — DATABASE_URL)");

  try {
    const { PrismaClient } = await import("@prisma/client");
    const db = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
      log: ["error"],
    });
    const result = await db.$queryRaw`SELECT version() as version`;
    ok("Conectado", String(result[0].version).slice(0, 60) + "…");
    await db.$disconnect();
  } catch (err) {
    fail("Falha ao conectar via pooler", err.message);
    console.log(
      `\n  ${DIM}Verifique se DATABASE_URL aponta para a "Transaction pooler" (porta 6543) com ?pgbouncer=true&connection_limit=1${RESET}`,
    );
    hadFailure = true;
  }

  header("3. Conexão Postgres (direta — DIRECT_URL, usada por migrations)");

  try {
    const { PrismaClient } = await import("@prisma/client");
    const db = new PrismaClient({
      datasourceUrl: env.DIRECT_URL,
      log: ["error"],
    });
    await db.$queryRaw`SELECT 1`;
    ok("Conectado");
    await db.$disconnect();
  } catch (err) {
    fail("Falha ao conectar diretamente", err.message);
    console.log(
      `\n  ${DIM}Verifique se DIRECT_URL aponta para "Direct connection" (porta 5432) sem pgbouncer${RESET}`,
    );
    hadFailure = true;
  }

  header("4. Supabase Auth endpoint");

  try {
    const url = `${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`;
    const response = await fetch(url, {
      headers: { apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    });
    if (response.ok) {
      ok("Reachable", `${url} → ${response.status}`);
    } else {
      warn("Resposta inesperada", `${url} → ${response.status}`);
    }
  } catch (err) {
    fail("Falha ao alcançar Supabase Auth", err.message);
    hadFailure = true;
  }

  header("5. Tabelas Prisma (após migrate)");

  try {
    const { PrismaClient } = await import("@prisma/client");
    const db = new PrismaClient({
      datasourceUrl: env.DATABASE_URL,
      log: ["error"],
    });
    try {
      const offices = await db.office.count();
      const matters = await db.matter.count();
      ok(
        "Tabelas presentes",
        `${offices} offices, ${matters} matters${matters > 0 ? "" : " (rode npm run db:seed)"}`,
      );
    } catch (err) {
      warn(
        "Tabelas ainda não existem",
        "rode `npm run db:migrate -- --name init` em seguida",
      );
    } finally {
      await db.$disconnect();
    }
  } catch (err) {
    fail("Erro inesperado", err.message);
    hadFailure = true;
  }

  console.log("");
  if (hadFailure) {
    console.log(`${RED}${BOLD}✗ Diagnóstico finalizado com erros.${RESET}`);
    process.exit(1);
  }
  console.log(`${GREEN}${BOLD}✓ Backend pronto para uso.${RESET}`);
  console.log(`${DIM}  Próximos passos sugeridos:${RESET}`);
  console.log(`    1. ${BOLD}npm run db:migrate -- --name init${RESET}`);
  console.log(`    2. ${BOLD}npm run db:seed${RESET}`);
  console.log(`    3. ${BOLD}npm run dev${RESET}`);
  console.log("");
}

await main();
