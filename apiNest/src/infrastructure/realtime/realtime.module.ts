import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { RealtimeService } from "@/infrastructure/realtime/realtime.service.js";

@Module({ imports: [EnvModule], providers: [RealtimeService], exports: [RealtimeService] })
export class RealtimeModule {}
