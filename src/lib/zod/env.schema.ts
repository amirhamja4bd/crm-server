import { z } from 'zod';

export const envSchema = z.object({
  // common
  NODE_ENV: z.string(),
  PORT: z.string().transform((val) => parseInt(val)),

  // database
  DATABASE_URL: z.string(),

  // JWT
  JWT_ALGORITHM: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // REFRESH TOKEN
  REFRESH_SECRET: z.string(),
  REFRESH_EXPIRES_IN: z.string(),

  // PDF
  API_BASE_URL: z.string(),
  WEB_APP_BASE_URL: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;
