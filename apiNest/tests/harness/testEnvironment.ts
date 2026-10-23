process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/shoplen_test";
process.env.REDIS_URL = "redis://127.0.0.1:1";
process.env.CORS_ORIGINS = "http://localhost:3000,http://localhost:3001";
