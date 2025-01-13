import { z } from 'zod';

export const cuisineTypeSingleSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
});

export const getAllCuisineTypesSchemaResponse = z.object({
    code: z.number(),
    message: z.string(),
    cuisine_types: z.array(cuisineTypeSingleSchema),
})