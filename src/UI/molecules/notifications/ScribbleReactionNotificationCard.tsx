import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { i18nInstance } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';

import TarotProfileImage from '@/UI/organism/profile/tarot/TarotProfileImage';
import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import { renderDescriptionForScribbleNotification } from '@/lib/helpers/notifications/messageNotifications';

interface ScribblesReactionProps {
	scribbleDescription: string;
	spotId: number;
	spotName: string;
	profileImage: string | null;
	amountReached: number;
	testID?: string;
}

const ScribblesReactionCard = ({
	scribbleDescription,
	spotId,
	spotName,
	profileImage,
	testID,
	amountReached,
}: ScribblesReactionProps) => {
	const { userId } = useAppStore(
		useShallow((state) => ({
			userId: state.user?.id,
		})),
	);

	const navigation = useNavigation<AppStackNavigationProp>();

	const handleRedirectToScribble = () => {
		navigation.navigate('ScribblesForSpot', { spotId });
	};

	const handleRedirectToSpot = () => {
		navigation.navigate('SingleSpot', { spotId });
	};

	const handleRedirectToProfileView = () => {
		if (!userId) return;
		navigation.navigate('ProfileScreen', { userId });
	};

	const renderDescription = renderDescriptionForScribbleNotification({
		scribbleDescription,
		spotName,
		amountReached,
		handleRedirectToSpot,
	});

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
			</ButtonPrimary>
			<TouchableOpacity
				onPress={handleRedirectToScribble}
				activeOpacity={1}
				className='flex-1 justify-center'
			>
				<TextElement
					textStyles={`text-white text-sm `}
					testID={`event-${testID}`}
				>
					{renderDescription}
				</TextElement>
			</TouchableOpacity>
		</View>
	);
};

export default ScribblesReactionCard;
