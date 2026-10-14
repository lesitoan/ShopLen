import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import ts from "typescript";

const root = resolve(process.cwd(), "..");
const legacy = resolve(root, "api/src");
const output = resolve(process.cwd(), "tests/fixtures/legacyContracts.json");
const parse = (file) => ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
const sourcePath = (file) => relative(root, file).replaceAll("\\", "/");
const digest = (file) => createHash("sha256").update(readFileSync(file, "utf8").replaceAll("\r\n", "\n")).digest("hex");
const moduleFile = (specifier, parent) => specifier.startsWith("@/")
  ? resolve(legacy, specifier.slice(2).replace(/\.js$/, ".ts"))
  : resolve(dirname(parent), specifier.replace(/\.js$/, ".ts"));
const importsFor = (source) => {
  const imports = new Map();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const bindings = statement.importClause?.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    for (const item of bindings.elements) {
      imports.set(item.name.text, {
        name: item.propertyName?.text ?? item.name.text,
        file: moduleFile(statement.moduleSpecifier.text, source.fileName),
      });
    }
  }
  return imports;
};
const visit = (node, predicate) => {
  const matches = [];
  const walk = (item) => {
    if (predicate(item)) matches.push(item);
    ts.forEachChild(item, walk);
  };
  walk(node);
  return matches;
};
const methodFor = (file, owner, method) => {
  const source = parse(file);
  const declaration = visit(source, (node) => ts.isVariableDeclaration(node) && node.name.getText(source) === owner)[0];
  if (!declaration?.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) return undefined;
  return { source, method: declaration.initializer.properties.find((property) => property.name?.getText(source) === method) };
};

const index = parse(resolve(legacy, "routes/index.ts"));
const imports = importsFor(index);
const endpoints = [];
const schemas = {};
const files = new Set([index.fileName]);
for (const mount of visit(index, (node) => ts.isCallExpression(node) && node.expression.getText(index) === "routes.use")) {
  const prefix = mount.arguments[0].text;
  const imported = imports.get(mount.arguments[1].getText(index));
  if (!imported) throw new Error(`Missing route import: ${prefix}`);
  files.add(imported.file);
  const source = parse(imported.file);
  const routeImports = importsFor(source);
  const middleware = [];
  for (const statement of source.statements) {
    if (!ts.isExpressionStatement(statement) || !ts.isCallExpression(statement.expression)) continue;
    const call = statement.expression;
    if (!ts.isPropertyAccessExpression(call.expression)) continue;
    const method = call.expression.name.text;
    if (method === "use") {
      middleware.push(...call.arguments.map((argument) => argument.getText(source)));
      continue;
    }
    if (!["get", "post", "patch", "delete", "put"].includes(method)) continue;
    const path = `/api/v1${prefix}${call.arguments[0].text === "/" ? "" : call.arguments[0].text}`;
    const handlers = call.arguments.slice(1).map((argument) => argument.getText(source));
    const expressions = [...middleware, ...handlers];
    const schemaNames = expressions.flatMap((expression) => [...expression.matchAll(/validateMiddleware\((\w+)\)/g)].map((match) => match[1]));
    for (const name of schemaNames) {
      const schemaImport = routeImports.get(name);
      if (!schemaImport) throw new Error(`Missing schema: ${name}`);
      files.add(schemaImport.file);
      const schemaSource = parse(schemaImport.file);
      const declaration = visit(schemaSource, (node) => ts.isVariableDeclaration(node) && node.name.getText(schemaSource) === schemaImport.name)[0];
      schemas[name] = {
        file: sourcePath(schemaImport.file),
        definition: declaration?.initializer?.getText(schemaSource).replaceAll("\r\n", "\n"),
      };
    }
    const controllerCall = handlers.map((handler) => /asyncHandler\((\w+)\.(\w+)\)/.exec(handler)).find(Boolean);
    if (!controllerCall) throw new Error(`Missing controller: ${path}`);
    const [, owner, action] = controllerCall;
    const controllerFile = routeImports.get(owner).file;
    files.add(controllerFile);
    const controller = methodFor(controllerFile, owner, action);
    if (!controller?.method) throw new Error(`Missing controller method: ${owner}.${action}`);
    const calls = visit(controller.method, ts.isCallExpression).map((node) => ({
      call: node.expression.getText(controller.source),
      arguments: node.arguments.map((argument) => argument.getText(controller.source)),
    }));
    const responseCalls = calls.filter((node) => /sendSuccess|sendCreated|sendPaginated|\.status$|\.json$|\.set$|TokenCookie/.test(node.call));
    const dependencies = importsFor(controller.source);
    const services = calls.flatMap((node) => {
      const match = /^(\w+Service)\.(\w+)$/.exec(node.call);
      if (!match || !dependencies.has(match[1])) return [];
      const file = dependencies.get(match[1]).file;
      files.add(file);
      const service = methodFor(file, match[1], match[2]);
      const effects = service?.method ? visit(service.method, ts.isCallExpression)
        .map((item) => item.expression.getText(service.source))
        .filter((name) => /enqueue|emit|invalidate|revoke|\.send|\.create|\.update|\.delete|\$transaction/.test(name)) : [];
      return [{ file: sourcePath(file), action: match[2], directEffects: [...new Set(effects)] }];
    });
    endpoints.push({
      method: method.toUpperCase(), path, router: sourcePath(imported.file),
      middleware: expressions.slice(0, -1), schemas: schemaNames,
      controller: { file: sourcePath(controllerFile), action }, responseCalls, services,
      verification: "SOURCE_CAPTURED_RUNTIME_PENDING",
    });
  }
}
if (endpoints.length !== 80) throw new Error(`Expected 80 endpoints, got ${endpoints.length}`);
const manifest = {
  baseline: "e54c7164b4d9dd8b7e9bfd8dc5a1684cc86fce88",
  health: { method: "GET", path: "/health", status: 200, body: { ok: true, service: "tiemLenApi" } },
  endpoints, schemas,
  sources: Object.fromEntries([...files].filter(existsSync).sort().map((file) => [sourcePath(file), digest(file)])),
};
const serialized = `${JSON.stringify(manifest, null, 2)}\n`;
if (process.argv.includes("--check")) {
  if (readFileSync(output, "utf8") !== serialized) throw new Error("Legacy source contract snapshot changed; inspect before recapturing");
} else {
  writeFileSync(output, serialized);
}
process.stdout.write(`Captured ${endpoints.length} routes, ${Object.keys(schemas).length} schemas and ${files.size} source fingerprints\n`);
