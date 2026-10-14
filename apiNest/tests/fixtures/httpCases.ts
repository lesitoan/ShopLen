export const httpCases = [
  { name: "health outside API prefix", path: "/health" },
  { name: "data omitted", path: "/api/v1/fixtures/success?value=missing" },
  { name: "null omitted", path: "/api/v1/fixtures/success?value=null" },
  { name: "false omitted", path: "/api/v1/fixtures/success?value=false" },
  { name: "zero omitted", path: "/api/v1/fixtures/success?value=zero" },
  { name: "empty string omitted", path: "/api/v1/fixtures/success?value=empty" },
  { name: "empty array retained", path: "/api/v1/fixtures/success?value=array" },
  { name: "object retained", path: "/api/v1/fixtures/success?value=object" },
  { name: "creation status", path: "/api/v1/fixtures/created", method: "POST", body: "{}" },
  { name: "admin pagination", path: "/api/v1/fixtures/paginated" },
  { name: "featured null", path: "/api/v1/fixtures/featured" },
  { name: "blog detail missing", path: "/api/v1/fixtures/missing-blog" },
  { name: "webhook ack and raw body", path: "/api/v1/fixtures/webhook", method: "POST", body: '{ "amount": 100 }' },
  { name: "AppError", path: "/api/v1/fixtures/error" },
  { name: "unknown error", path: "/api/v1/fixtures/unhandled" },
  { name: "upload limit", path: "/api/v1/fixtures/upload-error" },
  { name: "parsed wrapped request", path: "/api/v1/fixtures/request/00000000-0000-4000-8000-000000000001?page=2&colors=red,blue&home=1", method: "POST", body: '{"name":" len ","note":null,"extra":"strip"}' },
  { name: "default query", path: "/api/v1/fixtures/request/00000000-0000-4000-8000-000000000001", method: "POST", body: '{"name":" len "}' },
  { name: "invalid request 422", path: "/api/v1/fixtures/request/not-uuid?page=0", method: "POST", body: '{"name":""}' },
] as const;

export function fixtureValue(value?: string) {
  const values: Record<string, unknown> = {
    null: null, false: false, zero: 0, empty: "", array: [], object: { id: "fixture-product", name: "Móc khóa len" },
  };
  return values[value ?? "missing"];
}
