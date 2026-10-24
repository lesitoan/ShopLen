import assert from "node:assert/strict";
import { fork } from "node:child_process";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { INestApplication } from "@nestjs/common";

export async function startLegacyServer(script = "legacyServer.mjs") {
  const legacyRoot = resolve(process.cwd(), "../api");
  const requireLegacy = createRequire(resolve(legacyRoot, "package.json"));
  const child = fork(resolve(process.cwd(), "tests/harness", script), [], {
    cwd: legacyRoot,
    execArgv: ["--import", pathToFileURL(requireLegacy.resolve("tsx")).href],
    env: { ...process.env, TSX_TSCONFIG_PATH: resolve(legacyRoot, "tsconfig.json") },
    stdio: ["ignore", "pipe", "pipe", "ipc"],
  });
  let diagnostics = "";
  child.stderr?.on("data", (value) => { diagnostics += value.toString(); });
  child.stdout?.on("data", () => {});
  const url = await new Promise<string>((resolveUrl, reject) => {
    const timer = setTimeout(() => { child.kill(); reject(new Error(`Legacy startup timeout: ${diagnostics}`)); }, 15_000);
    child.once("message", (value) => {
      clearTimeout(timer);
      resolveUrl(`http://127.0.0.1:${(value as { port: number }).port}`);
    });
    child.once("error", (error) => { clearTimeout(timer); reject(error); });
    child.once("exit", (code) => { clearTimeout(timer); reject(new Error(`Legacy exited ${code}: ${diagnostics}`)); });
  });
  return { url, close: async () => {
    if (child.exitCode !== null) return;
    await new Promise<void>((resolveExit) => {
      const timer = setTimeout(() => child.kill(), 3_000);
      child.once("exit", () => { clearTimeout(timer); resolveExit(); });
      child.send("close");
    });
  } };
}

export async function startNestServer(app: INestApplication) {
  await app.listen(0, "127.0.0.1");
  return { url: await app.getUrl(), close: () => app.close() };
}

export async function captureResponse(url: string, path: string, method = "GET", body?: string) {
  const response = await fetch(`${url}${path}`, {
    method, body,
    headers: { "content-type": "application/json", "x-request-id": "fixture-request-id" },
  });
  return {
    status: response.status,
    requestId: response.headers.get("x-request-id"),
    contentType: response.headers.get("content-type"),
    body: await response.json(),
  };
}

export function assertContractMatches(actual: unknown, expected: unknown) {
  assert.deepEqual(actual, expected);
}
