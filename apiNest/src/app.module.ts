import { Module } from "@nestjs/common";
import { EnvModule } from "@/config/env.module.js";
import { HealthModule } from "@/modules/health/health.module.js";
import { LoggingModule } from "@/infrastructure/logging/logging.module.js";
import { AuthModule } from "@/modules/auth/auth.module.js";
import { CustomerModule } from "@/modules/customers/customer.module.js";
import { UserModule } from "@/modules/users/user.module.js";
import { CategoryModule } from "@/modules/categories/category.module.js";
import { ProductModule } from "@/modules/products/product.module.js";
import { CartModule } from "@/modules/cart/cart.module.js";
import { BlogModule } from "@/modules/blogs/blog.module.js";
import { UploadModule } from "@/modules/uploads/upload.module.js";
import { OrderModule } from "@/modules/orders/order.module.js";

@Module({ imports: [EnvModule, HealthModule, LoggingModule, AuthModule, CustomerModule, UserModule, CategoryModule, ProductModule, CartModule, BlogModule, UploadModule, OrderModule] })
export class AppModule {}
