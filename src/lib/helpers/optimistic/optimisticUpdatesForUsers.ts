import { PartialOptional } from '@/lib/types/partialOptional';
import { UseUpdateFollowUserQuery } from '@/lib/types/queries';
import { InfiniteData, QueryClient } from '@tanstack/react-query';
import {
	updateFollowCounter,
	updateOptimisticInQueryData,
} from './optimisticHelpers';
import {
	TypeResponseFollowUsers,
	TypeUserForOptimisticUpdate,
	TypeUserSingleResponse,
} from '@/lib/types/user';
import {
	TypeDiscoveryPeopleResponse,
	TypeDiscoveryResponse,
} from '@/lib/types/discovery';
import { TypeResponseViewMorePopularPeople } from '@/lib/types/viewMore';

const updateUserFollowers = (user: TypeUserForOptimisticUpdate) => {
	if ('followers_counter' in user) {
		return {
			...user,
			is_following: !user.is_following,
			followers_counter: updateFollowCounter(
				user.followers_counter,
				user.is_following,
			),
		};
	}

	return {
		...user,
		is_following: !user.is_following,
	};
};

const updateArrayWithUsers = (
	array: TypeUserForOptimisticUpdate[],
	userId: number,
) =>
	array.map((user) => (user.id === userId ? updateUserFollowers(user) : user));

const updateOptimisticWhenFollowUserInSinglePage = async ({
	currentQueryClient,
	currentUserId,
}: {
	currentQueryClient: QueryClient;
	currentUserId: number;
}) => {
	return updateOptimisticInQueryData({
		queryKey: ['user', currentUserId],
		currentQueryClient,
		getUpdatedData: (oldData) => {
			const userResponse = oldData as TypeUserSingleResponse;
			const user = userResponse.user;

			const updatedUser = updateUserFollowers(user);

			return {
				...userResponse,
				user: updatedUser,
			};
		},
	});
};

