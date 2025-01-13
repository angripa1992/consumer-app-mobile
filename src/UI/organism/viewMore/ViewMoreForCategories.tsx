import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import { useGetViewMoreCategories } from '@/lib/hooks/useQueryViewMore';
import { View } from 'react-native';
import SpotListThumbnail from '../spotList/SpotListThumbnail';
import { TypeSpotListFromDiscovery } from '@/lib/types/discovery';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { useCallback } from 'react';
import { i18nInstance } from 'config/i18n';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ViewMoreForCategoriesProps {
	city: string;
	querySearch: string;
	categoryName: string;
}
const ViewMoreForCategories = ({
	city,
	querySearch,
	categoryName,
}: ViewMoreForCategoriesProps) => {
	const {
		spotLists,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetViewMoreCategories(city, categoryName, {
		search_content: querySearch,
	});

	useRefetchOnFocus(refetch);

	const renderSpotListCard = useCallback(
		({
			item: singleSpotList,
			index,
		}: {
			item: TypeSpotListFromDiscovery;
			index: number;
		}) => {
			if ('empty' in singleSpotList && singleSpotList.empty) {
				return <View className=' flex-1'></View>;
			}

			return (
				<SpotListThumbnail
					queryMutateDestination='viewMoreCategories'
					title={singleSpotList.name}
					creator={singleSpotList.creator}
					viewsCount={singleSpotList.view_counter}
					likesCount={singleSpotList.followers_spot_list_counter}
					locationCount={singleSpotList.spot_counter}
					userId={singleSpotList.user_id}
					spotListId={singleSpotList.id}
					spotsImages={singleSpotList.spot_images_available}
					isFollowing={singleSpotList.is_following}
					categoryName={categoryName}
					searchQuery={querySearch}
					currentCity={city}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
				/>
			);
		},
		[],
	);

	return (
		<>
			{isLoading && (
				<View className='flex flex-1 justify-center items-center '>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{spotLists && (
				<InfiniteScrollFlashList
					dataToRender={spotLists}
					renderItem={renderSpotListCard}
					hasNextPage={hasNextPage}
					fetchNextPage={fetchNextPage}
					isLoading={isLoading}
					isFetchingNextPage={isFetchingNextPage}
					keyExtractor={(item, index) => {
						if ('empty' in item && item.empty) {
							return `empty-${index}`;
						}
						return item.id.toString();
					}}
					textForNoItemsAvailable={i18nInstance.t('noSpotListsAvailable')}
				/>
			)}
		</>
	);
};

export default ViewMoreForCategories;
