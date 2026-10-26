import assert from "node:assert/strict";
import { test } from "node:test";
import { deepmerge } from "deepmerge-ts";
import Router from "find-my-way";
import * as v from "valibot";

test("patched config merge handles recursive graphs without exhausting the stack", () => {
  const left: { self?: unknown; value: number } = { value: 1 };
  const right: { self?: unknown; other: number } = { other: 2 };
  left.self = left; right.self = right;
  const merged = deepmerge(left, right);
  assert.equal(merged.self, merged);
  assert.equal(merged.value, 1);
  assert.equal(merged.other, 2);
});

test("patched CLI router treats inherited method names as missing routes", () => {
  const router = Router();
  router.on("GET", "/", () => {});
  for (const method of ["constructor", "toString", "__proto__"]) {
    assert.equal(router.find(method as Router.HTTPMethod, "/"), null);
  }
  assert.ok(router.find("GET", "/"));
});

test("patched CLI validation flattens inherited property keys without throwing", () => {
  const result = v.safeParse(v.record(v.string(), v.number()), JSON.parse('{"toString":"invalid","valueOf":"invalid","hasOwnProperty":"invalid"}'));
  assert.equal(result.success, false);
  if (result.success) throw new Error("Expected invalid record");
  const errors = v.flatten(result.issues);
  assert.deepEqual(Object.keys(errors.nested!), ["toString", "valueOf", "hasOwnProperty"]);
});
