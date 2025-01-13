import { z } from 'zod';
import { refineWebsiteUrl } from './general';
import { emojiFromEventSchema } from './emojis';

export const spotStatusTagsEnum = z.enum(['Been to', 'Saved', 'Favorites']);

export const statusTagsSchema = z.object({
	is_been_to: z.boolean(),
	is_like_spot: z.boolean(),
	is_saved: z.boolean(),
});

export const orderSchema = z.object({
	color: z.string(),
	created_at: z.string(),
	icon: z.string().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	order_supplier_id: z.number(),
	spot_id: z.number(),
	updated_at: z.string(),
	url_mobile: z.string().nullable(),
	url_web: z.string().nullable(),
});
export const statusTagsToAddInSpot = z.object({
	is_saved: z.boolean().optional(),
	is_like_spot: z.boolean().optional(),
	is_been_to: z.boolean().optional(),
});

export const addStatusTagFromGooglePlacesSchema = statusTagsToAddInSpot.extend({
	spot_id: z.null(),
	google_place_location_id: z.string(),
	name: z.string(),
	address: z.string().nullable(),
	city: z.string(),
	country: z.string(),
	state: z.string().nullable(),
	spotType: z.enum(['googlePlaces']),
});

export const addStatusTagFromDBSchema = statusTagsToAddInSpot.extend({
	spot_id: z.number(),
	google_place_location_id: z.string().nullable(),
	spotType: z.enum(['db']),
});

export const spotUser = z.object({
	address: z.string().nullable().optional(),
	city: z.string().optional(),
	city_id: z.number().optional(),
	created_at: z.string().optional(),
	has_order_mobile: z.boolean().optional(),
	has_order_web: z.boolean().optional(),
	has_reservation_mobile: z.boolean().optional(),
	has_reservation_web: z.boolean().optional(),
	id: z.number().optional(),
	is_deleted: z.boolean(),
	klikit_id: z.number().optional().nullable(),
	name: z.string().optional(),
	order_suppliers: z.array(orderSchema).optional(),
	reservation_mobile_phone: z.string().optional().nullable(),
	reservation_web_url: z.string().optional().nullable(),
	tripadvisor_location_id: z.string().nullable(),
	updated_at: z.string().optional(),
	website_option_one: z.string().optional().nullable(),
	website_option_two: z.string().optional().nullable(),
	website_option_three: z.string().optional().nullable(),
	spot_spot_list_id: z.number().optional(),
	small_image: z.string().nullable(),
	spot_image: z.string().nullable(),
});

export const userSpotListSchema = z.object({
	city: z.string(),
	country: z.string(),
	created_at: z.string(),
	creator: z.string(),
	description: z.string().nullable(),
	followers_spot_list_counter: z.number(),
	id: z.number(),
	is_deleted: z.boolean(),
	is_private: z.boolean(),
	name: z.string(),
	spots: z.array(spotUser).optional(),
	spot_counter: z.number(),
	tags: z.array(z.string()).nullable(),
	updated_at: z.string(),
	view_counter: z.number(),
});

export const followedSpotSchema = z.object({
	...userSpotListSchema.shape,
	user_id: z.number(),
});

export const weekdayTextSchema = z.object({
	weekdays: z.string(),
	date: z.string(),
});

export const followerUserSpotSchema = z.object({
	city: z.string(),
	country: z.string(),
	created_at: z.string(),
	description: z.string().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
	view_counter: z.number(),
});

export const spotSingleToSpotListSchema = z.object({
	coordinates: z.string().nullable(),
	spot_spot_list_id: z.number(),
	order: z.number(),
	owner_status_tags: statusTagsSchema,
	viewer_status_tags: statusTagsSchema,
	spot_like_counter: z.number(),
	small_image: z.string().nullable(),
	name: z.string(),
	spot_id: z.number(),
	google_place_location_id: z.string().nullable(),
	tripadvisor_location_id: z.number().nullable(),
	scribbles_count: z.number(),
});

export const spotSingleToAdminSchema = z.object({
	address: z.string().nullable(),
	created_at: z.string(),
	has_order_mobile: z.boolean().nullable(),
	has_order_web: z.boolean().nullable(),
	has_reservation_mobile: z.boolean().nullable(),
	has_reservation_web: z.boolean().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	order_suppliers: z.array(orderSchema).optional(),
	reservation_mobile_phone: z.string().nullable(),
	reservation_web_url: z.string().nullable(),
	tripadvisor_location_id: z.string(),
	updated_at: z.string(),
	website_option_one: z.string().nullable(),
	website_option_two: z.string().nullable(),
	website_option_three: z.string().nullable(),
});

