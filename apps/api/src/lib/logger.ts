import pino from "pino";
import { env } from "../env.js";

export const logger = pino({
  level: env.LOG_LEVEL ?? "info",
  redact: {
    paths: [
      "email",
      "password",
      "token",
      "ip",
      "ipAddress",
      "*.email",
      "*.password",
      "*.token",
    ],
    censor: "[Redacted]",
  },
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
