import { z } from 'zod';

// schemas
export const LoginTokenPayloadSchema = z.object({ id: z.string() });
export const RefreshTokenPayloadSchema = z.object({
  id: z.string(),
});

// types
export type LoginTokenPayload = z.infer<typeof LoginTokenPayloadSchema>;
export type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>;
