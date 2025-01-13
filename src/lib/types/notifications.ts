import { z } from 'zod';
import {
	notificationSchema,
	notificationsResponseSchema,
} from '../schemas/notifications';

export type NotificationsResponse = z.infer<typeof notificationsResponseSchema>;

export type Notification = z.infer<typeof notificationSchema>;

// notification profile card

interface ProfileNotificationCardBase {
	testID?: string;
	profileImage: string | null;
	profileId: number;
}

interface ProfileViewNotification extends ProfileNotificationCardBase {
	type: 'viewed_profiles';
	amountReached: number;
}

interface ProfileFollowNotification extends ProfileNotificationCardBase {
	type: 'follow_users';
	profileName: string;
}

export type ProfileNotificationProps =
	| ProfileViewNotification
	| ProfileFollowNotification;

// notification list card

interface NotificationListCardBase {
	listName: string;
	listId: number;
	testID?: string;
}

interface FollowingListSavesNotification extends NotificationListCardBase {
	type: 'following_list_saved';
	followingProfileImage: string | null;
	followingProfileId: number;
	followingProfileName: string;
	saveAmount: number;
}

interface FollowingListUpdateNotification extends NotificationListCardBase {
	type: 'update_lists';
	followingProfileImage: string | null;
	followingProfileId: number;
	followingProfileName: string;
}

interface FollowingListViewsNotification extends NotificationListCardBase {
	type: 'following_list_views';
	followingProfileImage: string | null;
	followingProfileId: number;
	followingProfileName: string;
	viewsAmount: number | undefined;
}

interface ListViewsNotification extends NotificationListCardBase {
	type: 'viewed_lists';
	profileImage: string | null;
	profileId: number;
	amountReached: number | undefined;
}

interface ListSavedSingleNotification extends NotificationListCardBase {
	type: 'saved_lists';
	profileImage: string | null;
	profileId: number;
	profileName: string;
	saveAmount?: number;
}

export type ListNotificationProps =
	| FollowingListSavesNotification
	| FollowingListUpdateNotification
	| FollowingListViewsNotification
	| ListViewsNotification
	| ListSavedSingleNotification;
