import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import { View } from 'react-native';
import { useGetViewMoreUserSpots } from '@/lib/hooks/useQueryViewMore';
import { TypeSpotUserViewMore } from '@/lib/types/viewMore';
import SpotThumbnail from '../spot/SpotThumbnail';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';
import { i18nInstance } from 'config/i18n';
import { useCallback } from 'react';

interface ViewMoreForUserSpotsProps {
	categoryName: string;
	userId: number;
}
const ViewMoreForUserSpots = ({
	categoryName,
	userId,
}: ViewMoreForUserSpotsProps) => {
	const { user: appUser, globalCityFilterValue } = useAppStore(
		useShallow((state) => ({
			user: state.user,
			globalCityFilterValue: state.globalCityFilterValue,
		})),
	);

	const isOwnerUser = appUser?.id === userId;

	const {
		userSpots,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetViewMoreUserSpots(userId, categoryName, globalCityFilterValue);

	const renderSpotCard = useCallback(
		({ item: spot, index }: { item: TypeSpotUserViewMore; index: number }) => {
			if ('empty' in spot && spot.empty) {
				return <View className=' flex-1'></View>;
			}
			return (
				<SpotThumbnail
					queryMutateDestination='viewMoreUserSpots'
					cardContainerStyles={`${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
					{...spot}
					isSpotListOwner={isOwnerUser}
					userId={userId}
					categoryName={categoryName}
					isOwner={isOwnerUser}
					googlePlaceLocationId={spot.google_place_location_id}
				/>
			);
		},
		[globalCityFilterValue],
	);

	return (
		<>
			{isLoading && (
				<View className='flex items-center flex-1 justify-center  '>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{userSpots && (
				<InfiniteScrollFlashList
					dataToRender={userSpots}
					renderItem={renderSpotCard}
					keyExtractor={(item, index) => {
						if ('empty' in item && item.empty) {
							return `empty-${index}`;
						}
						return item.id.toString();
					}}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					fetchNextPage={fetchNextPage}
					isLoading={isLoading}
					textForNoItemsAvailable={i18nInstance.t('noSpotsAvailable')}
				/>
			)}
		</>
	);
};

export default ViewMoreForUserSpots;
