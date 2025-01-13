import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { renderDescriptionForListNotifications } from '@/lib/helpers/notifications/messageNotifications';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TarotProfileImage from '@/UI/organism/profile/tarot/TarotProfileImage';
import TextElement from '@/UI/atoms/text/TextElement';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import type { ListNotificationProps } from '@/lib/types/notifications';

const FollowingListNotificationCard = ({
	listId,
	listName,
	testID,
	...props
}: ListNotificationProps) => {
	const notificationType = props.type;
	const navigation = useNavigation<AppStackNavigationProp>();

	const isFollowingListNotification =
		notificationType === 'following_list_saved' ||
		notificationType === 'update_lists' ||
		notificationType === 'following_list_views';

	const renderDescription = renderDescriptionForListNotifications({
		listName,
		listId,
		...props,
	});

	const handleRedirectToProfileView = () => {
		if (isFollowingListNotification) {
			const { followingProfileId } = props;
			return navigation.navigate('ProfileScreen', {
				userId: followingProfileId,
			});
		}

		const { profileId } = props;

		return navigation.navigate('ProfileScreen', { userId: profileId });
	};

	const handleRedirectToListView = () => {
		navigation.navigate('SingleList', { spotListId: listId });
	};

	const renderProfileImage = () => {
		if (isFollowingListNotification) {
			const { followingProfileImage } = props;
			return followingProfileImage;
		}

		const { profileImage } = props;

		return profileImage;
	};

	return (
		<View
			className='border-b  border-b-filter-border/20   flex-row py-3'
			style={{
				gap: 20,
			}}
		>
			<ButtonPrimary
				onPress={handleRedirectToProfileView}
				buttonStyles='w-[25px] h-[25px] !p-0'
				designVariation='custom'
				isReactNodeContent
				hitSlop={10}
			>
				<TarotProfileImage
					imageUrl={renderProfileImage()}
					width={100}
					height={100}
					customContainerStyles='m-0'
					testID={`image-${testID}`}
					imageSize='xs'
					contentFit='cover'
					contentPosition={'center'}
					tarotColors={null}
				/>
			</ButtonPrimary>
			<TouchableOpacity
				onPress={handleRedirectToListView}
				activeOpacity={1}
				className='flex-1 justify-center'
			>
				<TextElement
					textStyles={`text-white text-sm`}
					testID={`event-${testID}`}
				>
					{renderDescription}
				</TextElement>
			</TouchableOpacity>
		</View>
	);
};

export default FollowingListNotificationCard;
