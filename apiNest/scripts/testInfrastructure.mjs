import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const prismaPackage = JSON.parse(readFileSync(resolve("node_modules/prisma/package.json"), "utf8"));
const prismaCli = resolve("node_modules/prisma", prismaPackage.bin.prisma);
for (const port of [55441, 55442]) {
  const result = spawnSync(process.execPath, [prismaCli, "migrate", "deploy"], {
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "test",
      DATABASE_URL: `postgresql://contract_test:contract_test@127.0.0.1:${port}/shoplen_contract_test`,
    },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", "tests/integration/infrastructure.test.ts"], {
  stdio: "inherit", env: { ...process.env, NODE_ENV: "test", LOG_LEVEL: "silent" },
});
process.exitCode = result.status ?? 1;
