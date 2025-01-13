import { auth } from 'config/firebase';
import * as Sentry from '@sentry/react-native';

import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '../store/store';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { ZodError } from 'zod';

import { LIMIT_NOTIFICATIONS } from '../utils/constants';
import { NOTIFICATIONS_ENDPOINTS } from '../utils/routes';
import { postDataWithToken } from '../helpers/postData';
import { deleteDataWithToken } from '../helpers/deleteData';
import { getDataWithToken } from '../helpers/getData';
import {
	getNotificationTokensResponseSchema,
	notificationsResponseSchema,
} from '../schemas/notifications';

import type { AxiosError } from 'axios';

export const fetchGetNotificationTokens = async () => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const endpoint = NOTIFICATIONS_ENDPOINTS.GET_TOKENS;

	const response = await getDataWithToken(endpoint, idToken, '');

	return getNotificationTokensResponseSchema.parse(response);
};

// GET NOTIFICATIONS

const fetchGetNotifications = async (userInfo: string, offset: number) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const endpoint = NOTIFICATIONS_ENDPOINTS.GET_NOTIFICATIONS(
		LIMIT_NOTIFICATIONS,
		offset,
	);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return notificationsResponseSchema.parse(response);
};

export const useGetNotifications = () => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['notifications', user?.id],
		queryFn: async ({ pageParam }) => {
			return fetchGetNotifications(userInfo, pageParam);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageNotifications = lastPage?.notifications.length ?? 0;

			if (lastPageNotifications < LIMIT_NOTIFICATIONS) return undefined;

			return allPages.flatMap((page) => page?.notifications.length ?? [])
				.length;
		},

		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
		},
	});

	return {
		notifications: data?.pages.flatMap((page) => page?.notifications ?? []),
		fetchNextPageNotifications: fetchNextPage,
		hasNextPageNotifications: hasNextPage,
		isFetchingNextPageNotifications: isFetchingNextPage,
		isLoadingNotifications: isLoading,
		refetchNotifications: refetch,
	};
};

// POST NOTIFICATION TOKEN

const fetchPostNotificationToken = async (
	token: string,
	userId: number | undefined,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !userId) return undefined;

	const values = {
		user_id: userId,
		token: token,
	};

	const endpoint = NOTIFICATIONS_ENDPOINTS.POST_USER_NOTIFICATIONS_TOKEN;

	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return response;
};

export const usePostNotificationToken = () => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (token: string) => {
			return fetchPostNotificationToken(token, user?.id, userInfo);
		},
		onError: (err: Error) => {
			console.error(err);
		},
	});
};

// DELETE NOTIFICATION TOKEN

const fetchDeleteNotificationToken = async (
	token: string,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const endpoint =
		NOTIFICATIONS_ENDPOINTS.DELETE_USER_NOTIFICATIONS_TOKEN(token);

	const response = await deleteDataWithToken(endpoint, idToken, userInfo);

	return response;
};

export const useDeleteNotificationToken = () => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (token: string) => {
			return fetchDeleteNotificationToken(token, userInfo);
		},
		onError: (err: Error) => {
			console.error(err);
		},
	});
};
