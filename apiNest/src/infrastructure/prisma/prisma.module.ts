import { LifecycleModule } from "@/infrastructure/lifecycle/lifecycle.module.js";
import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";

@Module({ imports: [LifecycleModule, EnvModule], providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
