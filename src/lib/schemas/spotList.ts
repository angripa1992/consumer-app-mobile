import { z } from 'zod';
import { spotImagesAvailableSchema, spotSingleToSpotListSchema } from './spot';
import { featuredSpotListInSpotSchema } from './viewMore';

export const spotListUserHomeSchema = z.object({
	city: z.string(),
	created_at: z.string(),
	creator: z.string(),
	followers_spot_list_counter: z.number(),
	id: z.number(),
	is_deleted: z.boolean(),
	is_private: z.boolean(),
	name: z.string(),
	spot_counter: z.number(),
	spot_images_available: z.array(spotImagesAvailableSchema).nullable(),
	updated_at: z.string(),
	user_id: z.number(),
	view_counter: z.number(),
	is_following: z.boolean().optional(),
});

export const spotListUserHomeCategoriesSchema = z.object({
	my_list: z.array(spotListUserHomeSchema),
	nearby_spot_list: z.array(spotListUserHomeSchema),
	popular_list: z.array(spotListUserHomeSchema),
	liked_list: z.array(spotListUserHomeSchema),
});

export const spotListSingleSchema = z.object({
	city: z.string(),
	country: z.string(),
	created_at: z.string(),
	creator: z.string(),
	description: z.string().nullable(),
	follower_users: z.number(),
	id: z.number(),
	image_url: z.string().nullable().optional(),
	is_deleted: z.boolean(),
	name: z.string(),
	spot_counter: z.number(),
	tags: z.array(z.string()),
	updated_at: z.string(),
	user_id: z.number(),
	view_counter: z.number(),
	spot_images_available: z
		.array(spotImagesAvailableSchema)
		.nullable()
		.optional(),
});

export const spotListSingleWithTags = spotListSingleSchema.extend({
	tags: z.array(z.string()).nullable(),
});

export const spotListToReorderSchema = z.object({
	id: z.number(),
	created_at: z.string(),
	is_deleted: z.boolean(),
	order: z.number(),
	updated_at: z.string(),
});

export const spotListSinglePageSchema = z.object({
	city: z.string(),
	created_at: z.string(),
	creator: z.string(),
	description: z.string().nullable(),
	id: z.number(),
	followers_counter: z.number(),
	is_deleted: z.boolean(),
	is_private: z.boolean(),
	name: z.string(),
	spot_counter: z.number(),
	tags: z.array(z.string()),
	updated_at: z.string(),
	user_id: z.number(),
	view_counter: z.number(),
	is_following: z.boolean().optional(),
});

export const spotListSingleResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_list: spotListSingleSchema,
});

export const spotListsHomeResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	user_categories: spotListUserHomeCategoriesSchema,
});

export const spotsFromSpotListSinglePageSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots: z.array(spotSingleToSpotListSchema),
});

export const spotListSinglePageResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_list: spotListSinglePageSchema,
});

export const reorderSpotListResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_spot_list: z.array(spotListToReorderSchema),
});

export const createSpotListSchema = z.object({
	user_id: z.number().int().min(1).optional(),
	name: z
		.string()
		.min(1, 'listNameCannotBeEmpty')
		.max(30, 'listNameNo30Longer'),
	city: z.string().min(1, 'countryCannotEmpty'),
	tags: z.array(z.number()).nullable().optional(),
	description: z.string().nullable().optional(),
	image_url: z.string().optional().nullable(),
	is_private: z.coerce.number().optional().nullable(),
});

export const updateSpotListSchema = z.object({
	user_id: z.number().int().min(1).optional(),
	name: z
		.string()
		.min(1, 'listNameCannotBeEmpty')
		.max(30, 'listNameNo30Longer')
		.optional(),
	city: z.string().optional(),
	tags: z.array(z.number()).nullable().optional(),
	description: z.string().nullable().optional(),
	image_url: z.string().optional().nullable(),
	is_private: z.coerce.number().optional().nullable(),
});

export const addSpotFromDBToSpotListSchema = z.object({
	spot_id: z.number(),
	spot_list_id: z.number(),
	spotType: z.enum(['db']),
});

export const addSpotFromGooglePlacesToSpotListSchema = z.object({
	address: z.string().nullable(),
	city: z.string(),
	country: z.string(),
	name: z.string(),
	google_place_location_id: z.string(),
	spot_id: z.null(),
	spot_list_id: z.number(),
	spotType: z.enum(['googlePlaces']),
});

export const relevantSpotListSchema = z.object({
	city: z.string(),
	country: z.string(),
	created_at: z.string(),
	description: z.string().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	is_private: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
	user_id: z.number(),
	view_counter: z.number(),
	followers_counter: z.number(),
	spots_counter: z.number(),
	creator: z.string(),
});

export const getRelevantSpotListSchemaResponse = z.object({
	code: z.number(),
	message: z.string(),
	relevant_spot_lists: z.array(relevantSpotListSchema),
});

export const postSingleListData = z.object({
	city: z.string(),
	created_at: z.string(),
	creator: z.string(),
	description: z.string().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	is_private: z.boolean(),
	name: z.string(),
	tags: z.array(z.string()),
	updated_at: z.string(),
	user_id: z.number(),
	view_counter: z.number().nullable(),
});

export const postSingleListDataResponse = z.object({
	code: z.number(),
	message: z.string(),
	spot_list: postSingleListData,
});

export const spotListDataEvent = z.object({
	list_id: z.number(),
	list_name: z.string(),
	list_creator: z.string(),
});

export const getGeneralFeaturedListsFromSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	featured_spot_list: z.array(featuredSpotListInSpotSchema),
});

export const getFollowingFeaturedListsFromSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	following_spot_list: z.array(featuredSpotListInSpotSchema),
});
