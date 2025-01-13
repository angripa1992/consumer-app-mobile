import { z } from 'zod';

export const spotToSpotListPostSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	order: z.number(),
	spot_id: z.number(),
	spot_list_id: z.number(),
	updated_at: z.string(),
});

export const postSpotToSpotListResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_spot_list: spotToSpotListPostSchema,
});
