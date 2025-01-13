import React from 'react';

import { useGetFollowingFeed } from '@/lib/hooks/useQueryFeed';

import FeedEmptyResults from './FeedEmptyResults';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

import type { ListRenderItemInfo } from '@shopify/flash-list';
import type { TypeFeedEvent } from '@/lib/types/feed';

interface TypeFeedFollowingEvents {
	renderItem: ({
		item,
		index,
	}: ListRenderItemInfo<TypeFeedEvent>) => React.JSX.Element | null;
}

const FeedFollowingEvents = ({ renderItem }: TypeFeedFollowingEvents) => {
	const {
		followingEvents,
		hasNextPageFollowing,
		isLoadingFollowingFeed,
		isFetchingNextPageFollowing,
		fetchNextPageFollowing,
		refetchGeneralFollowing,
		isErrorFollowingFeed,
		hasNewFollowingEvents,
	} = useGetFollowingFeed();

	return (
		<InfiniteScrollFlashList
			dataToRender={followingEvents}
			renderItem={renderItem}
			hasNextPage={hasNextPageFollowing}
			isLoading={isLoadingFollowingFeed}
			fetchNextPage={fetchNextPageFollowing}
			isFetchingNextPage={isFetchingNextPageFollowing}
			customEmptyComponent={<FeedEmptyResults />}
			keyExtractor={(item) => item.event_id.toString()}
			isOneColumn
			isError={isErrorFollowingFeed}
			refetch={refetchGeneralFollowing}
			isUseScrollToTop
			hasNewData={hasNewFollowingEvents}
		/>
	);
};

export default FeedFollowingEvents;
