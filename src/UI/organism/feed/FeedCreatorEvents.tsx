import React from 'react';

import { useGetCreatorFeed, useGetGeneralFeed } from '@/lib/hooks/useQueryFeed';

import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import FeedEmptyResults from './FeedEmptyResults';

import type { TypeFeedEvent } from '@/lib/types/feed';
import type { ListRenderItemInfo } from '@shopify/flash-list';

interface TypeFeedCreatorEvents {
	renderItem: ({
		item,
		index,
	}: ListRenderItemInfo<TypeFeedEvent>) => React.JSX.Element | null;
}

const FeedCreatorEvents = ({ renderItem }: TypeFeedCreatorEvents) => {
	const {
		creatorEvents,
		hasNextPageCreator,
		isLoadingCreatorFeed,
		isFetchingNextPageCreator,
		fetchNextPageCreator,
		refetchGeneralCreator,
		isErrorCreatorFeed,
		hasNewCreatorEvents,
	} = useGetCreatorFeed();

	return (
		<InfiniteScrollFlashList
			dataToRender={creatorEvents}
			renderItem={renderItem}
			hasNextPage={hasNextPageCreator}
			isLoading={isLoadingCreatorFeed}
			fetchNextPage={fetchNextPageCreator}
			isFetchingNextPage={isFetchingNextPageCreator}
			customEmptyComponent={<FeedEmptyResults />}
			keyExtractor={(item) => item.event_id.toString()}
			isOneColumn
			isError={isErrorCreatorFeed}
			refetch={refetchGeneralCreator}
			isUseScrollToTop
			hasNewData={hasNewCreatorEvents}
		/>
	);
};

export default FeedCreatorEvents;
