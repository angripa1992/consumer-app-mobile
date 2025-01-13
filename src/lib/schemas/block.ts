import { z } from 'zod';

export const createUpdateBlockUserSchema = z.object({
	code: z.number(),
	message: z.string(),
});
