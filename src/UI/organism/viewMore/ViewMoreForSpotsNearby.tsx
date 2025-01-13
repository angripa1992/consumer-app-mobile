import { useGetViewMoreSpotsNearby } from '@/lib/hooks/useQueryViewMore';
import { TypeSpotNearby } from '@/lib/types/discovery';
import { FlatList, View } from 'react-native';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import SpotCandidateCard from '@/UI/molecules/spot/SpotCandidateCard';
import NoListAvailable from '@/UI/molecules/NoListAvailable';
import { formatFlatListData } from '@/lib/helpers/formatFlatlistData';
import { useCallback } from 'react';
import { i18nInstance } from 'config/i18n';

interface ViewMoreForSpotsNearbyProps {
	city: string;
	latitude: string;
	longitude: string;
}

const ViewMoreForSpotsNearby = ({
	city,
	latitude,
	longitude,
}: ViewMoreForSpotsNearbyProps) => {
	const { spotsNearby, isLoading } = useGetViewMoreSpotsNearby({
		city,
		latitude,
		longitude,
	});

	const renderSpotCard = useCallback(
		({ item: spot }: { item: TypeSpotNearby }) => {
			if ('empty' in spot && spot.empty) {
				return <View className='flex-1'></View>;
			}

			if (spot.id) {
				<SpotCandidateCard
					queryMutateDestination='spotsNearby'
					id={spot.id}
					name={spot.name}
					tripAdvisorLocationId={spot.tripadvisor_location_id}
					googlePlaceLocationId={spot.google_place_location_id}
					spotType='db'
					screen='notSearchSpots'
					smallImage={spot.small_image}
					viewerStatusTags={spot.viewer_status_tags}
					currentCity={city}
					spotScribblesCount={spot.scribbles_count ?? 0}
				/>;
			}

			return (
				<SpotCandidateCard
					queryMutateDestination='spotsNearby'
					id={spot.id}
					name={spot.name}
					city={spot.city}
					country={spot.country}
					address={spot.address}
					googlePlaceLocationId={spot.google_place_location_id as string}
					spotType='googlePlaces'
					screen='notSearchSpots'
					smallImage={spot.small_image}
					viewerStatusTags={spot.viewer_status_tags}
					currentCity={city}
					state={spot.state}
				/>
			);
		},
		[],
	);

	return (
		<>
			{isLoading && (
				<View className='flex items-center flex-1 justify-center  '>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{spotsNearby && (
				<FlatList
					contentContainerStyle={{ gap: 14 }}
					renderItem={renderSpotCard}
					numColumns={2}
					columnWrapperStyle={{ gap: 14 }}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={() => {
						return (
							<NoListAvailable
								emptyComponentStyles='h-[250px]'
								title={i18nInstance.t('noSpotsNearbyAvailable')}
							/>
						);
					}}
					data={formatFlatListData(spotsNearby, 2)}
				/>
			)}
		</>
	);
};

export default ViewMoreForSpotsNearby;
