import { z } from 'zod';

export const followResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
});
