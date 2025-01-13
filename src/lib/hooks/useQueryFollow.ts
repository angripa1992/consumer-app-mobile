import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FOLLOW_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import { postDataWithToken } from '../helpers/postData';
import { followResponseSchema } from '../schemas/follow';
import { TypeFollow } from '../types/follows';
import { auth } from '../../../config/firebase';
import {
	UseUpdateFollowSpotListQuery,
	UseUpdateFollowUserQuery,
} from '../types/queries';
import { TypeSpotListDataEvent } from '../types/spotList';
import {
	followListEvent,
	followUserEvent,
} from '../helpers/analytics/customEvents';
import { TypeUserDataEvent } from '../types/user';
import {
	onErrorOptimisticWhenFollowList,
	updateOptimisticWhenFollowList,
} from '../helpers/optimistic/optimisticUpdatesForLists';
import {
	onErrorOptimisticWhenFollowUser,
	updateOptimisticWhenFollowUser,
} from '../helpers/optimistic/optimisticUpdatesForUsers';
import { useShallow } from 'zustand/react/shallow';
import { invalidationWhenFollowList } from '../helpers/invalidatons/invalidationForLists';
import { invalidationWhenFollowUser } from '../helpers/invalidatons/invalidationForUsers';

const fetchPostFollowUser = async (
	values: TypeFollow,
	dataEvent: TypeUserDataEvent,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !values) return null;

	const response = await postDataWithToken(
		FOLLOW_ENDPOINTS.PUT_FOLLOW,
		values,
		idToken,
		userInfo,
	);

	await followUserEvent(dataEvent);

	return followResponseSchema.parse(response);
};

//UPDATE FOLLOW USER
export const useUpdateFollowUserQuery = ({
	queryMutateDestination,
	dataUserEvent,
	followUserId,
	currentUserId,
	searchQuery,
	currentCity,
	categoryName,
}: UseUpdateFollowUserQuery) => {
	const currentQueryClient = useQueryClient();

	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	let searchQueryValidated = searchQuery ?? '';

	return useMutation({
		mutationFn: () => {
			const values: TypeFollow = { following_user_id: followUserId };
			setIsLoading(true);
			return fetchPostFollowUser(values, dataUserEvent, userInfo);
		},
		onMutate: async () => {
			updateOptimisticWhenFollowUser({
				currentQueryClient,
				queryMutateDestination,
				followUserId,
				currentCity,
				currentUserId,
				searchQuery: searchQueryValidated,
				categoryName,
			});
		},
		onSuccess: () => {
			invalidationWhenFollowUser({
				currentQueryClient,
				queryMutateDestination,
				followUserId,
				currentCity,
				currentUserId,
				searchQuery: searchQueryValidated,
				categoryName,
			});

			setIsLoading(false);
		},
		onError: (err, _, context) => {
			setIsLoading(false);
			console.error(err);

			onErrorOptimisticWhenFollowUser({
				currentQueryClient,
				queryMutateDestination,
				followUserId,
				categoryName,
				searchQuery: searchQueryValidated,
				currentCity,
				currentUserId,
				context,
			});
		},
	});
};

//UPDATE FOLLOW SPOT LIST
const fetchPostFollowSpotList = async (
	values: TypeFollow,
	dataListEvent: TypeSpotListDataEvent,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = FOLLOW_ENDPOINTS.PUT_FOLLOW;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	await followListEvent(dataListEvent);
	return followResponseSchema.parse(response);
};
export const useUpdateFollowSpotListQuery = ({
	dataListEvent,
	searchQuery,
	...props
}: UseUpdateFollowSpotListQuery) => {
	const currentQueryClient = useQueryClient();
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	let searchQueryValidated = searchQuery ?? '';

	return useMutation({
		mutationFn: (values: TypeFollow) => {
			return fetchPostFollowSpotList(values, dataListEvent, userInfo);
		},
		onMutate: async () => {
			return await updateOptimisticWhenFollowList({
				currentQueryClient,
				searchQuery: searchQueryValidated,
				...props,
			});
		},
		onError: (err: Error, _, context) => {
			console.error(err);

			onErrorOptimisticWhenFollowList({
				currentQueryClient,
				context,
				searchQuery: searchQueryValidated,
				...props,
			});
		},
		onSuccess: () => {
			invalidationWhenFollowList({
				currentQueryClient,
				searchQuery: searchQueryValidated,
				...props,
			});

			currentQueryClient.invalidateQueries({
				queryKey: ['feed'],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['followingFeed'],
			});
		},
	});
};
