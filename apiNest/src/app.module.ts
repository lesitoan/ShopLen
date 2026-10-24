import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { HealthModule } from "@/modules/health/health.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { CustomerModule } from "@/modules/customers/customer.module.js";
import { UserModule } from "@/modules/users/user.module.js";
import { CategoryModule } from "@/modules/categories/category.module.js";
import { ProductModule } from "@/modules/products/product.module.js";

@Module({ imports: [EnvModule, HealthModule, LoggingModule, AuthModule, CustomerModule, UserModule, CategoryModule, ProductModule] })
export class AppModule {}
