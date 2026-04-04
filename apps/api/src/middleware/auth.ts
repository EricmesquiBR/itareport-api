import type { Context, MiddlewareHandler } from "hono";
import { jwtVerify as joseVerify, SignJWT } from "jose";
import { env } from "../env.js";

export interface JwtPayload {
  userId: string;
}

const getSecret = () => new TextEncoder().encode(env.JWT_SECRET!);

export function authMiddleware(): MiddlewareHandler {
  return async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return c.json(
        { success: false, message: "Authentication required" },
        401,
      );
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2) {
      return c.json(
        { success: false, message: "Invalid authorization header format" },
        401,
      );
    }

    const token = parts[1] as string;

    try {
      const { payload } = await joseVerify(token, getSecret());
      c.set("userId", payload.userId as string);
      await next();
    } catch {
      return c.json(
        { success: false, message: "Invalid or expired token" },
        401,
      );
    }
  };
}

export function getAuthUserId(c: Context): string {
  const userId = c.get("userId") as string | undefined;
  if (!userId) {
    throw new Error("User ID not found in context. Auth middleware not applied.");
  }
  return userId;
}

export async function generateToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN)
    .sign(getSecret());
}
