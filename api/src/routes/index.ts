import { Router } from "express";
import { adminDashboardRoutes } from "@/routes/admin/adminDashboardRoutes.js";
import { adminOrderRoutes } from "@/routes/admin/adminOrderRoutes.js";
import { uploadRoutes } from "@/routes/admin/uploadRoutes.js";
import { authRoutes } from "@/routes/client/authRoutes.js";
import { categoryRoutes } from "@/routes/client/categoryRoutes.js";
import { orderRoutes } from "@/routes/client/orderRoutes.js";
import { paymentRoutes } from "@/routes/client/paymentRoutes.js";
import { productRoutes } from "@/routes/client/productRoutes.js";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/products", productRoutes);
routes.use("/orders", orderRoutes);
routes.use("/payments", paymentRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/admin/uploads", uploadRoutes);
routes.use("/admin/orders", adminOrderRoutes);
routes.use("/admin/dashboard", adminDashboardRoutes);