export const spotSingleToUserPageSchema = z.object({
	address: z.string().nullable(),
	atmosphere_rating: z.number().nullable(),
	city: z.string(),
	city_id: z.number(),
	country: z.string(),
	country_id: z.number(),
	created_at: z.string(),
	cuisine: z.array(z.string()),
	currency: z.string().nullable(),
	description: z.string().nullable(),
	email: z.string().nullable(),
	food_rating: z.number().nullable(),
	spot_like_counter: z.number(),
	has_order_mobile: z.boolean(),
	has_order_web: z.boolean(),
	has_reservation_mobile: z.boolean(),
	has_reservation_web: z.boolean(),
	id: z.number(),
	is_deleted: z.boolean(),
	klikit_id: z.number().nullable(),
	latitude: z.string().nullable(),
	longitude: z.string().nullable(),
	name: z.string(),
	order_suppliers: z.array(orderSchema),
	phone: z.string().nullable(),
	price_end: z.string().nullable(),
	price_init: z.string().nullable(),
	price_level: z.string().nullable(),
	reservation_mobile_phone: z.string().nullable(),
	reservation_web_url: z.string().nullable(),

	service_rating: z.number().nullable(),
	small_image: z.string().nullable(),
	spot_image: z.string().nullable(),

	spot_images: z.array(z.string()),

	tripadvisor_location_id: z.number().nullable(),
	google_place_location_id: z.string().nullable(),
	updated_at: z.string(),
	value_rating: z.number().nullable(),
	viewer_status_tags: statusTagsSchema,
	website_option_one: z.string().nullable(),
	website_option_three: z.string().nullable(),
	website_option_two: z.string().nullable(),
	weekday_text: z.array(weekdayTextSchema),
});

export const spotSingleToUserPageResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot: spotSingleToUserPageSchema,
});

export const spotSingleFromAllSpotsSchema = spotSingleToAdminSchema.extend({
	city_id: z.number(),
	needs_edition: z.boolean(),
});

export const getAllSpotsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots: z.array(spotSingleFromAllSpotsSchema),
});

export const spotSearchCandidateSchema = z.object({
	address: z.string().nullable(),
	city: z.string(),
	country: z.string(),
	google_place_location_id: z.string().nullable(),
	id: z.number().nullable(),
	name: z.string(),
	relationship_with_spot_list: z.boolean(),
	small_image: z.string().nullable(),
	spot_image: z.string().nullable(),
	viewer_status_tags: statusTagsSchema,
	spot_spot_list_id: z.number().nullable(),
	state: z.string().nullable(),
	scribbles_count: z.number(),
});

export const spotCandidateToSaveSchema = spotSearchCandidateSchema.omit({
	relationship_with_spot_list: true,
	viewer_status_tags: true,
	spot_spot_list_id: true,
	scribbles_count: true,
});

export const getCandidateSpotsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots: z.array(spotSearchCandidateSchema),
	api_spots: z.boolean().optional(),
});

export const deleteSpotFromSpotListResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
});

export const getDetailsSpotCandidateSchema = z.object({
	address: z.string().nullable(),
	atmosphere_rating: z.number().nullable(),
	country: z.string(),
	city: z.string(),
	cuisine: z.array(z.string()).nullable(),
	description: z.string().nullable(),
	food_rating: z.number().nullable(),
	general_rating: z.number().nullable().optional(),
	id: z.number().nullable(),
	latitude: z.string().nullable(),
	longitude: z.string().nullable(),
	name: z.string(),
	phone: z.string().nullable().optional(),
	price_level: z.string().nullable().optional(),
	google_place_location_id: z.string().nullable(),
	service_rating: z.number().nullable(),
	value_rating: z.number().nullable(),
	weekday_text: z.array(weekdayTextSchema).optional().nullable(),
	viewer_status_tags: statusTagsSchema,
	reviews: z.number().nullable().optional(),
});

export const getDetailsSpotCandidateResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot: getDetailsSpotCandidateSchema,
});

export const searchCandidateSpotValidationSchema = z.object({
	spotName: z.string().nonempty('searchCannotEmpty'),
});

