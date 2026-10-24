export type Row = Record<string, unknown>;
export type Query = { where?: Row; select?: Row; include?: Row; orderBy?: Row | Row[]; skip?: number; take?: number; data?: Row };

function matches(value: unknown, filter: unknown): boolean {
  if (filter === null || typeof filter !== "object") return value === filter;
  if (Array.isArray(filter)) return filter.every((part) => matches(value, part));
  return Object.entries(filter).every(([key, expected]) => {
    if (key === "mode") return true;
    if (key === "in") return (expected as unknown[]).includes(value);
    if (key === "notIn") return !(expected as unknown[]).includes(value);
    if (key === "not") return !matches(value, expected);
    if (key === "gt") return value != null && Number(value) > Number(expected);
    if (key === "gte") return value != null && Number(value) >= Number(expected);
    if (key === "lte") return value != null && Number(value) <= Number(expected);
    if (key === "contains") return String(value ?? "").toLowerCase().includes(String(expected).toLowerCase());
    if (key === "some") return Array.isArray(value) && value.some((item) => matches(item, expected));
    if (key === "array_contains") return Array.isArray(value) && (expected as unknown[]).every((part) => value.some((item) => matches(item, part)));
    if (key === "AND") return (expected as unknown[]).every((part) => matches(value, part));
    if (key === "OR") return (expected as unknown[]).some((part) => matches(value, part));
    return value !== null && typeof value === "object" && matches(Reflect.get(value, key), expected);
  });
}

export function queryRows(rows: Row[], query: Query): Row[] {
  let result = rows.filter((row) => !query.where || matches(row, query.where));
  const order = query.orderBy ? (Array.isArray(query.orderBy) ? query.orderBy : [query.orderBy]) : [];
  result = [...result].sort((left, right) => {
    for (const item of order) {
      for (const [key, direction] of Object.entries(item)) {
        const a = left[key], b = right[key];
        if (a === b) continue;
        const compared = a == null ? 1 : b == null ? -1 : a < b ? -1 : a > b ? 1 : 0;
        if (compared) return direction === "desc" ? -compared : compared;
      }
    }
    return 0;
  });
  result = result.slice(query.skip ?? 0, query.take === undefined ? undefined : (query.skip ?? 0) + query.take);
  if (!query.select && !query.include) return result;
  const select = query.select ?? query.include!;
  return result.map((row) => ({ ...(query.include ? row : {}), ...Object.fromEntries(Object.entries(select).filter(([, enabled]) => enabled).map(([key, selection]) => {
    const value = row[key];
    if (selection === true) return [key, value];
    const nested = selection as Query;
    return [key, value == null ? value : Array.isArray(value) ? queryRows(value, nested) : queryRows([value as Row], nested)[0]];
  })) }));
}
