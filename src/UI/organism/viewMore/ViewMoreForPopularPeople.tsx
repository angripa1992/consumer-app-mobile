import { useGetViewMorePopularPeople } from '@/lib/hooks/useQueryViewMore';
import { TypePersonFromDiscovery } from '@/lib/types/discovery';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import ProfileThumbnail from '@/UI/molecules/profile/ProfileThumbnail';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { i18nInstance } from 'config/i18n';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ViewMoreForPopularPeopleProps {
	city: string;
	querySearch: string;
}

const ViewMoreForPopularPeople = ({
	city,
	querySearch,
}: ViewMoreForPopularPeopleProps) => {
	const {
		popularPeople,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetViewMorePopularPeople(city, 'popular_people', {
		search_content: querySearch,
	});

	useRefetchOnFocus(refetch);

	const renderPersonCard = useCallback(
		({
			item: person,
			index,
		}: {
			item: TypePersonFromDiscovery;
			index: number;
		}) => {
			if ('empty' in person && person.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<ProfileThumbnail
					queryMutateDestination='viewMorePopularPeople'
					name={person.name}
					imageUrl={person.profile_image}
					isFollowing={person.is_following}
					followUserId={person.id}
					currentCity={city}
					searchQuery={querySearch}
					containerStyles={`flex-1`}
					designVariation='small'
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
			{popularPeople && (
				<InfiniteScrollFlashList
					contentContainerStyle={{ paddingTop: 25 }}
					dataToRender={popularPeople}
					renderItem={renderPersonCard}
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
					textForNoItemsAvailable={i18nInstance.t('noPeopleFound')}
					isOneColumn
				/>
			)}
		</>
	);
};

export default ViewMoreForPopularPeople;
