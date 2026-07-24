import { Router } from "express";
import { authController } from "@/controllers/client/authController.js";
import { asyncHandler } from "@/utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post("/login", asyncHandler(authController.login));
authRoutes.post("/register", asyncHandler(authController.register));
