import { z } from 'zod';
import { emojiFromEventSchema } from './emojis';

const feedEventTypes = z.enum([
	'following_spotList',
	'spotList',
	'spot',
	'spot_scribble_added',
]);

const commonFieldsFeedSchema = z.object({
	creator_image: z.string().nullable(),
	creator_name: z.string(),
	event_type: feedEventTypes,
	time_event_update: z.string(),
	emojis: z.array(emojiFromEventSchema),
	event_id: z.number(),
	tarot_color: z.array(z.string()),
});

export const singleFeedListSchema = commonFieldsFeedSchema.extend({
	followers_counter: z.number(),
	id: z.number(),
	is_following_spot_list: z.boolean(),
	list_creator_id: z.number(),
	name: z.string(),
	tags: z.array(z.string()).nullable(),
	view_counter: z.number(),
	event_type: z.union([z.literal('following_spotList'), z.literal('spotList')]),
	event_message: z.string(),
	user_id: z.number(),
});

export const singleFeedSpotSchema = commonFieldsFeedSchema.extend({
	city: z.string(),
	country: z.string(),
	id: z.number(),
	is_been_to: z.boolean(),
	is_like_spot: z.boolean(),
	is_saved: z.boolean(),
	name: z.string(),
	small_image: z.string().nullable(),
	spot_image: z.string().nullable(),
	spot_like_counter: z.number(),
	event_type: z.literal('spot'),
	event_message: z.string(),
	user_id: z.number(),
	google_place_location_id: z.string().nullable(),
	tripadvisor_location_id: z.number().nullable(),
});

export const singleFeedScribbleSchema = commonFieldsFeedSchema.extend({
	creator_user_id: z.number(),
	creator_username: z.string(),
	event_type: z.literal('spot_scribble_added'),
	id: z.number(),
	spot_id: z.number(),
	is_positive: z.boolean(),
	review_description: z.string().nullable(),
	spot_name: z.string(),
	time_event_update: z.string(),
	visit_date: z.string().nullable(),
	scribble_images: z.array(z.string()),
});

export const valuesToAddEmojiToFeedSchema = z.object({
	event_id: z.number(),
	code: z.string(),
	slug: z.string(),
});

export const valuesToDeleteEmojiFromFeedSchema = z.object({
	event_emoji_id: z.number(),
	variations_code_id: z.string().nullable(),
});

export const feedEventSchema = z.lazy(() =>
	z.union([
		singleFeedListSchema,
		singleFeedSpotSchema,
		singleFeedScribbleSchema,
	]),
);

export const getFeedEventsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	events: z.array(feedEventSchema),
	has_more_events: z.boolean(),
	new_offset: z.number(),
});
