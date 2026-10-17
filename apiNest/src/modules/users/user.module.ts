import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { AdminUserController } from "@/modules/users/controllers/adminUser.controller.js";
import { AdminUserService } from "@/modules/users/services/adminUser.service.js";

@Module({ imports: [PrismaModule, AuthModule], controllers: [AdminUserController], providers: [AdminUserService] })
export class UserModule {}
