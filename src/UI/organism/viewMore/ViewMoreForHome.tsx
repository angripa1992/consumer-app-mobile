import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import { useGetViewMoreHome } from '@/lib/hooks/useQueryViewMore';
import { View } from 'react-native';
import SpotListThumbnail from '../spotList/SpotListThumbnail';
import { TypeSpotListViewMoreHome } from '@/lib/types/viewMore';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { i18nInstance } from 'config/i18n';
import { useCallback } from 'react';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ViewMoreForHomeProps {
	city: string;
	categoryName: string;
}
const ViewMoreForHome = ({ city, categoryName }: ViewMoreForHomeProps) => {
	const {
		spotLists,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetViewMoreHome(city, categoryName);

	useRefetchOnFocus(refetch);

	const renderSpotListCard = useCallback(
		({
			item: singleSpotList,
			index,
		}: {
			item: TypeSpotListViewMoreHome;
			index: number;
		}) => {
			if ('empty' in singleSpotList && singleSpotList.empty) {
				return <View className=' flex-1'></View>;
			}
			return (
				<SpotListThumbnail
					queryMutateDestination='viewMoreHome'
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
					currentCity={city}
					testID={`list-${index}-${categoryName}`}
					cardContainerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
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

export default ViewMoreForHome;
