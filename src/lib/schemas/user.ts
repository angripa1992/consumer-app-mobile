import { z } from 'zod';
import { refineWebsiteUrl } from './general';
import { spotImagesAvailableSchema } from './spot';
import { noSpacesRegex } from '../utils/constants';

export const websiteUserSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
	url: z.string().nullable(),
	user_id: z.number(),
});

export const userFollowerOrFollowingSchema = z.object({
	id: z.number(),
	name: z.string(),
	profile_image: z.string().nullable(),
	is_following: z.boolean(),
	is_follower: z.boolean(),
});

export const userSchema = z.object({
	biography: z.string().nullable(),
	city: z.string(),
	created_at: z.string(),
	email: z.string(),
	spot_list_counter: z.number(),
	followers_counter: z.number(),
	following_users_counter: z.number(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	profile_image_url: z.string().nullable(),
	updated_at: z.string(),
	user_type: z.string(),
	username: z.string(),
	website_user: z.array(websiteUserSchema),
	is_onboarding_complete: z.boolean(),
});

export const userSingleSchema = userSchema.extend({
	city: z.string().default(''),
	is_blocked_user: z.boolean(),
	is_following: z.boolean().optional(),
	tarot_code: z.string().nullable(),
	tarot_color: z.array(z.string()).nullable(),
	is_creator: z.boolean().nullish(),
});

export const userSignInSchema = z.object({
	email: z.string().email(),
	name: z.string(),
	username: z.string(),
});

export const userSignInDecodeTokenSchema = z.object({
	aud: z.string(),
	email: z.string(),
	email_verified: z.boolean(),
	exp: z.number(),
	iat: z.number(),
	iss: z.string(),
	name: z.string(),
	nickname: z.string(),
	nonce: z.string(),
	picture: z.string(),
	sid: z.string(),
	sub: z.string(),
	updated_at: z.coerce.date(),
	country: z.string(),
	city: z.string(),
});

export const userSignInResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	user: z.any(),
});

export const userGetSingleResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	user: userSingleSchema,
});

export const putUserValidationsSchema = z.object({
	username: z
		.string()
		.trim()
		.nonempty('usernameCannotEmpty')
		.regex(noSpacesRegex, 'usernameCannotContainSpaces'),
	name: z.string().trim().nonempty('nameCannotEmpty'),
	city: z.string().trim().nullable(),
	tarot: z.string().nullable(),
	websiteOne: z.string().nullable(),
	websiteTwo: z.string().nullable(),
	websiteThree: z.string().nullable(),
	biography: z.string().trim().nullable(),
});

export const deleteUserResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
});

export const getSingleRelevantUser = z.object({
	biography: z.string().nullable(),
	city: z.string().nullable(),
	country: z.string().nullable(),
	created_at: z.string(),
	email: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	profile_image_url: z.string().nullable(),
	updated_at: z.string(),
	user_type: z.string(),
	username: z.string(),
});

export const getAllRelevantUsersResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	relevant_profiles: z.array(getSingleRelevantUser),
});

export const userOnboardingResponseSchema = z.object({
	biography: z.string().nullable(),
	city: z.string().nullable(),
	country: z.string().nullable(),
	created_at: z.string(),
	email: z.string().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	is_onboarding_complete: z.boolean(),
	name: z.string(),
	profile_image_url: z.string().nullable(),
	spot_list: z.array(z.any()).nullable(),
	tags: z.array(z.string()).nullable(),
	updated_at: z.string(),
	user_type: z.string(),
	username: z.string(),
	website_user: z.array(websiteUserSchema).nullable(),
});

export const postUserPreferencesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	user: userOnboardingResponseSchema,
});

const spotAndSpotListRelationshipSchema = z.object({
	spot_id: z.number(),
	spot_spot_list_id: z.number(),
});

export const spotListUserSchema = z.object({
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
	spot_and_spot_list_relationship: z.array(spotAndSpotListRelationshipSchema),
});
export const userListsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	spot_lists: z.array(spotListUserSchema),
});

export const userLikedListsResponseSchema = userListsResponseSchema;

export const followUsersResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	users: z.array(userFollowerOrFollowingSchema),
});

export const userDataEvent = z.object({
	user_id: z.number(),
	user_name: z.string(),
});

export const appVersionSchema = z.object({
	min_version: z.string(),
	latest_recommended_version: z.string(),
});

export const appVersionResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	app_version: appVersionSchema,
});
