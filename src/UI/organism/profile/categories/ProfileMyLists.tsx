import { View } from 'react-native';
import { useCallback, type ReactNode } from 'react';

import { useGetUserLists } from '@/lib/hooks/useQueryUser';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import ProfileMyScribbles from './ProfileMyScribbles';
import ProfileMySpots from './ProfileMySpots';
import SpotListThumbnail from '../../spotList/SpotListThumbnail';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';

import type { TypeSpotListUserSchema } from '@/lib/types/user';
import type { TypeProfileListFilterValue } from '@/lib/types/profile';
import { useGetUserScribbles } from '@/lib/hooks/useQueryScribbles';
import InfiniteScrollFlatList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlatList';

type TypeProfileMyListsProps = {
	userId: number;
	headerFlatList: ReactNode;
	currentFilter: TypeProfileListFilterValue;
	currentCity: string;
};

const ProfileMyLists = ({
	userId,
	headerFlatList,
	currentFilter,
	currentCity,
}: TypeProfileMyListsProps) => {
	const categoryListName = currentFilter === 'list' ? 'my_list' : 'liked_list';

	const isListsFilter =
		currentFilter === 'list' || currentFilter === 'followed';
	const isSpotsFilter =
		currentFilter !== 'list' && currentFilter !== 'followed';
	const isScribblesFilter = currentFilter === 'scribbles';

	const {
		spotLists: userLists,
		isLoading: isLoadingUserLists,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetUserLists(userId, categoryListName);

	useRefetchOnFocus(refetch);

	const dataToRender = isListsFilter ? userLists : [];

	const renderSpotListThumbnail = useCallback(
		({ item, index }: { item: TypeSpotListUserSchema; index: number }) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			return (
				<SpotListThumbnail
					queryMutateDestination='user'
					title={item.name}
					creator={item.creator}
					viewsCount={item.view_counter}
					likesCount={item.followers_spot_list_counter}
					locationCount={item.spot_counter}
					spotListId={item.id}
					userId={item.user_id}
					isFollowing={item.is_following}
					spotsImages={item.spot_images_available}
					currentUserId={userId}
					categoryName={categoryListName}
					testID={`list-${index}-${categoryListName}`}
				/>
			);
		},
		[categoryListName],
	);

	const renderFooter = () => {
		if (isScribblesFilter) {
			return <ProfileMyScribbles userId={userId} />;
		}

		if (isSpotsFilter) {
			return <ProfileMySpots userId={userId} currentCity={currentCity} />;
		}

		if (isLoadingUserLists || isFetchingNextPage) {
			return (
				<View className='flex justify-center items-center mt-6'>
					<SpinnerCup isFullPage={false} width={90} height={90} />
				</View>
			);
		}

		return null;
	};

	return (
		<InfiniteScrollFlatList
			fetchNextPage={fetchNextPage}
			hasNextPage={hasNextPage}
			isFetchingNextPage={isFetchingNextPage}
			isLoading={isLoadingUserLists}
			ListHeaderComponent={<>{headerFlatList}</>}
			dataToRender={dataToRender}
			keyExtractor={(item, index) => {
				if ('empty' in item && item.empty) {
					return `empty-${index}`;
				}
				return item.id.toString() + index;
			}}
			hideEmptyComponent={isSpotsFilter}
			renderItem={renderSpotListThumbnail}
			ListFooterComponent={renderFooter()}
			testID='profile-lists-scroll'
		/>
	);
};

export default ProfileMyLists;
