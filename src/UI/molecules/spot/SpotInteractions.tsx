import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';
import { useGetSpotInteractions } from '@/lib/hooks/UseQuerySpot';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import TextElement from '@/UI/atoms/text/TextElement';
import HeartIcon from '@/UI/assets/svg/HeartIcon';
import ScribbleIcon from '@/UI/assets/svg/ScribbleIcon';
import ListsIcon from '@/UI/assets/svg/ListsIcon';
import Spinner from '@/UI/atoms/spinner/Spinner';

import type { SpotScreenRouteProp } from '@/lib/types/tabScreenParams';
import type {
	TypeSpotInteractionsDataToShow,
	TypeSpotInteractionsTitle,
} from '@/lib/types/spot';

interface SpotInteractionsProps {
	spotId?: number;
	googlePlacesId?: string;
	onPressNavigateTo?: () => void;
}

const iconSize = 24;
const iconColor = '#757575';

const SpotInteractions = ({
	spotId,
	onPressNavigateTo,
	googlePlacesId,
}: SpotInteractionsProps) => {
	const navigation = useNavigation<SpotScreenRouteProp>();

	const {
		spotInteractions,
		isLoadingSpotInteractions,
		refetchSpotInteractions,
		isErrorSpotInteractions,
	} = useGetSpotInteractions(spotId, googlePlacesId);

	useRefetchOnFocus(refetchSpotInteractions);

	const spotInteractionsDataToShow =
		useMemo((): TypeSpotInteractionsDataToShow[] => {
			if (spotInteractions) {
				return [
					{
						title: 'likes',
						count: spotInteractions.likes_count,
					},
					{
						title: 'scribbles',
						count: spotInteractions.scribbles_count,
					},
					{
						title: 'lists',
						count: spotInteractions.lists_count,
					},
				];
			}

			return [];
		}, [spotInteractions]);

	const navigateTo = (title: TypeSpotInteractionsTitle) => {
		if (onPressNavigateTo) {
			onPressNavigateTo();
		}

		if (spotId) {
			if (title === 'likes') {
				navigation.navigate('LikesForSpot', { spotId });
				return;
			}
			if (title === 'scribbles') {
				navigation.navigate('ScribblesForSpot', { spotId });
				return;
			}

			navigation.navigate('ListsForSpot', { spotId });
		}
		if (googlePlacesId) {
			if (title === 'likes') {
				navigation.navigate('LikesForSpot', { googlePlacesId });
				return;
			}
			if (title === 'scribbles') {
				navigation.navigate('ScribblesForSpot', { googlePlacesId });
				return;
			}

			navigation.navigate('ListsForSpot', { googlePlacesId });
		}
	};

	const renderIcon = (title: TypeSpotInteractionsTitle) => {
		if (title === 'likes') {
			return <HeartIcon color={iconColor} width={iconSize} height={iconSize} />;
		}

		if (title === 'scribbles') {
			return (
				<ScribbleIcon color={iconColor} width={iconSize} height={iconSize} />
			);
		}

		return <ListsIcon color={iconColor} width={iconSize} height={iconSize} />;
	};

	if (isLoadingSpotInteractions) {
		return (
			<View className='justify-center items-center flex-1  min-h-[110px]'>
				<Spinner width={30} height={30} isFullPage={false} />
			</View>
		);
	}

	if (isErrorSpotInteractions) {
		return null;
	}

	return (
		<View
			className='my-4 flex-row justify-between items-center '
			style={{
				columnGap: 15,
			}}
			testID='spot-interactions'
		>
			{spotInteractionsDataToShow.map((item, index) => {
				const { title, count } = item;
				return (
					<TouchableOpacity
						key={index}
						activeOpacity={1}
						className='relative flex-1 rounded-lg p-3 overflow-hidden bg-dark-gray/70  items-center  justify-center  '
						onPress={() => {
							navigateTo(title);
						}}
						testID={`spot-interaction-${title.toLowerCase()}`}
					>
						{renderIcon(title)}
						<TextElement textStyles='text-xs text-white mt-2' numberOfLines={1}>
							{count} {i18nInstance.t(title)}
						</TextElement>
					</TouchableOpacity>
				);
			})}
		</View>
	);
};

export default SpotInteractions;
