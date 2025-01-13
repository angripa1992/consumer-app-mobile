import { PressableProps, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type { ListScreenNavigationProp } from '@/lib/types/tabScreenParams';

interface SpotListButtonsProps {
	spotListId: number;
	spotListName: string;
	isSpotListOwner: boolean;
	spotsCounter: number;
}

const SpotListButtons = ({
	spotListId,
	spotListName,
	isSpotListOwner,
	spotsCounter,
}: SpotListButtonsProps) => {
	const navigation = useNavigation<ListScreenNavigationProp>();

	const handleRedirectToMap: PressableProps['onPress'] = (e) => {
		e.stopPropagation();
		navigation.push('MapScreen', {
			spotListId,
			spotListName,
			isSpotListOwner,
			spotsCounter,
		});
	};
	const handleRedirectToSearchSpot: PressableProps['onPress'] = (e) => {
		e.stopPropagation();
		if (spotListId) {
			navigation.push('SearchSpot', {
				spotListId,
			});
		}
	};

	return (
		<View className=' flex-row justify-between mb-7 gap-x-5'>
			{isSpotListOwner && (
				<ButtonPrimary
					buttonStyles='flex-1 '
					onPress={handleRedirectToSearchSpot}
					textStyles='text-button-black'
					testID='add-spots-button'
				>
					{i18nInstance.t('addSpots')}
				</ButtonPrimary>
			)}
			{spotsCounter > 0 && (
				<ButtonPrimary
					buttonStyles={` flex-1  ${isSpotListOwner ? 'bg-transparent border border-filter-border' : ''}`}
					onPress={handleRedirectToMap}
					textStyles={`${isSpotListOwner ? 'text-filter-border' : 'text-button-black'}`}
					testID='map-locations-button'
				>
					{i18nInstance.t('mapLocations')}
				</ButtonPrimary>
			)}
		</View>
	);
};

export default SpotListButtons;
