import { useCallback, useEffect } from 'react';
import { View } from 'react-native';

import {
	useGetFollowingFeaturedLists,
	useGetGeneralFeaturedLists,
} from '@/lib/hooks/UseQuerySpot';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import SpotListThumbnail from '../spotList/SpotListThumbnail';
import SpotNoResultsView from './error/SpotNoResultsView';
import InfiniteScrollFlatList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlatList';

import type { TypeFeaturedSpotListInSpot } from '@/lib/types/spot';
import type { TypeFeedTabFilter } from '@/lib/types/feed';

type TypeListsForSpotFlatListProps = {
	spotId?: number;
	googlePlacesId?: string;
	listsForFilterValue: TypeFeedTabFilter;
	setThereIsResults: (value: boolean) => void;
};

const ListsForSpotFlatList = ({
	spotId,
	googlePlacesId,
	listsForFilterValue,
	setThereIsResults,
}: TypeListsForSpotFlatListProps) => {
	const {
		generalFeaturedLists,
		isLoadingGeneralFeaturedLists,
		fetchNextPageGeneralFeaturedLists,
		hasNextPageGeneralFeaturedLists,
		isFetchingNextPageGeneralFeaturedLists,
		refetchGeneralFeaturedLists,
		isErrorGeneralFeaturedLists,
	} = useGetGeneralFeaturedLists(spotId, googlePlacesId);

	const {
		followingFeatureLists,
		isLoadingFollowingFeaturedLists,
		fetchNextPageFollowingFeaturedLists,
		hasNextPageFollowingFeaturedLists,
		isFetchingNextPageFollowingFeaturedLists,
		refetchFollowingFeaturedLists,
		isErrorFollowingFeaturedLists,
	} = useGetFollowingFeaturedLists(spotId, googlePlacesId);

	useRefetchOnFocus(refetchFollowingFeaturedLists);
	useRefetchOnFocus(refetchGeneralFeaturedLists);

	const queryMutateDestination =
		listsForFilterValue === 'community'
			? 'featuredLists'
			: 'followingFeaturedLists';

	const renderListCard = useCallback(
		(singleSpotList: TypeFeaturedSpotListInSpot, index: number) => {
			const likesCount = singleSpotList.followers_spot_list_counter;

			if ('empty' in singleSpotList && singleSpotList.empty) {
				return <View className=' flex-1'></View>;
			}

			return (
				<SpotListThumbnail
					queryMutateDestination={queryMutateDestination}
					title={singleSpotList.name}
					creator={`@${singleSpotList.creator}`}
					viewsCount={singleSpotList.view_counter}
					likesCount={likesCount}
					locationCount={singleSpotList.spot_counter}
					userId={singleSpotList.user_id}
					spotListId={singleSpotList.id}
					spotsImages={singleSpotList.spot_images_available}
					spotId={spotId}
					isFollowing={singleSpotList.is_following}
				/>
			);
		},
		[queryMutateDestination],
	);

	useEffect(() => {
		if (listsForFilterValue === 'community') {
			refetchGeneralFeaturedLists();
		} else {
			refetchFollowingFeaturedLists();
		}
	}, [listsForFilterValue]);

	useEffect(() => {
		if (listsForFilterValue === 'community') {
			if (
				(generalFeaturedLists?.length ?? 0) > 0 ||
				isLoadingGeneralFeaturedLists
			) {
				setThereIsResults(true);
			} else {
				setThereIsResults(false);
			}
		} else {
			if (
				(followingFeatureLists?.length ?? 0) > 0 ||
				isLoadingFollowingFeaturedLists
			) {
				setThereIsResults(true);
			} else {
				setThereIsResults(false);
			}
		}
	}, [listsForFilterValue, generalFeaturedLists, followingFeatureLists]);

	return (
		<>
			{listsForFilterValue === 'community' ? (
				<InfiniteScrollFlatList
					dataToRender={generalFeaturedLists}
					renderItem={({ item: event, index }) => {
						return renderListCard(event, index);
					}}
					hasNextPage={hasNextPageGeneralFeaturedLists}
					isLoading={isLoadingGeneralFeaturedLists}
					fetchNextPage={fetchNextPageGeneralFeaturedLists}
					isFetchingNextPage={isFetchingNextPageGeneralFeaturedLists}
					customEmptyComponent={<SpotNoResultsView typeMessage='lists' />}
					keyExtractor={(_, index) => {
						return index.toString();
					}}
					isError={isErrorGeneralFeaturedLists}
					refetch={refetchGeneralFeaturedLists}
				/>
			) : (
				<InfiniteScrollFlatList
					dataToRender={followingFeatureLists}
					renderItem={({ item: event, index }) => {
						return renderListCard(event, index);
					}}
					hasNextPage={hasNextPageFollowingFeaturedLists}
					isLoading={isLoadingFollowingFeaturedLists}
					fetchNextPage={fetchNextPageFollowingFeaturedLists}
					isFetchingNextPage={isFetchingNextPageFollowingFeaturedLists}
					customEmptyComponent={<SpotNoResultsView typeMessage='lists' />}
					keyExtractor={(_, index) => {
						return index.toString();
					}}
					isError={isErrorFollowingFeaturedLists}
					refetch={refetchFollowingFeaturedLists}
				/>
			)}
		</>
	);
};

export default ListsForSpotFlatList;
