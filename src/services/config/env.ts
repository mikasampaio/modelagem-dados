import dotenv from "dotenv";

dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3333").transform(Number),
  NODE_ENV: z
    .enum(["development", "production", "test"], {
      error: "NODE_ENV must be one of 'development', 'production', or 'test'",
    })
    .default("development"),
  DATABASE_URL: z
    .string()
    .min(5, "DATABASE_URL must be at least 5 characters long"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.message);

  process.exit(1);
}

export const env = _env.data;
