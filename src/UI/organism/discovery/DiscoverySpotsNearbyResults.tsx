import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';
import SpotCandidateCard from '@/UI/molecules/spot/SpotCandidateCard';
import CategoryTemplate from '@/UI/molecules/category/CategoryTemplate';

import type { ViewMoreScreenNavigationProp } from '@/lib/types/tabScreenParams';
import type { TypeSpotNearby, TypeViewMoreScreen } from '@/lib/types/discovery';

interface DiscoverySpotsNearbyResultsProps {
	spotsNearby: TypeSpotNearby[] | undefined | null;
	userRealTimeCountry: string | null;
	userRealTimeCity: string | null;
	userRealTimeLatitude: string | null;
	userRealTimeLongitude: string | null;
	isLoadingSpotsNearby: boolean;
}

const DiscoverySpotsNearbyResults = ({
	spotsNearby,
	userRealTimeCity,
	userRealTimeCountry,
	userRealTimeLatitude,
	userRealTimeLongitude,
	isLoadingSpotsNearby,
}: DiscoverySpotsNearbyResultsProps) => {
	const navigation = useNavigation<ViewMoreScreenNavigationProp>();

	const onViewMoreNavigation = () => {
		if (
			userRealTimeCity &&
			userRealTimeCountry &&
			userRealTimeLatitude &&
			userRealTimeLongitude
		) {
			const redirectParams: TypeViewMoreScreen = {
				title: 'spotsNearby',
				city: userRealTimeCity,
				type: 'spotsNearby',
				latitude: userRealTimeLatitude,
				longitude: userRealTimeLongitude,
			};
			navigation.navigate('ViewMore', redirectParams);
		}
	};

	const renderSpotCard = useCallback(
		({ item, index }: { item: TypeSpotNearby; index: number }) => {
			if (item.id) {
				return (
					<SpotCandidateCard
						queryMutateDestination='spotsNearby'
						id={item.id}
						name={item.name}
						tripAdvisorLocationId={item.tripadvisor_location_id}
						googlePlaceLocationId={item.google_place_location_id}
						spotType='db'
						viewerStatusTags={item.viewer_status_tags}
						screen='notSearchSpots'
						currentCity={userRealTimeCity}
						testID={`spot-nearby-${index}`}
						smallImage={item.small_image}
						cardContainerStyles={`w-[150px] mr-3`}
					/>
				);
			}

			return (
				<SpotCandidateCard
					queryMutateDestination='spotsNearby'
					id={item.id}
					name={item.name}
					city={item.city}
					country={item.country}
					address={item.address}
					tripAdvisorLocationId={item.tripadvisor_location_id}
					googlePlaceLocationId={item.google_place_location_id as string}
					spotType='googlePlaces'
					viewerStatusTags={item.viewer_status_tags}
					screen='notSearchSpots'
					currentCity={userRealTimeCity}
					state={item.state}
					testID={`spot-nearby-${index}`}
					smallImage={item.small_image}
					cardContainerStyles={`w-[150px] mr-5`}
				/>
			);
		},
		[userRealTimeCity],
	);

	if (userRealTimeCity === null) return null;

	return (
		<CategoryTemplate
			title='Spots Nearby'
			data={spotsNearby}
			renderItem={renderSpotCard}
			onClickViewMore={onViewMoreNavigation}
			showEmptyComponent
			noAvailableText={'noSpotsNearbyAvailable'}
			showIsLoadingComponent={isLoadingSpotsNearby}
		/>
	);
};

export default DiscoverySpotsNearbyResults;
