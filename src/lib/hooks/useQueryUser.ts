import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import * as Sentry from '@sentry/react-native';
import { ZodError } from 'zod';
import { useShallow } from 'zustand/react/shallow';
import type { AxiosError } from 'axios';
import { APP_VERSION } from '../utils/constants';

import { useAppStore } from '../store/store';
import { auth } from '../../../config/firebase';
import { USER_ENDPOINTS } from '../utils/routes';
import { LIMIT_USER_FOLLOWERS, LIMIT_USER_LISTS } from '../utils/constants';

import { getData, getDataWithToken } from '../helpers/getData';
import { putFormData } from '../helpers/putData';
import { postDataWithToken } from '../helpers/postData';
import { deleteDataWithToken } from '../helpers/deleteData';

import {
	userSignInResponseSchema,
	userGetSingleResponseSchema,
	getAllRelevantUsersResponseSchema,
	postUserPreferencesResponseSchema,
	userListsResponseSchema,
	followUsersResponseSchema,
	appVersionResponseSchema,
} from '../schemas/user';

import type { TypePostOnboardingPreferences } from '../types/onboarding';
import type { TypeUserSignIn, TypeUserSingleResponse } from '../types/user';
import { getVersionStatus } from '../helpers/appVersion';

// POST SIGN IN
const fetchPostSignIn = async (
	user: Partial<TypeUserSignIn> & { code: string | null },
	idToken: string | null,
) => {
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	if (!idToken || !user) return null;

	const userValues = () => {
		const { code, ...userValues } = user;
		if (code) {
			return user;
		}

		return userValues;
	};

	const response = await postDataWithToken(
		USER_ENDPOINTS.SIGN_IN,
		userValues(),
		idToken,
		userInfo,
	);

	return userSignInResponseSchema.parse(response);
};
export const useSingInUserQuery = () => {
	const { setUser, setIsLoading } = useAppStore(
		useShallow((state) => ({
			setUser: state.setUser,
			setIsLoading: state.setIsLoading,
		})),
	);

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (req: {
			idToken: string;
			user: Partial<TypeUserSignIn> & { code: string | null };
		}) => {
			setIsLoading(true);
			return fetchPostSignIn(req.user, req.idToken);
		},
		onSuccess: (data) => {
			const user = data?.user;

			if (user && data.code !== 202) {
				queryClient.setQueryData(['appUser'], user);
				setUser(user);
			}
			setIsLoading(false);
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(' Error in useSingInUserQuery hook: ', err);
		},
	});
};

