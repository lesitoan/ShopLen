import { Module } from "@nestjs/common";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module.js";
import {
  AnalyticsController,
  DashboardController,
} from "@/modules/analytics/analytics.controller.js";
import { AnalyticsService } from "@/modules/analytics/analytics.service.js";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [AnalyticsController, DashboardController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
