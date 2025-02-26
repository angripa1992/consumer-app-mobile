import { useCallback } from 'react';
import { View } from 'react-native';
import ProfileThumbnail from '@/UI/molecules/profile/ProfileThumbnail';
import type {
	TypeDiscoveryPersonCard,
} from '../types/discovery';

interface UsePlayResultsProps {
	userRealTimeCity: string | null;
	userRealTimeCountry: string | null;
	userRealTimeLatitude: string | null;
	userRealTimeLongitude: string | null;
	currentCity: string;
	debounceSearchQuery: string;
	tabIndex: number;
	currentAreas: string[];
}

const usePlayResults = ({
	currentCity,
	debounceSearchQuery,
}: UsePlayResultsProps) => {
	const renderPersonCard = useCallback(
		({
			item,
			index,
			categoryName,
			containerStyles,
			queryMutateDestination,
			isSmallVariant,
		}: TypeDiscoveryPersonCard) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<ProfileThumbnail
					queryMutateDestination={queryMutateDestination}
					name={item.name}
					imageUrl={item.profile_image}
					isFollowing={item.is_following}
					followUserId={item.id}
					searchQuery={debounceSearchQuery}
					currentCity={currentCity}
					categoryName={categoryName}
					testID={`person-card-${index}`}
					containerStyles={`${containerStyles}`}
					designVariation={isSmallVariant ? 'small' : 'large'}
				/>
			);
		},
		[currentCity, debounceSearchQuery],
	);

	return {
		renderPersonCard,
	};
};

export default usePlayResults;