const updateOptimisticWhenFollowUserInFollowers = async ({
	queryKeyFollow,
	currentQueryClient,
	currentUserId,
	followUserId,
}: {
	queryKeyFollow: 'followersUsers' | 'followingUsers';
	currentQueryClient: QueryClient;
	currentUserId: number;
	followUserId: number;
}) => {
	return updateOptimisticInQueryData({
		queryKey: [queryKeyFollow, currentUserId],
		currentQueryClient,
		getUpdatedData: (oldData) => {
			const usersResponse = oldData as InfiniteData<TypeResponseFollowUsers>;
			const newData = usersResponse.pages.map((page) => {
				const newUsers = updateArrayWithUsers(page.users, followUserId);
				return {
					...page,
					users: newUsers,
				};
			});

			return {
				...usersResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowUserFromDiscoveryPeople = async ({
	currentQueryClient,
	followUserId,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	followUserId: number;
	searchQuery?: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['discoveryPeople', searchQuery],
		getUpdatedData: (old) => {
			const discoveryPeopleResponse =
				old as InfiniteData<TypeDiscoveryPeopleResponse>;

			const newData = discoveryPeopleResponse?.pages.map((page) => {
				const allPeopleData = page.peoples;

				const newPeopleData = updateArrayWithUsers(allPeopleData, followUserId);

				return {
					...page,
					peoples: newPeopleData,
				};
			});

			return {
				...discoveryPeopleResponse,
				pages: newData,
			};
		},
	});
};

const updateOptimisticWhenFollowUserFromDiscovery = async ({
	currentQueryClient,
	followUserId,
	searchQuery,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	followUserId: number;
	searchQuery?: string;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['postSearchDiscovery', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const discoverySpotListsResponse = old as TypeDiscoveryResponse;

			const discoveries = discoverySpotListsResponse.discoveries;

			const newPeople = updateArrayWithUsers(
				discoveries.popular_people,
				followUserId,
			);

			return {
				...discoverySpotListsResponse,
				discoveries: {
					...discoveries,
					popular_people: newPeople,
				},
			};
		},
	});
};

const updateOptimisticWhenFollowUserFromViewMorePopularPeople = async ({
	currentCity,
	currentQueryClient,
	followUserId,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	followUserId: number;
	searchQuery?: string;
	currentCity: string;
}) => {
	return updateOptimisticInQueryData({
		currentQueryClient,
		queryKey: ['viewMorePopularPeople', searchQuery, currentCity],
		getUpdatedData: (old) => {
			const popularPeopleResponse =
				old as InfiniteData<TypeResponseViewMorePopularPeople>;

			const newData = popularPeopleResponse.pages.map((page) => {
				const newPeople = updateArrayWithUsers(
					page.popular_people,
					followUserId,
				);
				return {
					...page,
					popular_people: newPeople,
				};
			});

			return {
				...popularPeopleResponse,
				pages: newData,
			};
		},
	});
};

// optimistic updates when follow user
export const updateOptimisticWhenFollowUser = async ({
	currentQueryClient,
	queryMutateDestination,
	followUserId,
	currentCity,
	currentUserId,
	searchQuery,
	categoryName,
}: PartialOptional<UseUpdateFollowUserQuery, 'dataUserEvent'> & {
	currentQueryClient: QueryClient;
}) => {
	if (currentUserId) {
		if (queryMutateDestination === 'user') {
			await updateOptimisticWhenFollowUserInSinglePage({
				currentQueryClient,
				currentUserId,
			});
		}

		if (
			queryMutateDestination === 'followersUsers' ||
			queryMutateDestination === 'followingUsers'
		) {
			await updateOptimisticWhenFollowUserInFollowers({
				queryKeyFollow: queryMutateDestination,
				currentQueryClient,
				currentUserId,
				followUserId,
			});
		}
	}

	if (queryMutateDestination === 'peopleDiscovery') {
		await updateOptimisticWhenFollowUserFromDiscoveryPeople({
			currentQueryClient,
			followUserId,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'popularPeopleDiscovery' && currentCity) {
		console.log('currentCity', currentCity);
		await updateOptimisticWhenFollowUserFromDiscovery({
			currentCity,
			currentQueryClient,
			followUserId,
			searchQuery,
		});
	}

	if (queryMutateDestination === 'viewMorePopularPeople' && currentCity) {
		await updateOptimisticWhenFollowUserFromViewMorePopularPeople({
			currentCity,
			currentQueryClient,
			followUserId,
			searchQuery,
		});
	}
};

// handle errors for optimistic updates when follow user

export const onErrorOptimisticWhenFollowUser = ({
	currentQueryClient,
	queryMutateDestination,
	followUserId,
	categoryName,
	searchQuery,
	currentCity,
	currentUserId,
	context,
}: PartialOptional<UseUpdateFollowUserQuery, 'dataUserEvent'> & {
	currentQueryClient: QueryClient;
	context:
		| void
		| {
				previousData: unknown;
		  }
		| undefined;
}) => {
	if (currentUserId) {
		if (queryMutateDestination === 'user') {
			currentQueryClient.setQueryData(
				['user', currentUserId],
				context?.previousData,
			);
		}

		if (
			queryMutateDestination === 'followersUsers' ||
			queryMutateDestination === 'followingUsers'
		) {
			currentQueryClient.setQueryData(
				[queryMutateDestination, currentUserId],
				context?.previousData,
			);
		}
	}

	if (
		queryMutateDestination === 'popularPeopleDiscovery' &&
		currentCity &&
		categoryName
	) {
		currentQueryClient.setQueryData(
			['postSearchDiscovery', searchQuery, currentCity],
			context?.previousData,
		);
	}

	if (queryMutateDestination === 'viewMorePopularPeople' && currentCity) {
		currentQueryClient.setQueryData(
			['viewMorePopularPeople', searchQuery, currentCity],
			context?.previousData,
		);
	}
};
