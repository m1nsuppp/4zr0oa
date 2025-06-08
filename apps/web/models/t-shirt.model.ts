import { z } from 'zod';

export const tShirtSideEnum = z.enum(['front', 'back']);

export type TShirtSide = z.infer<typeof tShirtSideEnum>;

export const tShirtSchema = z.object({
  id: z.string(),
  side: tShirtSideEnum,
});

export type TShirt = z.infer<typeof tShirtSchema>;
