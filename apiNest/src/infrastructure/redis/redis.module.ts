import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { RedisService } from "@/infrastructure/redis/redis.service.js";

@Module({ imports: [EnvModule], providers: [RedisService], exports: [RedisService] })
export class RedisModule {}
