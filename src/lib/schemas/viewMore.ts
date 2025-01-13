import { z } from 'zod';
import {
	spotImagesAvailableSchema,
	spotStatusTagsEnum,
	userSpotSchema,
} from './spot';
import {
	getSpotsNearbyResponseSchema,
	personDiscoverySchema,
	popularSpotDiscoverySchema,
	spotListDiscoverySchema,
} from './discovery';

export const spotListViewMoreHomeSchema = z.object({
	city: z.string(),
	country: z.string(),
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

export const spotUserViewMoreSchema = userSpotSchema;

export const featuredSpotListInSpotSchema = spotListViewMoreHomeSchema;

export const viewMoreHomeResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_lists: z.array(spotListViewMoreHomeSchema),
});

export const viewMoreUserSpotsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots_user: z.array(spotUserViewMoreSchema),
});

export const viewMorePopularLists = z.object({
	code: z.number(),
	message: z.string(),
	popular_lists: z.array(spotListDiscoverySchema),
});

export const viewMorePopularPeople = z.object({
	code: z.number(),
	message: z.string(),
	popular_people: z.array(personDiscoverySchema),
});

export const viewMorePopularSpots = z.object({
	code: z.number(),
	message: z.string(),
	popular_spots: z.array(popularSpotDiscoverySchema),
});

export const viewMoreCategories = z.object({
	code: z.number(),
	message: z.string(),
	spot_lists: z.array(spotListDiscoverySchema),
});

export const viewMoreSpotsNearbyResponseSchema = getSpotsNearbyResponseSchema;
