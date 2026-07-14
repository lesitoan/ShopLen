import { Router } from "express";
import { adminDashboardRoutes } from "./adminDashboardRoutes.js";
import { adminOrderRoutes } from "./adminOrderRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { blogRoutes } from "./blogRoutes.js";
import { categoryRoutes } from "./categoryRoutes.js";
import { loyaltyRoutes } from "./loyaltyRoutes.js";
import { orderRoutes } from "./orderRoutes.js";
import { paymentRoutes } from "./paymentRoutes.js";
import { productRoutes } from "./productRoutes.js";
import { promotionRoutes } from "./promotionRoutes.js";
import { uploadRoutes } from "./uploadRoutes.js";
import { userRoutes } from "./userRoutes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/products", productRoutes);
routes.use("/orders", orderRoutes);
routes.use("/payments", paymentRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/promotions", promotionRoutes);
routes.use("/loyalty", loyaltyRoutes);
routes.use("/blogs", blogRoutes);
routes.use("/users", userRoutes);
routes.use("/uploads", uploadRoutes);
routes.use("/admin/orders", adminOrderRoutes);
routes.use("/admin/dashboard", adminDashboardRoutes);
