import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("3001"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  JWT_SECRET: z.string().default("fallback-secret-key-for-dev"),
  JWT_REFRESH_SECRET: z.string().default("fallback-refresh-secret-for-dev"),
  REDIS_URL: z.string().url().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
