import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
for (const port of [55441, 55442]) {
  const result = spawnSync(process.execPath, [require.resolve("prisma"), "migrate", "deploy"], {
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
