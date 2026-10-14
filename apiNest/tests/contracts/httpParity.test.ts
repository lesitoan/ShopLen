import "../harness/testEnvironment.js";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  } finally {
    await Promise.all([legacy.close(), nest.close()]);
  }
});
