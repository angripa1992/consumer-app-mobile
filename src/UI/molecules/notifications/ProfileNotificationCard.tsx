import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { renderDescriptionForProfileNotifications } from '@/lib/helpers/notifications/messageNotifications';

import TarotProfileImage from '@/UI/organism/profile/tarot/TarotProfileImage';
import TextElement from '@/UI/atoms/text/TextElement';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import type { ProfileNotificationProps } from '@/lib/types/notifications';

const ProfileNotificationCard = ({
	profileId,
	profileImage,
	testID,
	...props
}: ProfileNotificationProps) => {
	const navigation = useNavigation<AppStackNavigationProp>();

	const renderDescription = renderDescriptionForProfileNotifications({
		profileId,
		profileImage,
		...props,
	});

	const handleRedirectToProfileView = () => {
		navigation.navigate('ProfileScreen', { userId: profileId });
	};

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={handleRedirectToProfileView}
			className='border-b  border-b-filter-border/20   flex-row py-3'
			style={{
				gap: 20,
			}}
		>
			<TarotProfileImage
				imageUrl={profileImage}
				width={100}
				height={100}
				customContainerStyles='m-0'
				testID={`image-${testID}`}
				imageSize='xs'
				contentFit='cover'
				contentPosition={'center'}
				tarotColors={null}
			/>

			<View className='flex-1 justify-center'>
				<TextElement
					textStyles={`text-white text-sm `}
					testID={`event-${testID}`}
				>
					{renderDescription}
				</TextElement>
			</View>
		</TouchableOpacity>
	);
};

export default ProfileNotificationCard;
