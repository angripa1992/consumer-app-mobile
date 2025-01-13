import { View } from 'react-native';
import { useCallback } from 'react';

import { useGetNotifications } from './useQueryNotifications';
import { useRefetchOnFocus } from './useRefetchOnFocus';

import TextElement from '@/UI/atoms/text/TextElement';
import ProfileNotificationCard from '@/UI/molecules/notifications/ProfileNotificationCard';
import FollowingListNotificationCard from '@/UI/molecules/notifications/FollowingListNotificationCard';

import type { Notification } from '../types/notifications';
import ScribblesReactionCard from '@/UI/molecules/notifications/ScribbleReactionNotificationCard';

const useNotification = () => {
	const {
		notifications,
		fetchNextPageNotifications,
		hasNextPageNotifications,
		isFetchingNextPageNotifications,
		isLoadingNotifications,
		refetchNotifications,
	} = useGetNotifications();

	useRefetchOnFocus(refetchNotifications);

	const renderTitleNotification = useCallback((title: string | null) => {
		if (!title) return null;

		return (
			<View className='justify-center mt-8 mb-2'>
				<TextElement className='text-base' designVariation='subtitle'>
					{title}
				</TextElement>
			</View>
		);
	}, []);

	const renderNotificationCard = useCallback((notification: Notification) => {
		if (notification.notification_type === 'viewed_profiles') {
			return (
				<ProfileNotificationCard
					profileImage={notification.profile_image}
					profileId={notification.profile_id}
					amountReached={notification.amount_reached}
					type={notification.notification_type}
				/>
			);
		}

		if (notification.notification_type === 'follow_users') {
			return (
				<ProfileNotificationCard
					profileImage={notification.profile_image}
					profileId={notification.profile_id}
					profileName={notification.profile_name}
					type={notification.notification_type}
				/>
			);
		}

		if (notification.notification_type === 'following_list_saved') {
			return (
				<FollowingListNotificationCard
					listName={notification.spot_list_name}
					type={notification.notification_type}
					followingProfileId={notification.profile_id}
					followingProfileImage={notification.profile_image}
					followingProfileName={notification.profile_name}
					saveAmount={notification.amount_reached}
					listId={notification.spot_list_id}
				/>
			);
		}

		if (notification.notification_type === 'update_lists') {
			return (
				<FollowingListNotificationCard
					listName={notification.spot_list_name}
					type={notification.notification_type}
					followingProfileId={notification.profile_id}
					followingProfileImage={notification.profile_image}
					followingProfileName={notification.profile_name}
					listId={notification.spot_list_id}
				/>
			);
		}

		if (notification.notification_type === 'following_list_views') {
			return (
				<FollowingListNotificationCard
					listName={notification.spot_list_name}
					type={notification.notification_type}
					followingProfileId={notification.profile_id}
					followingProfileImage={notification.profile_image}
					followingProfileName={notification.profile_name}
					viewsAmount={notification.amount_reached}
					listId={notification.spot_list_id}
				/>
			);
		}

		if (notification.notification_type === 'viewed_lists') {
			return (
				<FollowingListNotificationCard
					listName={notification.spot_list_name}
					type={notification.notification_type}
					profileId={notification.profile_id}
					profileImage={notification.profile_image}
					amountReached={notification.amount_reached}
					listId={notification.spot_list_id}
				/>
			);
		}

		if (notification.notification_type === 'saved_lists') {
			return (
				<FollowingListNotificationCard
					listName={notification.spot_list_name}
					type={notification.notification_type}
					profileId={notification.profile_id}
					profileName={notification.profile_name}
					profileImage={notification.profile_image}
					listId={notification.spot_list_id}
				/>
			);
		}

		if (notification.notification_type === 'scribble_reactions') {
			return (
				<ScribblesReactionCard
					amountReached={notification.amount_reached}
					profileImage={notification.profile_image}
					scribbleDescription={notification.scribble_description}
					spotId={notification.spot_id}
					spotName={notification.spot_name}
				/>
			);
		}

		return null;
	}, []);

	return {
		renderNotificationCard,
		renderTitleNotification,
		notifications,
		fetchNextPageNotifications,
		hasNextPageNotifications,
		isFetchingNextPageNotifications,
		isLoadingNotifications,
		refetchNotifications,
	};
};

export default useNotification;
