import React, { useRef } from 'react';

import { useGetGeneralFeed } from '@/lib/hooks/useQueryFeed';

import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import FeedEmptyResults from './FeedEmptyResults';

import type { TypeFeedEvent } from '@/lib/types/feed';
import {
	FlashList,
	FlashListProps,
	type ListRenderItemInfo,
} from '@shopify/flash-list';
import { useScrollToTop } from '@react-navigation/native';
import { FlatList } from 'react-native';

interface TypeFeedGeneralEvents {
	renderItem: ({
		item,
		index,
	}: ListRenderItemInfo<TypeFeedEvent>) => React.JSX.Element | null;
}

const FeedGeneralEvents = ({ renderItem }: TypeFeedGeneralEvents) => {
	const {
		generalEvents,
		hasNextPageGeneral,
		isLoadingGeneralFeed,
		isFetchingNextPageGeneral,
		fetchNextPageGeneral,
		refetchGeneralFeed,
		isErrorGeneralFeed,
		hasNewGeneralEvents,
	} = useGetGeneralFeed();

	return (
		<InfiniteScrollFlashList
			dataToRender={generalEvents}
			renderItem={renderItem}
			hasNextPage={hasNextPageGeneral}
			isLoading={isLoadingGeneralFeed}
			fetchNextPage={fetchNextPageGeneral}
			isFetchingNextPage={isFetchingNextPageGeneral}
			customEmptyComponent={<FeedEmptyResults />}
			keyExtractor={(item) => item.event_id.toString()}
			isOneColumn
			isError={isErrorGeneralFeed}
			refetch={refetchGeneralFeed}
			isUseScrollToTop
			hasNewData={hasNewGeneralEvents}
		/>
	);
};

export default FeedGeneralEvents;
