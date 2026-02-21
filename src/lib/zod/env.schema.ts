import { z } from 'zod';

export const envSchema = z.object({
  // common
  NODE_ENV: z.string(),
  PORT: z.string().transform((val) => parseInt(val)),

  // database
  DATABASE_URL: z.string(),

  // JWT
  JWT_ALGORITHM: z.string().default('HS256'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('2h'),

  // REFRESH TOKEN
  REFRESH_SECRET: z.string().min(32),
  REFRESH_EXPIRES_IN: z.string().default('1d'),

  // PDF
  API_BASE_URL: z.string(),
  WEB_APP_BASE_URL: z.string(),
});

export type EnvConfig = z.infer<typeof envSchema>;
