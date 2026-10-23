import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";
import { EnvService } from "@/config/env.service.js";
import { createClient } from "redis";
import { REDIS_CLIENT } from "@/infrastructure/redis/redisTokens.js";

@Module({
  imports: [EnvModule],
  providers: [
    { provide: REDIS_CLIENT, inject: [EnvService], useFactory: (config: EnvService) =>
      createClient({ url: config.values.REDIS_URL }) },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
