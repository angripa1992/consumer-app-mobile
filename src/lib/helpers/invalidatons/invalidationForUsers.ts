import { findItemIndex } from './invalidationHelpers';
import { LIMIT_USER_FOLLOWERS, LIMIT_VIEW_MORE } from '@/lib/utils/constants';

import type { UseUpdateFollowUserQuery } from '@/lib/types/queries';
import type { PartialOptional } from '@/lib/types/partialOptional';
import type { QueryClient } from '@tanstack/react-query';
import type { TypeResponseFollowUsers } from '@/lib/types/user';
import type { TypeResponseViewMorePopularPeople } from '@/lib/types/viewMore';
import type { TypeDiscoveryPeopleResponse } from '@/lib/types/discovery';

const invalidationWhenFollowUserInFollowers = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: [queryKeyFollow, currentUserId],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeResponseFollowUsers[];

			const users = allPagesData.flatMap((page) => page.users);

			return findItemIndex({
				items: users,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: followUserId,
				limit: LIMIT_USER_FOLLOWERS,
			});
		},
	});
};

const invalidationWhenFollowUserFromDiscoveryPeople = async ({
	currentQueryClient,
	followUserId,
	searchQuery,
}: {
	currentQueryClient: QueryClient;
	followUserId: number;
	searchQuery?: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['discoveryPeople', searchQuery],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeDiscoveryPeopleResponse[];

			const users = allPagesData.flatMap((page) => page.peoples);

			return findItemIndex({
				items: users,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: followUserId,
				limit: LIMIT_USER_FOLLOWERS,
			});
		},
	});
};

const invalidationWhenFollowUserFromDiscovery = async ({
	currentQueryClient,
	searchQuery,
	currentCity,
}: {
	currentQueryClient: QueryClient;
	searchQuery?: string;
	currentCity: string;
}) => {
	currentQueryClient.invalidateQueries({
		queryKey: ['postSearchDiscovery', searchQuery, currentCity],
	});
};

const invalidationWhenFollowUserFromViewMorePopularPeople = async ({
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
	currentQueryClient.invalidateQueries({
		queryKey: ['viewMorePopularPeople', searchQuery, currentCity],
		refetchPage: (_, index, allPages) => {
			const allPagesData = allPages as TypeResponseViewMorePopularPeople[];

			const users = allPagesData.flatMap((page) => page.popular_people);

			return findItemIndex({
				items: users,
				itemKeyToFind: 'id',
				currentIndex: index,
				id: followUserId,
				limit: LIMIT_VIEW_MORE,
			});
		},
	});
};

export const invalidationWhenFollowUser = async ({
	currentQueryClient,
	queryMutateDestination,
	followUserId,
	currentCity,
	currentUserId,
	searchQuery,
}: PartialOptional<UseUpdateFollowUserQuery, 'dataUserEvent'> & {
	currentQueryClient: QueryClient;
}) => {
	if (currentUserId) {
		if (queryMutateDestination === 'user') {
			currentQueryClient.invalidateQueries({
				queryKey: ['user', currentUserId],
			});
		}

		if (
			queryMutateDestination === 'followersUsers' ||
			queryMutateDestination === 'followingUsers'
		) {
			invalidationWhenFollowUserInFollowers({
				queryKeyFollow: queryMutateDestination,
				currentQueryClient,
				currentUserId,
				followUserId,
			});
		}
	}

	if (queryMutateDestination === 'peopleDiscovery') {
		invalidationWhenFollowUserFromDiscoveryPeople({
			currentQueryClient,
			followUserId,
			searchQuery,
		});
		currentQueryClient.invalidateQueries(['postSearchDiscovery']);
	}

	if (queryMutateDestination === 'popularPeopleDiscovery' && currentCity) {
		invalidationWhenFollowUserFromDiscovery({
			currentQueryClient,
			searchQuery,
			currentCity,
		});
	}

	if (queryMutateDestination === 'viewMorePopularPeople' && currentCity) {
		invalidationWhenFollowUserFromViewMorePopularPeople({
			currentQueryClient,
			followUserId,
			searchQuery,
			currentCity,
		});
	}
};
