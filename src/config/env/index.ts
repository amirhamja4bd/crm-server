import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '../../lib/zod/env.schema';

export const validateEnv = () => {
  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    console.log(env.error);
    Logger.error(env.error.format());
    process.exit(1);
  }

  return env.data;
};

export const EnvConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [validateEnv],
});
