import "../harness/testEnvironment.js";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { createApplication } from "@/bootstrap.js";
import { httpCases } from "../fixtures/httpCases.js";
import { NestFixtureModule } from "../harness/nestFixture.module.js";
import { assertContractMatches, captureResponse, startLegacyServer, startNestServer } from "../harness/contractHarness.js";

test("HTTP foundation matches actual Express response, validation and error helpers", async (context) => {
  const baselines = JSON.parse(readFileSync(resolve("tests/fixtures/httpBaseline.json"), "utf8"));
  const legacy = await startLegacyServer();
  const nest = await startNestServer(await createApplication(NestFixtureModule));
  try {
    for (const fixture of httpCases) {
      await context.test(fixture.name, async () => {
        const method = "method" in fixture ? fixture.method : "GET";
        const body = "body" in fixture ? fixture.body : undefined;
        const expected = await captureResponse(legacy.url, fixture.path, method, body);
        const actual = await captureResponse(nest.url, fixture.path, method, body);
        assertContractMatches(expected, baselines[fixture.name]);
        assertContractMatches(actual, expected);
      });
    }
    await context.test("refresh cookie creation and clearing preserve Express 4 attributes", async () => {
      for (const scope of ["CUSTOMER", "ADMIN"]) {
        for (const clear of ["0", "1"]) {
          const path = `/api/v1/fixtures/auth-cookie?scope=${scope}&clear=${clear}`;
          const oldResponse = await fetch(`${legacy.url}${path}`);
          const newResponse = await fetch(`${nest.url}${path}`);
          const normalize = (header: string | null) => header?.replace(/Expires=[^;]+/, "Expires=<timestamp>");
          assert.equal(normalize(newResponse.headers.get("set-cookie")), normalize(oldResponse.headers.get("set-cookie")));
          await oldResponse.arrayBuffer();
          await newResponse.arrayBuffer();
        }
      }
    });
  } finally {
    await Promise.all([legacy.close(), nest.close()]);
  }
});
