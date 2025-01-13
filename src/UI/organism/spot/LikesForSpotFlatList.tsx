import { useCallback, useEffect } from 'react';

import {
	useGetFollowingLikesForSpot,
	useGetGeneralLikesForSpot,
} from '@/lib/hooks/UseQuerySpot';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import LikesForSpotCard from '@/UI/organism/spot/card/LikesForSpotCard';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import SpotNoResultsView from './error/SpotNoResultsView';

import type { TypeLikeForSpotSchema } from '@/lib/types/spot';
import type { TypeFeedTabFilter } from '@/lib/types/feed';

type TypeLikesForSpotFlatListProps = {
	spotId?: number;
	googlePlacesId?: string;
	likesForFilterValue: TypeFeedTabFilter;
	setThereIsResults: (value: boolean) => void;
};

const LikesForSpotFlatList = ({
	spotId,
	googlePlacesId,
	likesForFilterValue,
	setThereIsResults,
}: TypeLikesForSpotFlatListProps) => {
	const {
		generalLikesForSpot,
		hasNextPageGeneralLikesFor,
		isLoadingGeneralLikesFor,
		isErrorGeneralLikesFor,
		fetchNextPageGeneralLikesFor,
		isFetchingNextPageGeneralLikesFor,
		refetchGeneralLikesFor,
	} = useGetGeneralLikesForSpot(spotId, googlePlacesId);
	const {
		followingLikesForSpot,
		hasNextPageFollowingLikesFor,
		isLoadingFollowingLikesFor,
		isErrorFollowingLikesFor,
		fetchNextPageFollowingLikesFor,
		isFetchingNextPageFollowingLikesFor,
		refetchFollowingLikesFor,
	} = useGetFollowingLikesForSpot(spotId, googlePlacesId);

	useRefetchOnFocus(refetchFollowingLikesFor);
	useRefetchOnFocus(refetchGeneralLikesFor);

	const queryMutateDestination =
		likesForFilterValue === 'community'
			? 'likesForSpot'
			: 'followingLikesForSpot';

	const renderCard = useCallback(
		(likeForSpot: TypeLikeForSpotSchema) => {
			return (
				<LikesForSpotCard
					queryMutateDestination={queryMutateDestination}
					eventId={likeForSpot.event_id}
					spotId={spotId ?? (googlePlacesId as string)}
					username={likeForSpot.creator_username}
					emojis={likeForSpot.emojis}
					dataCreated={likeForSpot.event_created_at}
					profilePictureUrl={likeForSpot.creator_image}
					userId={likeForSpot.creator_user_id}
				/>
			);
		},
		[queryMutateDestination],
	);

	useEffect(() => {
		if (likesForFilterValue === 'community') {
			refetchGeneralLikesFor();
		} else {
			refetchFollowingLikesFor();
		}
	}, [likesForFilterValue]);

	useEffect(() => {
		if (likesForFilterValue === 'community') {
			if ((generalLikesForSpot?.length ?? 0) > 0 || isLoadingGeneralLikesFor) {
				setThereIsResults(true);
			} else {
				setThereIsResults(false);
			}
		} else {
			if (
				(followingLikesForSpot?.length ?? 0) > 0 ||
				isLoadingFollowingLikesFor
			) {
				setThereIsResults(true);
			} else {
				setThereIsResults(false);
			}
		}
	}, [likesForFilterValue, generalLikesForSpot, followingLikesForSpot]);

	return (
		<>
			{likesForFilterValue === 'community' ? (
				<InfiniteScrollFlashList
					dataToRender={generalLikesForSpot}
					renderItem={({ item: event }) => {
						return renderCard(event);
					}}
					hasNextPage={hasNextPageGeneralLikesFor}
					isLoading={isLoadingGeneralLikesFor}
					fetchNextPage={fetchNextPageGeneralLikesFor}
					isFetchingNextPage={isFetchingNextPageGeneralLikesFor}
					customEmptyComponent={<SpotNoResultsView typeMessage='likes' />}
					keyExtractor={(_, index) => {
						return index.toString();
					}}
					isOneColumn
					isError={isErrorGeneralLikesFor}
					refetch={fetchNextPageGeneralLikesFor}
				/>
			) : (
				<InfiniteScrollFlashList
					dataToRender={followingLikesForSpot}
					renderItem={({ item: event }) => {
						return renderCard(event);
					}}
					hasNextPage={hasNextPageFollowingLikesFor}
					isLoading={isLoadingFollowingLikesFor}
					fetchNextPage={fetchNextPageFollowingLikesFor}
					isFetchingNextPage={isFetchingNextPageFollowingLikesFor}
					customEmptyComponent={<SpotNoResultsView typeMessage='likes' />}
					keyExtractor={(_, index) => {
						return index.toString();
					}}
					isOneColumn
					isError={isErrorFollowingLikesFor}
					refetch={fetchNextPageFollowingLikesFor}
				/>
			)}
		</>
	);
};

export default LikesForSpotFlatList;
