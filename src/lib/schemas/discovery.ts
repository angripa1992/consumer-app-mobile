import { z } from 'zod';
import { spotImagesAvailableSchema, statusTagsSchema } from './spot';

export const discoveryFilterFormSchema = z.object({
	areas: z.array(z.string()),
	tags: z.array(z.string()),
	searchQuery: z.string(),
});

export const locationFilterValidationSchema = z.object({
	city: z.string(),
});

export const locationSearchQuerySchema = z.object({
	searchQuery: z.string(),
});

export const popularSpotDiscoverySchema = z.object({
	spot_like_counter: z.number(),
	id: z.number(),
	name: z.string(),
	small_image: z.string().nullable(),
	spot_image: z.string().nullable(),
	viewer_status_tags: statusTagsSchema,
	scribbles_count: z.number(),
	google_place_location_id: z.string().nullable(),
});

export const spotDiscoverySchema = popularSpotDiscoverySchema.extend({
	id: z.number().nullable(),
	address: z.string(),
	city: z.string(),
	country: z.string(),
	google_place_location_id: z.string().nullable(),
	spot_like_counter: z.number(),
	state: z.string().nullable(),
	scribbles_count: z.number(),
});

export const personDiscoverySchema = z.object({
	id: z.number(),
	is_following: z.boolean().optional(),
	name: z.string(),
	profile_image: z.string().nullable(),
});

export const spotListDiscoverySchema = z.object({
	city: z.string(),
	creator: z.string(),
	followers_spot_list_counter: z.number(),
	id: z.number(),
	name: z.string(),
	spot_counter: z.number(),
	spot_images_available: z.array(spotImagesAvailableSchema).nullable(),
	user_id: z.number(),
	view_counter: z.number(),
	is_following: z.boolean().optional(),
});

export const spotNearbySchema = z.object({
	id: z.number().nullable(),
	address: z.string(),
	city: z.string(),
	country: z.string(),
	name: z.string(),
	google_place_location_id: z.string().nullable(),
	viewer_status_tags: statusTagsSchema,
	state: z.string().nullable(),
	scribbles_count: z.number(),
	tripadvisor_location_id: z.number().nullable(),
	small_image: z.string().nullable(),
});

export const categoriesDiscoverySchema = z.record(
	z.array(spotListDiscoverySchema),
);

export const discoveriesSchema = z.object({
	popular_lists: z.array(spotListDiscoverySchema),
	popular_people: z.array(personDiscoverySchema),
	popular_spots: z.array(popularSpotDiscoverySchema),
});

export const postDiscoveryResultsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	discoveries: discoveriesSchema,
});

export const postDiscoveryCategoriesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	categories: categoriesDiscoverySchema,
});

export const postDiscoveryListsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_lists: z.array(spotListDiscoverySchema),
});

export const getSpotsNearbyResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots: z.array(spotNearbySchema),
});

export const postDiscoverySpotsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots: z.array(spotDiscoverySchema),
	api_spots: z.boolean().optional(),
});

export const postDiscoveryPeopleSchema = z.object({
	code: z.number(),
	message: z.string(),
	peoples: z.array(personDiscoverySchema),
});
