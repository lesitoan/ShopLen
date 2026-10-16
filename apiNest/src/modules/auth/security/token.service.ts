import { Inject, Injectable } from "@nestjs/common";
import { EnvService } from "@/config/env.service.js";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { AppError } from "@/common/errors/appError.js";
import type { CustomerAccessTokenPayload, CustomerRefreshTokenPayload, } from "@/modules/auth/types/clientAuth.type.js";
import type { AdminAccessTokenPayload, AdminRefreshTokenPayload, } from "@/modules/auth/types/adminAuth.type.js";
@Injectable()
export class TokenService {
    constructor(
    @Inject(EnvService)
    private readonly config: EnvService) { }
    getAccessSecret(): Secret {
        const secret = this.config.values.JWT_ACCESS_SECRET ?? this.config.values.JWT_SECRET;
        if (!secret) {
            throw new AppError("Thiếu cấu hình JWT access secret.", 500, "INTERNAL_SERVER_ERROR", "JWT_ACCESS_SECRET or JWT_SECRET is missing");
        }
        return secret;
    }
    getRefreshSecret(): Secret {
        const secret = this.config.values.JWT_REFRESH_SECRET ?? this.config.values.JWT_SECRET;
        if (!secret) {
            throw new AppError("Thiếu cấu hình JWT refresh secret.", 500, "INTERNAL_SERVER_ERROR", "JWT_REFRESH_SECRET or JWT_SECRET is missing");
        }
        return secret;
    }
    signCustomerAccessToken(payload: CustomerAccessTokenPayload) {
        return jwt.sign(payload, this.getAccessSecret(), {
            expiresIn: this.config.values.JWT_ACCESS_EXPIRES_IN,
        } as SignOptions);
    }
    signCustomerRefreshToken(payload: Omit<CustomerRefreshTokenPayload, "exp">) {
        return jwt.sign(payload, this.getRefreshSecret(), {
            expiresIn: this.config.values.JWT_REFRESH_EXPIRES_IN,
        } as SignOptions);
    }
    signAdminAccessToken(payload: AdminAccessTokenPayload) {
        return jwt.sign(payload, this.getAccessSecret(), {
            expiresIn: this.config.values.JWT_ACCESS_EXPIRES_IN,
        } as SignOptions);
    }
    signAdminRefreshToken(payload: Omit<AdminRefreshTokenPayload, "exp">) {
        return jwt.sign(payload, this.getRefreshSecret(), {
            expiresIn: this.config.values.JWT_REFRESH_EXPIRES_IN,
        } as SignOptions);
    }
    verifyCustomerAccessToken(token: string) {
        let payload: string | jwt.JwtPayload;
        try {
            payload = jwt.verify(token, this.getAccessSecret());
        }
        catch (error) {
            throw new AppError("Token không hợp lệ hoặc đã hết hạn.", 401, "UNAUTHORIZED", error instanceof Error ? error.message : "Access token verify failed");
        }
        if (typeof payload !== "object" ||
            payload.tokenType !== "CUSTOMER" ||
            typeof payload.sub !== "string" ||
            typeof payload.email !== "string") {
            throw new AppError("Token không hợp lệ.", 401, "UNAUTHORIZED");
        }
        return payload as CustomerAccessTokenPayload;
    }
    verifyCustomerRefreshToken(token: string) {
        let payload: string | jwt.JwtPayload;
        try {
            payload = jwt.verify(token, this.getRefreshSecret());
        }
        catch (error) {
            throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn.", 401, "REFRESH_TOKEN_INVALID", error instanceof Error ? error.message : "Refresh token verify failed");
        }
        if (typeof payload !== "object" ||
            payload.tokenType !== "CUSTOMER_REFRESH" ||
            typeof payload.sub !== "string" ||
            typeof payload.jti !== "string" ||
            typeof payload.exp !== "number") {
            throw new AppError("Refresh token không hợp lệ.", 401, "REFRESH_TOKEN_INVALID");
        }
        return payload as CustomerRefreshTokenPayload;
    }
    verifyAdminAccessToken(token: string) {
        let payload: string | jwt.JwtPayload;
        try {
            payload = jwt.verify(token, this.getAccessSecret());
        }
        catch (error) {
            throw new AppError("Token không hợp lệ hoặc đã hết hạn.", 401, "UNAUTHORIZED", error instanceof Error ? error.message : "Admin access token verify failed");
        }
        if (typeof payload !== "object" ||
            payload.tokenType !== "ADMIN" ||
            typeof payload.sub !== "string" ||
            typeof payload.email !== "string" ||
            typeof payload.role !== "string") {
            throw new AppError("Token không hợp lệ.", 401, "UNAUTHORIZED");
        }
        return payload as AdminAccessTokenPayload;
    }
    verifyAdminRefreshToken(token: string) {
        let payload: string | jwt.JwtPayload;
        try {
            payload = jwt.verify(token, this.getRefreshSecret());
        }
        catch (error) {
            throw new AppError("Refresh token không hợp lệ hoặc đã hết hạn.", 401, "REFRESH_TOKEN_INVALID", error instanceof Error ? error.message : "Admin refresh token verify failed");
        }
        if (typeof payload !== "object" ||
            payload.tokenType !== "ADMIN_REFRESH" ||
            typeof payload.sub !== "string" ||
            typeof payload.jti !== "string" ||
            typeof payload.exp !== "number") {
            throw new AppError("Refresh token không hợp lệ.", 401, "REFRESH_TOKEN_INVALID");
        }
        return payload as AdminRefreshTokenPayload;
    }
}
