export const infrastructureFixtures = {
  legacy: {
    databaseUrl: "postgresql://contract_test:contract_test@127.0.0.1:55441/shoplen_contract_test",
    redisUrl: "redis://127.0.0.1:56381/15",
  },
  nest: {
    databaseUrl: "postgresql://contract_test:contract_test@127.0.0.1:55442/shoplen_contract_test",
    redisUrl: "redis://127.0.0.1:56382/15",
  },
} as const;
