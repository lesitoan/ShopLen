import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { parse } from "dotenv";

const config = parse(readFileSync(".env"));
const fingerprint = createHash("sha256").update(`${config.DATABASE_URL}\n${config.REDIS_URL}`).digest("hex");
if (process.argv.includes("--verify-empty")) {
  const legacy = existsSync("../api/.env") ? parse(readFileSync("../api/.env")) : {};
  const identity = (value) => {
    if (!value) return undefined;
    const url = new URL(value);
    return `${url.protocol}//${url.username}@${url.hostname}:${url.port}${url.pathname}`;
  };
  if (!config.DATABASE_URL || !config.REDIS_URL || identity(config.DATABASE_URL) === identity(legacy.DATABASE_URL) || identity(config.REDIS_URL) === identity(legacy.REDIS_URL)) throw new Error("Use dedicated test services, separate from the legacy environment.");
  const { default: pg } = await import("pg");
  const { createClient } = await import("redis");
  const db = new pg.Client({ connectionString: config.DATABASE_URL, connectionTimeoutMillis: 10000, query_timeout: 10000 });
  const redis = createClient({ url: config.REDIS_URL, socket: { connectTimeout: 10000, reconnectStrategy: false } });
  redis.on("error", () => {});
  try {
    await db.connect(); await redis.connect();
    await db.query("BEGIN READ ONLY");
    const tables = await db.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public'");
    const models = [...readFileSync("prisma/schema.prisma", "utf8").matchAll(/model \w+ \{[^}]*@@map\("([^"]+)"\)/g)].map((match) => match[1]);
    for (const { tablename } of tables.rows) {
      if (tablename === "_prisma_migrations") continue;
      if (!models.includes(tablename)) throw new Error("Unexpected public tables; refusing to approve test writes.");
      const table = '"' + tablename.replaceAll('"', '""') + '"';
      const rows = await db.query(`SELECT EXISTS(SELECT 1 FROM public.${table} LIMIT 1) AS populated`);
      if (rows.rows[0].populated) throw new Error("Application tables must be empty before target approval.");
    }
    await db.query("ROLLBACK");
    if (await redis.dbSize() !== 0) throw new Error("Redis test database must be empty before target approval.");
    mkdirSync("docs", { recursive: true });
    writeFileSync("docs/integrationTarget.json", JSON.stringify({ fingerprint, verifiedEmpty: true }));
    console.log("Verified empty test services. Local fingerprint recorded; no migrations or fixtures applied.");
  } finally { await db.end().catch(() => {}); if (redis.isOpen) redis.destroy(); }
  process.exit(0);
}
if (!existsSync("docs/integrationTarget.json")) throw new Error("Verify your dedicated empty test services first: npm run test:integration -- --verify-empty");
const target = JSON.parse(readFileSync("docs/integrationTarget.json", "utf8"));
if (!target.verifiedEmpty || fingerprint !== target.fingerprint) throw new Error("Integration target changed; verify the dedicated test services before running writes.");
const env = { ...process.env, ...config, NODE_ENV: "test", LOG_LEVEL: "silent", PRISMA_LOG_QUERIES: "false", TELEGRAM_ENABLED: "false", SHOPLEN_INTEGRATION_TESTS: "1", BANK_CODE: "TEST", BANK_ACCOUNT_NUMBER: "0000000000", BANK_ACCOUNT_NAME: "TEST", SEPAY_WEBHOOK_AUTH_TYPE: "HMAC", SEPAY_WEBHOOK_SECRET: "integration-test-secret" };
const files = readdirSync("tests/integration").filter((file) => file.endsWith(".test.ts")).map((file) => `tests/integration/${file}`);
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", "--test-concurrency=1", ...files], { env, stdio: "inherit" });
process.exitCode = result.status ?? 1;
