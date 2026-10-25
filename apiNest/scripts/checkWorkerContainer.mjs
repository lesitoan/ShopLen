import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout } from "node:timers/promises";
import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { parse } from "dotenv";
import pg from "pg";

const config = parse(readFileSync(".env"));
const approved = JSON.parse(readFileSync("docs/integrationTarget.json", "utf8"));
assert.equal(createHash("sha256").update(`${config.DATABASE_URL}\n${config.REDIS_URL}`).digest("hex"), approved.fingerprint, "Verify the dedicated test targets first.");
const db = new pg.Client({ connectionString: config.DATABASE_URL, connectionTimeoutMillis: 10000, query_timeout: 10000 });
try {
  await db.connect();
  assert.equal((await db.query("SELECT COUNT(*)::int AS count FROM public.orders")).rows[0].count, 0, "The expiry probe requires an empty test order table.");
} finally { await db.end(); }
const image = process.argv[2] ?? "shoplen-api-nest:day9-local";
const prefix = `integration-${randomUUID()}`;
const connection = new Redis(config.REDIS_URL, { maxRetriesPerRequest: null });
connection.on("error", () => {});
const queue = new Queue("notificationQueue", { connection, prefix });
const expiry = new Queue("orderExpiryQueue", { connection, prefix });
const docker = (...args) => execFileSync("docker", args, { encoding: "utf8", timeout: 40000, stdio: ["ignore", "pipe", "pipe"] }).trim();
let container;
const waitFor = async (marker) => {
  const end = Date.now() + 30000;
  while (Date.now() < end) {
    if (docker("logs", container).includes(marker)) return;
    await setTimeout(250);
  }
  throw new Error(`Container probe timeout waiting for ${marker}`);
};
try {
  container = docker("run", "--detach", "--init", "--env-file", resolve(".env"), "-e", "NODE_ENV=test", "-e", "LOG_LEVEL=silent", "-e", "PRISMA_LOG_QUERIES=false", "-e", "TELEGRAM_ENABLED=false", "-e", "RESEND_API_KEY=", "-e", "PORT=4000", "-e", "SHOPLEN_CONTAINER_PROBE=1", "-e", `SHOPLEN_QUEUE_PREFIX=${prefix}`, "--mount", `type=bind,source=${resolve("tests/harness/containerWorkerProbe.mjs")},target=/app/containerWorkerProbe.mjs,readonly`, image, "node", "containerWorkerProbe.mjs");
  assert.match(container, /^[a-f0-9]{64}$/);
  await waitFor("CONTAINER_PROBE_READY");
  const job = await queue.add("ORDER_PAID", { orderId: "integration-probe", orderCode: "DHPROBE", paidAt: new Date().toISOString() });
  await waitFor("CONTAINER_JOB_STARTED");
  docker("stop", "--time", "20", container);
  assert.ok(docker("logs", container).includes("CONTAINER_JOB_COMPLETED"));
  const exitCode = docker("inspect", "--format", "{{.State.ExitCode}}", container);
  assert.ok(["0", "143"].includes(exitCode), `Unexpected container exit ${exitCode}`);
  assert.equal(await job.getState(), "completed");
  console.log(JSON.stringify({ activeJobDrained: true, jobCompleted: true, gracefulExitCode: Number(exitCode), isolatedQueuePrefix: true }));
} finally {
  if (container && /^[a-f0-9]{64}$/.test(container)) docker("rm", "--force", container);
  try {
    await expiry.removeJobScheduler("orderExpiryScheduler");
    await queue.obliterate({ force: true }); await expiry.obliterate({ force: true });
  } finally { await queue.close(); await expiry.close(); connection.disconnect(); }
}
