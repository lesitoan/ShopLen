import { Module } from "@nestjs/common";
import { ResourceDrainService } from "@/infrastructure/lifecycle/resourceDrain.service.js";

@Module({ providers: [ResourceDrainService], exports: [ResourceDrainService] })
export class LifecycleModule {}
