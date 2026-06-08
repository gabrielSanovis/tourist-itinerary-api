import pino from "pino";
import { config } from "../config/config";

export const logger = pino({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  redact: {
    paths: [
      "req.headers.authorization",
      "authorization",
      "apiKey",
      "api_key",
      "privateKey",
      "private_key",
      "*.authorization",
      "*.apiKey",
      "*.api_key",
      "*.privateKey",
      "*.private_key",
      "err.config.headers.Authorization"
    ],
    censor: "[REDACTED]",
  },
  transport:
    config.NODE_ENV !== "production"
      ? { target: "pino-pretty", options: { colorize: true } }
      : undefined,
});
