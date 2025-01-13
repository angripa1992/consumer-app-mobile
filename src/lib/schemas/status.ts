import { z } from 'zod';

export const statusTagsSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
	icon: z.string().nullable(),
	color: z.string(),
});

export const statusTagsSchemaResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	status_tags: z.array(statusTagsSchema),
});

export const updateStatusTagsInSingleSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
});
