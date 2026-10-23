import { existsSync, realpathSync, rmSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(project, "distTests");
if (existsSync(target)) {
  if (relative(project, realpathSync(target)) !== "distTests") {
    throw new Error("Refusing to remove test output outside the expected project directory");
  }
  rmSync(target, { recursive: true, force: true });
}
