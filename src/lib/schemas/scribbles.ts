import { z } from 'zod';
import { emojiFromEventSchema } from './emojis';
import { imageFileSchema } from './image';

export const addOrEditScribbleFormValuesSchema = z.object({
	visit_date: z.coerce.date().nullable(),
	is_positive: z.boolean({
		message: 'selectExperience',
	}),
	review_description: z
		.string({
			required_error: 'required',
		})
		.min(1, {
			message: 'enterDescription',
		}),
	scribble_file_images: z.array(imageFileSchema).nullable().optional(),
});

export const addOrEditScribbleValuesSchema = z.object({
	user_id: z.number(),
	spot_id: z.number().nullable().optional(),
	review_description: z.string(),
	visit_date: z.string().nullable().optional(),
	is_positive: z.boolean(),
	google_place_location_id: z.string().nullable().optional(),
	scribble_file_images: z.array(imageFileSchema).nullable().optional(),
	scribble_images: z.array(z.string()).nullable().optional(),
});

export const scribbleSchema = z.object({
	creator_image: z.string().nullable(),
	creator_user_id: z.number(),
	creator_name: z.string(),
	creator_username: z.string(),
	emojis: z.array(emojiFromEventSchema),
	is_positive: z.boolean(),
	review_description: z.string(),
	visit_date: z.string().nullable(),
	event_id: z.number(),
	scribble_id: z.number(),
	scribble_images: z.array(z.string()),
});

export const singleScribbleWithSpotInfoSchema = scribbleSchema.extend({
	spot_id: z.number(),
	spot_name: z.string()
})

export const getAllUserScribblesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	scribbles: z.array(singleScribbleWithSpotInfoSchema)
})

export const getGeneralScribblesForSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	data_community_spot: z.array(scribbleSchema),
});

export const getFollowingScribblesForSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	data_following_spot: z.array(scribbleSchema),
});

export const getScribblesRecommendationsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	rest_of_reviews: z.number(),
	people_followed_counter: z.number(),
	scribbles_count: z.number(),
	user_images: z.array(z.string().nullable()),
	user_names: z.array(z.string()),
});

