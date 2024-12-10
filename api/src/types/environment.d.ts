import z from 'zod';

type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    type ProcessEnv = EnvSchemaType;
  }
}
