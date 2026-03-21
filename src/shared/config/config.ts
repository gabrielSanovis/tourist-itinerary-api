import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
  CORS_ORIGIN: z.string().default("*"),
  DATABASE_URL: z.string().min(1).optional(),
  PGHOST: z.string().min(1).optional(),
  PGPORT: z.coerce.number().int().positive().optional(),
  PGUSER: z.string().min(1).optional(),
  PGPASSWORD: z.string().min(1).optional(),
  PGDATABASE: z.string().min(1).optional(),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(10),
})
  .superRefine((data, ctx) => {
    const hasDatabaseUrl = Boolean(data.DATABASE_URL);
    const hasPgParts =
      Boolean(data.PGHOST) &&
      Boolean(data.PGPORT) &&
      Boolean(data.PGUSER) &&
      Boolean(data.PGPASSWORD) &&
      Boolean(data.PGDATABASE);

    if (!hasDatabaseUrl && !hasPgParts) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "DATABASE_URL or all PG* variables are required (PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE)",
        path: ["DATABASE_URL"],
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Invalid environment variables:\n");
  parsed.error.issues.forEach((issue) => {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
