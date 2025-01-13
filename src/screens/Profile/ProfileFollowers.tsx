import { memo, useCallback, useState } from 'react';
import { View } from 'react-native';

import { useGetFollowUsers, useGetUser } from '@/lib/hooks/useQueryUser';
import { TypeFollowListFilter } from '@/lib/types/profile';
import { FollowViewRouteParams } from '@/lib/types/tabScreenParams';
import MainLayout from '@/UI/layouts/MainLayout';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import ProfileThumbnail from '@/UI/molecules/profile/ProfileThumbnail';
import FollowNoUsers from '@/UI/molecules/follow/FollowNoUsers';
import { TypeUserFollowerOrFollowing } from '@/lib/types/user';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { i18nInstance } from 'config/i18n';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

const ProfileFollowersScreen = ({ route }: FollowViewRouteParams) => {
	const userId = route.params.userId;
	const filter = route.params.filter;

	const { user, isLoading: isLoadingUser } = useGetUser(userId);

	const [currentListFilter, setCurrentListFilter] =
		useState<TypeFollowListFilter>(filter);

	const queryUser =
		currentListFilter === 'followers' ? 'followers' : 'followed';

	const {
		followUsers,
		isLoading: isLoadingFollowUsers,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch,
	} = useGetFollowUsers(userId, queryUser);

	useRefetchOnFocus(refetch);

	const handleActiveListStyles = (
		listValue: TypeFollowListFilter,
		elementToStyled: 'button' | 'text',
	) => {
		if (elementToStyled === 'button') {
			if (listValue === currentListFilter) {
				return 'bg-middle-gray text-white';
			}
		}
		if (elementToStyled === 'text') {
			if (listValue === currentListFilter) {
				return 'text-white';
			}
		}
		return '';
	};

	const handleUpdateCurrentListFilter = (listValue: TypeFollowListFilter) => {
		setCurrentListFilter(listValue);
	};

	const renderProfileThumbnail = useCallback(
		({ item, index }: { item: TypeUserFollowerOrFollowing; index: number }) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			return (
				<ProfileThumbnail
					queryMutateDestination={
						queryUser === 'followers' ? 'followersUsers' : 'followingUsers'
					}
					followUserId={item.id}
					name={item.name}
					imageUrl={item.profile_image}
					isFollowing={item.is_following}
					currentUserId={userId}
					testID={`profile-thumbnail-${index}-${queryUser}`}
					containerStyles={`flex-1 ${index % 2 === 0 ? 'mr-3' : 'ml-3'}`}
				/>
			);
		},
		[queryUser],
	);

	return (
		<MainLayout isDismissKeyboardActive={false} mainLayoutStyles='py-3'>
			{isLoadingUser ? (
				<SpinnerCup />
			) : (
				<InfiniteScrollFlashList
					ListHeaderComponent={
						<View className='mb-7 flex flex-row  mx-auto'>
							<ButtonPrimary
								designVariation='gray'
								buttonStyles={`rounded-full mr-2 ${handleActiveListStyles(
									'following',
									'button',
								)}`}
								textStyles={handleActiveListStyles('following', 'text')}
								onPress={() => handleUpdateCurrentListFilter('following')}
							>
								{user?.following_users_counter} {i18nInstance.t('following')}
							</ButtonPrimary>
							<ButtonPrimary
								designVariation='gray'
								buttonStyles={`rounded-full ${handleActiveListStyles(
									'followers',
									'button',
								)}`}
								textStyles={handleActiveListStyles('followers', 'text')}
								onPress={() => handleUpdateCurrentListFilter('followers')}
							>
								{user?.followers_counter} {i18nInstance.t('followers')}
							</ButtonPrimary>
						</View>
					}
					customEmptyComponent={
						<FollowNoUsers isFollowing={currentListFilter === 'following'} />
					}
					fetchNextPage={fetchNextPage}
					hasNextPage={hasNextPage}
					isFetchingNextPage={isFetchingNextPage}
					isLoading={isLoadingFollowUsers}
					dataToRender={followUsers}
					keyExtractor={(item, index) => {
						if ('empty' in item && item.empty) {
							return `empty-${index}`;
						}
						return item.id.toString() + index;
					}}
					renderItem={renderProfileThumbnail}
				/>
			)}
		</MainLayout>
	);
};

export default memo(ProfileFollowersScreen);
