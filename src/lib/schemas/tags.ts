import { z } from 'zod';

export const tagsSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
	icon: z.string().nullable(),
});

export const tagsSchemaResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	tags: z.array(tagsSchema),
});