export const getAllAvailableSpotsSchema = z.object({
	id: z.number(),
	name: z.string(),
	relationship_with_spot_list: z.boolean(),
	small_image: z.string().nullable(),
	spot_image: z.string().nullable(),
	tripadvisor_location_id: z.number().nullable(),
	viewer_status_tags: statusTagsSchema,
	spot_like_counter: z.number(),
	spot_spot_list_id: z.number().nullable(),
	scribbles_count: z.number(),
});

export const getAllAvailableSpotsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spots: z.array(getAllAvailableSpotsSchema),
});

export const userSpotSchema = z.object({
	owner_status_tags: statusTagsSchema,
	viewer_status_tags: statusTagsSchema,
	google_place_location_id: z.string().nullable(),
	spot_image: z.string().nullable(),
	spot_like_counter: z.number(),
	scribbles_count: z.number(),
	small_image: z.string().nullable(),
	name: z.string(),
	id: z.number(),
});

export const categoriesUserSpotsSchema = z.object({
	visited_spots: z.array(userSpotSchema),
	liked_spots: z.array(userSpotSchema),
});

export const getAllUserSpotSchemaResponse = z.object({
	code: z.number(),
	message: z.string(),
	spots_user: categoriesUserSpotsSchema,
});

export const addSpotToSpotListEventSchema = z.object({
	spot_id: z.union([z.number(), z.string()]).nullable().optional(),
	spot_name: z.string(),
	spot_list_id: z.number(),
});

export const addStatusTagsEventSchema = z.object({
	spot_id: z.union([z.string(), z.number()]).nullable(),
	spot_name: z.string(),
	status_tag: spotStatusTagsEnum,
});

export const imageSizeEnum = z.enum(['small', 'medium', 'large']);

export const spotImageValuesToSendSchema = z.object({
	tripadvisor_location_id: z.number().optional(),
	spot_google_places_id: z.string().optional(),
	google_image_name: z.string().optional(),
	image_size: imageSizeEnum,
});

export const spotImageResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_image: z.string().nullable(),
});

export const createBasicSpotFormSchema = z.object({
	name: z.string(),
	city: z.string(),
});

export const authorizedSpotValuesToSendSchema = z.object({
	city_id: z.number(),
	name: z.string(),
	address: z.string().nullable().optional(),
	email: z.string().email().nullable().optional(),
	phone: z.string().nullable().optional(),
	website: refineWebsiteUrl.optional(),
	description: z.string().nullable().optional(),
	price_init: z.coerce.number().nullable().optional(),
	price_end: z.coerce.number().nullable().optional(),
	cuisine: z.string().nullable().optional().optional(),
	food_rating: z.coerce.number().nullable().optional(),
	service_rating: z.coerce.number().nullable().optional(),
	atmosphere_rating: z.coerce.number().nullable().optional(),
	weekday_text: z.string().nullable().optional(),
	spot_image: z
		.object({
			uri: z.string(),
			type: z.string(),
			name: z.string(),
		})
		.nullable()
		.optional(),
	spot_status: z.enum(['new', 'approved', 'rejected', 'deleted']),
});

export const spotImagesAvailableSchema = z.object({
	small_image: z.string().nullable(),
	tripadvisor_location_id: z.number().nullable(),
	google_place_location_id: z.string().nullable(),
});

export const spotInteractionsResponseSchema = z.object({
	code: z.number(),
	likes_count: z.number(),
	lists_count: z.number(),
	message: z.string(),
	scribbles_count: z.number(),
});

export const likesForSpotSchema = z.object({
	creator_image: z.string().nullable(),
	creator_name: z.string(),
	creator_username: z.string(),
	emojis: z.array(emojiFromEventSchema),
	event_created_at: z.string(),
	event_id: z.number(),
	creator_user_id: z.number(),
});

export const getGeneralLikesForSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	data_community_spot: z.array(likesForSpotSchema),
});

export const getFollowingLikesForSpotResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	data_following_spot: z.array(likesForSpotSchema),
});

export const hasRelationshipSpotAndListRequestBody = z.object({
	spot_id: z.number().optional(),
	spot_list_id: z.number(),
	google_place_location_id: z.string().optional(),
});

export const postRelationshipSpotAndListResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	relationship_with_spot_list: z.boolean(),
	spot_spot_list_id: z.number().nullable(),
});