export const fetchGetAuthUser = async (userInfo: string, userId?: number) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return null;

	const endpoint = USER_ENDPOINTS.GET_USER(userId);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return userGetSingleResponseSchema.parse(response);
};
export const useGetUser = (userId?: number) => {
	const {
		setUser,
		appUserId,
		username,
		email,
		setIsErrorScreen,
		setIsNotFoundScreen,
	} = useAppStore(
		useShallow((state) => ({
			setUser: state.setUser,
			username: state.user?.username,
			email: state.user?.email,
			appUserId: state.user?.id,
			setIsErrorScreen: state.setIsErrorScreen,
			setIsNotFoundScreen: state.setIsNotFoundScreen,
		})),
	);

	const userInfo = username ? `${username} - ${email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['user', userId],
		refetchOnWindowFocus: false,
		enabled: !!userId,
		queryFn: () => {
			return fetchGetAuthUser(userInfo, userId);
		},
		onSuccess: (data: TypeUserSingleResponse) => {
			if (appUserId === data.user.id) {
				setUser(data.user);
			}
			return data;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}

			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			setIsNotFoundScreen(true);
		},
	});

	return {
		user: data?.user,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// UPDATE USER
const fetchPutSingleUser = async (
	values: any,
	userId?: number | null,
	userInfo?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return null;

	const endpoint = USER_ENDPOINTS.PUT_USER(userId);
	const response = await putFormData(endpoint, values, idToken, userInfo!);

	return response;
};
export const usePutSingleUser = (userId?: number | null) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: any) => {
			setIsLoading(true);
			return fetchPutSingleUser(values, userId, userInfo);
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			currentQueryClient.invalidateQueries({
				queryKey: ['user', userId],
			});
			setIsLoading(false);
		},
	});
};

// DELETE USER
const fetchDeleteUser = async (userId?: number | null) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return null;

	const endpoint = USER_ENDPOINTS.DELETE_USER(userId);
	const response = await deleteDataWithToken(endpoint, idToken);

	return response;
};
export const useDeleteUser = (userId?: number | null) => {
	const { setIsLoading } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
		})),
	);

	return useMutation({
		mutationFn: () => {
			setIsLoading(true);
			return fetchDeleteUser(userId);
		},
		onError: (err: Error) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

// GET RELEVANT USERS
export const fetchGetRelevantUsers = async (userInfo: string, city: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = USER_ENDPOINTS.GET_RELEVANT_USERS(city);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getAllRelevantUsersResponseSchema.parse(response);
};
export const useGetRelevantUsers = (city: string) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user?.username} - ${user?.email}` : 'Not exists';
	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['relevantUsers'],
		refetchOnWindowFocus: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		queryFn: () => {
			setIsLoading(true);
			return fetchGetRelevantUsers(userInfo, city);
		},
		onError: (err) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		relevantUsers: data?.relevant_profiles,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// POST ONBOARDING PREFERENCES
const fetchPostOnboardingPreferences = async (
	values: TypePostOnboardingPreferences,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !values) return null;

	const response = await postDataWithToken(
		USER_ENDPOINTS.POST_ONBOARDING_PREFERENCES,
		values,
		idToken,
		userInfo,
	);

	return postUserPreferencesResponseSchema.parse(response);
};
export const usePostOnboardingPreferences = () => {
	const { user, setIsLoading } = useAppStore(
		useShallow((state) => ({
			user: state.user,
			setIsLoading: state.setIsLoading,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: TypePostOnboardingPreferences) => {
			setIsLoading(true);
			return fetchPostOnboardingPreferences(values, userInfo);
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: (data) => {
			setIsLoading(false);
		},
	});
};

// GET USER LISTS
const fetchGetUserLists = async (
	userInfo: string,
	categoryName: string,
	pageParam: number,
	userId: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = USER_ENDPOINTS.GET_USER_LISTS(
		categoryName,
		LIMIT_USER_LISTS,
		pageParam,
		userId,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return userListsResponseSchema.parse(response);
};
export const useGetUserLists = (userId: number, categoryName: string) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		isError,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['userLists', userId, categoryName],
		refetchInterval: false,
		refetchIntervalInBackground: false,
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetUserLists(userInfo, categoryName, pageParam, userId);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.spot_lists?.length ?? 0;
			if (lastPageLength < LIMIT_USER_LISTS) return undefined;
			return allPages.flatMap((page) => page?.spot_lists ?? []).length;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
	return {
		spotLists: data?.pages.flatMap((page) => page?.spot_lists ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET USER FOLLOWERS AND FOLLOWING USERS

const fetchGetFollowUsers = async (
	userInfo: string,
	userId: number,
	queryUser: string,
	pageParam: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = USER_ENDPOINTS.GET_USER_FOLLOW_USERS(
		userId,
		queryUser,
		LIMIT_USER_FOLLOWERS,
		pageParam,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return followUsersResponseSchema.parse(response);
};
export const useGetFollowUsers = (userId: number, queryUser: string) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const queryName =
		queryUser === 'followers' ? 'followersUsers' : 'followingUsers';

	const {
		data,
		isError,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: [queryName, userId],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetFollowUsers(userInfo, userId, queryUser, pageParam);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.users?.length ?? 0;
			if (lastPageLength < LIMIT_USER_FOLLOWERS) return undefined;
			return allPages.flatMap((page) => page?.users ?? []).length;
		},
		onError: (err) => {
			setIsLoading(false);

			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
	return {
		followUsers: data?.pages.flatMap((page) => page?.users ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET APP VERSION

const fetchGetAppVersion = async (userInfo: string) => {
	const endpoint = USER_ENDPOINTS.GET_APP_VERSION;
	const response = await getData(endpoint, userInfo);

	return appVersionResponseSchema.parse(response);
};
export const useGetAppVersion = () => {
	const { email, username } = useAppStore(
		useShallow((state) => ({
			username: state.user?.username,
			email: state.user?.email,
		})),
	);
	const userInfo = username ? `${username} - ${email}` : 'Not exists';

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['appVersion'],
		refetchOnWindowFocus: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		staleTime: 1 * 60 * 60 * 1000, // 1 hours
		queryFn: async () => {
			return fetchGetAppVersion(userInfo);
		},
		onError: (err) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
		},
		select: (data) => {
			const appVersion = data?.app_version;
			const minVersion = appVersion?.min_version;
			const latestRecommendedVersion = appVersion?.latest_recommended_version;
			if (!APP_VERSION || !minVersion || !latestRecommendedVersion)
				return 'unknown';
			return getVersionStatus(
				APP_VERSION,
				minVersion,
				latestRecommendedVersion,
			);
		},
	});
	return {
		appVersion: data,
		isLoadingAppVersion: isLoading,
		isErrorAppVersion: isError,
		errorAppVersion: error,
	};
};
