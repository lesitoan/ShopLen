import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "zod";
import { AppError } from "@/common/errors/appError.js";
import { ZodValidationPipe } from "@/common/pipes/zodValidation.pipe.js";
import { createdResponse, paginatedResponse, successResponse } from "@/common/responses/httpResponse.js";

test("success responses preserve missing data versus null and falsy values", () => {
  for (const value of [undefined, null, false, 0, ""]) {
    assert.deepEqual(successResponse(value), { success: true, message: "Thành công." });
  }
  assert.deepEqual(successResponse([]), { success: true, message: "Thành công.", data: [] });
  assert.deepEqual(successResponse({ saved: true }, "Đã lưu."), {
    success: true, message: "Đã lưu.", data: { saved: true },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(createdResponse(undefined))), {
    success: true, message: "Tạo mới thành công.",
  });
  assert.deepEqual(createdResponse(null), {
    success: true, message: "Tạo mới thành công.", data: null,
  });
});

test("admin pagination is preserved without adding client pagination fields", () => {
  const pagination = { page: 2, limit: 20, total: 21 };
  assert.deepEqual(paginatedResponse([{ id: "item" }], pagination), {
    success: true, message: "Thành công.", data: { items: [{ id: "item" }], pagination },
  });
});

test("request schemas return parsed wrapper data without mutating request input", () => {
  const schema = z.object({
    body: z.object({ name: z.string().trim(), note: z.string().nullable().optional() }),
    query: z.object({ page: z.coerce.number().int().min(1).default(1) }),
    params: z.object({ id: z.string().uuid() }),
  });
  const input = {
    body: { name: " len ", note: null, extra: "strip" },
    query: { page: "2" }, params: { id: "00000000-0000-4000-8000-000000000001" },
  };
  assert.deepEqual(new ZodValidationPipe(schema).transform(input), {
    body: { name: "len", note: null }, query: { page: 2 }, params: input.params,
  });
  assert.equal(input.query.page, "2");
  assert.equal(input.body.name, " len ");
});

test("validation retains defaults, preprocess, refinement and legacy 422 error", () => {
  const schema = z.object({
    query: z.object({
      colors: z.preprocess((value) => String(value).split(","), z.array(z.string())),
      min: z.coerce.number().default(0), max: z.coerce.number().default(10),
    }).refine((value) => value.min <= value.max),
  });
  const pipe = new ZodValidationPipe(schema);
  assert.deepEqual(pipe.transform({ query: { colors: "RED,BLUE" } }), {
    query: { colors: ["RED", "BLUE"], min: 0, max: 10 },
  });
  assert.throws(() => pipe.transform({ query: { colors: "RED", min: 20 } }), (error) => {
    assert.ok(error instanceof AppError);
    assert.equal(error.statusCode, 422);
    assert.equal(error.errorCode, "VALIDATION_ERROR");
    assert.deepEqual(JSON.parse(error.internalMessage ?? ""), {
      formErrors: [], fieldErrors: { query: ["Invalid input"] },
    });
    return true;
  });
});
