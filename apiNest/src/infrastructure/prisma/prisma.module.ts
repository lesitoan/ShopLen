import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { PrismaService } from "@/infrastructure/prisma/prisma.service.js";

@Module({ imports: [EnvModule], providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
