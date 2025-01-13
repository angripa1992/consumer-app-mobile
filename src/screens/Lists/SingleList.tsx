import { View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { useAppStore } from '@/lib/store/store';
import {
	useGetSpotList,
	useGetSpotsFromSpotList,
	useGetSpotsFromSpotListWithInfiniteQuery,
} from '@/lib/hooks/useQuerySpotList';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { filterSpotsByStatusTag } from '@/lib/helpers/filterSpots';

import MainLayout from '@/UI/layouts/MainLayout';
import SpotThumbnailDragCard from '@/UI/molecules/spotList/SpotThumbnailDragCard';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import SpotReorderButtons from '@/UI/molecules/spot/SpotReorderButtons';
import SpotThumbnail from '@/UI/organism/spot/SpotThumbnail';
import SpotListHeaderInfo from '@/UI/organism/spotList/SpotListHeaderInfo';
import SpotListEmptySpots from '@/UI/organism/spotList/SpotListEmptySpots';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import SpotListMainInfo from '@/UI/organism/spotList/SpotListMainInfo';
import ErrorScreen from '../ErrorScreen';

import type { TypeSingleListSpotsFilterValue } from '@/lib/types/listFilter';
import type { TypeSpotSingleToSpotList } from '@/lib/types/spot';
import type { SingleListScreenRouteParams } from '@/lib/types/tabScreenParams';

const SingleListScreen = ({
	route,
	navigation,
}: SingleListScreenRouteParams) => {
	const { spotListId } = route.params;
	const { user, isReorderingSpotListActive } = useAppStore(
		useShallow((state) => ({
			user: state.user,
			isReorderingSpotListActive: state.isReorderingSpotListActive,
		})),
	);

	const {
		spotList,
		isLoading: isLoadingSpotList,
		refetch: refetchSpotList,
	} = useGetSpotList(spotListId);

	const {
		spots,
		isLoading: isLoadingSpots,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch: refetchSpots,
	} = useGetSpotsFromSpotListWithInfiniteQuery(spotListId);

	useRefetchOnFocus(refetchSpotList);
	useRefetchOnFocus(refetchSpots);

	const { spots: spotsToReorder, isLoading: isLoadingSpotsToReorder } =
		useGetSpotsFromSpotList(
			spotListId,
			spotList?.spot_counter,
			isReorderingSpotListActive,
		);

	const allSpots = spots;

	const [currentFilter, setCurrentFilter] =
		useState<TypeSingleListSpotsFilterValue>('all');
	const [draggableSpots, setDraggableSpots] = useState(spotsToReorder);

	const isSpotListOwner = spotList?.user_id === user?.id;

	const isPrivateList = !isSpotListOwner && spotList?.is_private;

	const hasDraggableSpots = !!draggableSpots && draggableSpots?.length > 0;

	const isShowAllSpots = !isReorderingSpotListActive;
	const showDraggableSpots = isReorderingSpotListActive && hasDraggableSpots;

	const loadingValidation =
		!spotList || isLoadingSpotList || spotListId !== spotList.id;

	const allValidationsComplete =
		spotList && !isLoadingSpotList && spotListId === spotList.id;

	const spotsToShow = filterSpotsByStatusTag({
		spots: allSpots,
		filterTagValue: currentFilter,
	});

	const renderSpotListHeader = () => {
		if (!spotList) return null;

		return (
			<SpotListHeaderInfo
				isSpotListOwner={isSpotListOwner}
				spotList={spotList}
				currentFilter={currentFilter}
				setCurrentFilter={setCurrentFilter}
				spots={allSpots}
				isFollowing={spotList.is_following}
			/>
		);
	};

	const renderSpotThumbnail = useCallback(
		(spot: TypeSpotSingleToSpotList, index: number) => {
			if ('empty' in spot && spot.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<SpotThumbnail
					queryMutateDestination='spotList'
					id={spot.spot_id}
					spotListId={spotListId}
					spotSpotListId={spot.spot_spot_list_id}
					isSpotListOwner={isSpotListOwner}
					userId={spotList?.user_id}
					testID={`spot-${index}`}
					tripAdvisorLocationId={spot.tripadvisor_location_id}
					googlePlaceLocationId={spot.google_place_location_id}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
					{...spot}
				/>
			);
		},
		[isSpotListOwner],
	);

	useEffect(() => {
		setDraggableSpots(spotsToReorder);
	}, [spotsToReorder, spotListId]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('blur', () => {
			setCurrentFilter('all');
		});

		return unsubscribe;
	}, [navigation]);

	if (isPrivateList) return <ErrorScreen typeError='notFound' />;

	return (
		<>
			<MainLayout isDismissKeyboardActive={false} subContainerStyles={`pt-6`}>
				{loadingValidation && <SpinnerCup />}
				{isReorderingSpotListActive && isLoadingSpotsToReorder && (
					<SpinnerCup />
				)}
				{allValidationsComplete && (
					<>
						{isShowAllSpots && (
							<InfiniteScrollFlashList
								hasNextPage={hasNextPage}
								isLoading={isLoadingSpots}
								isFetchingNextPage={isFetchingNextPage}
								fetchNextPage={fetchNextPage}
								ListHeaderComponent={
									<>
										<SpotListMainInfo
											creator={spotList.creator}
											name={spotList.name}
											city={spotList.city}
											spotListId={spotList.id}
											isSpotListOwner={isSpotListOwner}
											spotListUserId={spotList.user_id}
											isFollowing={spotList.is_following}
										/>
										{renderSpotListHeader()}
									</>
								}
								renderItem={({ item: spot, index }) => {
									return renderSpotThumbnail(spot, index);
								}}
								keyExtractor={(item, index) => {
									if ('empty' in item && item.empty) {
										return `empty-${index}`;
									}
									return item.spot_id.toString() + index;
								}}
								dataToRender={spotsToShow}
								customEmptyComponent={
									<SpotListEmptySpots isSpotListOwner={isSpotListOwner} />
								}
							/>
						)}
						{showDraggableSpots && isSpotListOwner && (
							<View className='pb-20 flex-1 relative'>
								<DraggableFlatList
									data={draggableSpots}
									renderItem={({ item: spot, drag, isActive }) => (
										<SpotThumbnailDragCard
											drag={drag}
											disabled={isActive}
											isSpotListOwner={isSpotListOwner}
											{...spot}
										/>
									)}
									keyExtractor={(item) => item.spot_id.toString()}
									onDragEnd={({ data }) => setDraggableSpots(data)}
								/>
								<SpotReorderButtons
									draggableSpots={draggableSpots}
									spotsToShow={spotsToReorder}
									setDraggableSpots={setDraggableSpots}
									spotListId={spotListId}
								/>
							</View>
						)}
					</>
				)}
			</MainLayout>
		</>
	);
};

export default SingleListScreen;
