import { z } from 'zod';

export const imageFileSchema = z.object({
	uri: z.string(),
	type: z.string(),
	name: z.string(),
});
