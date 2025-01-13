import * as z from 'zod';

export const notificationTypes = z.enum([
	'viewed_profiles',
	'viewed_lists',
	'following_list_views',
	'following_list_saved',
	'update_lists',
	'saved_lists',
	'event_reactions',
	'follow_users',
	'scribble_reactions',
]);

export const commonsFieldsForNotificationSchema = z.object({
	notification_type: notificationTypes,
	category_header: z.string().nullable(),
});

export const scribbleReactionsNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.scribble_reactions),
		amount_reached: z.number(),
		scribble_id: z.number(),
		scribble_image: z.string().nullable(),
		scribble_description: z.string(),
		profile_image: z.string().nullable(),
		spot_id: z.number(),
		spot_name: z.string(),
	});

export const profileViewNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.viewed_profiles),
		amount_reached: z.number(),
		profile_id: z.number(),
		profile_image: z.string().nullable(),
	});

export const profileFollowNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.follow_users),
		profile_name: z.string(),
		profile_id: z.number(),
		profile_image: z.string().nullable(),
	});

export const followingListSavesNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.following_list_saved),
		profile_image: z.string().nullable(),
		profile_id: z.number(),
		profile_name: z.string(),
		spot_list_id: z.number(),
		spot_list_name: z.string(),
		amount_reached: z.number(),
	});

export const followingListUpdateNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.update_lists),
		profile_image: z.string().nullable(),
		profile_id: z.number(),
		profile_name: z.string(),
		spot_list_id: z.number(),
		spot_list_name: z.string(),
	});

export const followingListViewsNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.following_list_views),
		profile_image: z.string().nullable(),
		profile_id: z.number(),
		profile_name: z.string(),
		spot_list_id: z.number(),
		spot_list_name: z.string(),
		amount_reached: z.number().optional(),
	});

export const listViewsNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.viewed_lists),
		profile_image: z.string().nullable(),
		profile_id: z.number(),
		spot_list_id: z.number(),
		spot_list_name: z.string(),
		amount_reached: z.number().optional(),
	});

export const listSavedSingleNotificationSchema =
	commonsFieldsForNotificationSchema.extend({
		notification_type: z.literal(notificationTypes.Enum.saved_lists),
		profile_image: z.string().nullable(),
		profile_id: z.number(),
		profile_name: z.string(),
		spot_list_id: z.number(),
		spot_list_name: z.string(),
		save_amount: z.number().optional(),
	});

export const notificationSchema = z.lazy(() =>
	z.union([
		profileViewNotificationSchema,
		profileFollowNotificationSchema,
		followingListSavesNotificationSchema,
		followingListUpdateNotificationSchema,
		followingListViewsNotificationSchema,
		listViewsNotificationSchema,
		listSavedSingleNotificationSchema,
		scribbleReactionsNotificationSchema,
	]),
);

export const notificationsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	notifications: z.array(notificationSchema),
});

export const getNotificationTokensResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	tokens: z.array(z.string()),
});
