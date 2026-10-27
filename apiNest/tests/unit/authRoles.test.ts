import "../harness/testEnvironment.js";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "@/modules/auth/guards/roles.guard.js";
import { Roles } from "@/modules/auth/decorators/roles.decorator.js";
import { AppError } from "@/common/errors/appError.js";

test("role guard denies missing actors and unauthorized staff without trusting JWT role alone", () => {
  @Roles("ADMIN", "SUPER_ADMIN")
  class Restricted {}
  const request: { adminUser?: { role: string } } = {};
  const context = {
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => function handler() {}, getClass: () => Restricted,
  } as unknown as ExecutionContext;
  const guard = new RolesGuard(new Reflector());
  assert.throws(() => guard.canActivate(context), (error: unknown) => error instanceof AppError && error.statusCode === 401);
  request.adminUser = { role: "STAFF_ORDER" };
  assert.throws(() => guard.canActivate(context), (error: unknown) => error instanceof AppError && error.statusCode === 403);
  request.adminUser = { role: "ADMIN" };
  assert.equal(guard.canActivate(context), true);
});
