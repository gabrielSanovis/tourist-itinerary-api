import rateLimit from "express-rate-limit";
import { config } from "../../shared/config/config";

export const rateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: "Too Many Requests",
    message: `You have exceeded the limit of ${config.RATE_LIMIT_MAX_REQUESTS} requests per minute. Please wait and try again.`,
  },
});
