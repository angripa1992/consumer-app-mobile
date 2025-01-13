import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { getDataWithToken } from '../helpers/getData';
import { VIEW_MORE_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';

import { auth } from '../../../config/firebase';
import {
	viewMoreCategories,
	viewMoreHomeResponseSchema,
	viewMorePopularLists,
	viewMorePopularPeople,
	viewMorePopularSpots,
	viewMoreUserSpotsResponseSchema,
} from '../schemas/viewMore';
import {
	TypePostSearchDiscovery,
	TypePostSpotsNearby,
} from '../types/discovery';
import { postDataWithToken } from '../helpers/postData';
import { AxiosError } from 'axios';
import { getSpotsNearbyResponseSchema } from '../schemas/discovery';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/react-native';
import { LIMIT_VIEW_MORE } from '../utils/constants';
import { useShallow } from 'zustand/react/shallow';

// GET VIEW MORE HOME
const fetchGetViewMoreHome = async (
	userInfo: string,
	city: string,
	categoryName: string,
	pageParam: number,
	userId?: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!userId) return undefined;
	if (!idToken) return undefined;

	const endpoint = VIEW_MORE_ENDPOINTS.GET_VIEW_MORE_HOME(
		userId,
		city,
		categoryName,
		LIMIT_VIEW_MORE,
		pageParam,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return viewMoreHomeResponseSchema.parse(response);
};
export const useGetViewMoreHome = (city: string, categoryName: string) => {
	const { setIsLoading, user, setIsErrorScreen } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
			setIsErrorScreen: state.setIsErrorScreen,
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
		queryKey: ['viewMore', categoryName, city],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetViewMoreHome(
				userInfo,
				city,
				categoryName,
				pageParam,
				user?.id,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.spot_lists?.length ?? 0;
			if (lastPageLength < LIMIT_VIEW_MORE) return undefined;
			return allPages.flatMap((page) => page?.spot_lists ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}

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

// GET VIEW USER SPOTS
const fetchGetViewMoreUserSpots = async (
	userInfo: string,
	userId: number,
	tag: string,
	pageParam: number,
	city: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const endpoint = VIEW_MORE_ENDPOINTS.GET_VIEW_MORE_USER_SPOTS(
		userId,
		tag,
		LIMIT_VIEW_MORE,
		pageParam,
		city,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return viewMoreUserSpotsResponseSchema.parse(response);
};
export const useGetViewMoreUserSpots = (
	userId: number,
	tag: string,
	city: string,
) => {
	const { setIsLoading, user, setIsErrorScreen } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
			setIsErrorScreen: state.setIsErrorScreen,
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
		queryKey: ['viewMoreUserSpots', userId, tag, city],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetViewMoreUserSpots(userInfo, userId, tag, pageParam, city);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.spots_user?.length ?? 0;
			if (lastPageLength < LIMIT_VIEW_MORE) return undefined;
			return allPages.flatMap((page) => page?.spots_user ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
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
		userSpots: data?.pages.flatMap((page) => page?.spots_user ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET VIEW MORE POPULAR LISTS
const fetchGetViewMorePopularLists = async (
	userInfo: string,
	values: TypePostSearchDiscovery,
	city: string,
	categoryName: string,
	pageParam: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = VIEW_MORE_ENDPOINTS.POST_VIEW_MORE_DISCOVERY_CATEGORIES(
		city,
		categoryName,
		LIMIT_VIEW_MORE,
		pageParam,
	);
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return viewMorePopularLists.parse(response);
};
export const useGetViewMorePopularLists = (
	city: string,
	categoryName: string,
	values: TypePostSearchDiscovery,
) => {
	const { setIsLoading, user, setIsErrorScreen } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
			setIsErrorScreen: state.setIsErrorScreen,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { search_content } = values;

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
		queryKey: ['viewMorePopularLists', search_content, city],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetViewMorePopularLists(
				userInfo,
				values,
				city,
				categoryName,
				pageParam,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.popular_lists?.length ?? 0;
			if (lastPageLength < LIMIT_VIEW_MORE) return undefined;
			return allPages.flatMap((page) => page?.popular_lists ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
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
		popularLists: data?.pages.flatMap((page) => page?.popular_lists ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET VIEW MORE POPULAR SPOTS
const fetchGetViewMorePopularSpots = async (
	userInfo: string,
	values: TypePostSearchDiscovery,
	city: string,
	categoryName: string,
	pageParam: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = VIEW_MORE_ENDPOINTS.POST_VIEW_MORE_DISCOVERY_CATEGORIES(
		city,
		categoryName,
		LIMIT_VIEW_MORE,
		pageParam,
	);
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return viewMorePopularSpots.parse(response);
};
export const useGetViewMorePopularSpots = (
	city: string,
	categoryName: string,
	values: TypePostSearchDiscovery,
) => {
	const { setIsLoading, user, setIsErrorScreen } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
			setIsErrorScreen: state.setIsErrorScreen,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { search_content } = values;

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
		queryKey: ['viewMorePopularSpots', search_content, city],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetViewMorePopularSpots(
				userInfo,
				values,
				city,
				categoryName,
				pageParam,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.popular_spots?.length ?? 0;
			if (lastPageLength < LIMIT_VIEW_MORE) return undefined;
			return allPages.flatMap((page) => page?.popular_spots ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
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
		popularSpots: data?.pages.flatMap((page) => page?.popular_spots ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET VIEW MORE POPULAR PEOPLE
const fetchGetViewMorePopularPeople = async (
	userInfo: string,
	values: TypePostSearchDiscovery,
	city: string,
	categoryName: string,
	pageParam: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = VIEW_MORE_ENDPOINTS.POST_VIEW_MORE_DISCOVERY_CATEGORIES(
		city,
		categoryName,
		LIMIT_VIEW_MORE,
		pageParam,
	);
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return viewMorePopularPeople.parse(response);
};
export const useGetViewMorePopularPeople = (
	city: string,
	categoryName: string,
	values: TypePostSearchDiscovery,
) => {
	const { setIsLoading, user, setIsErrorScreen } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
			setIsErrorScreen: state.setIsErrorScreen,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { search_content } = values;

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
		queryKey: ['viewMorePopularPeople', search_content, city],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetViewMorePopularPeople(
				userInfo,
				values,
				city,
				categoryName,
				pageParam,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.popular_people?.length ?? 0;
			if (lastPageLength < LIMIT_VIEW_MORE) return undefined;
			return allPages.flatMap((page) => page?.popular_people ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
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
		popularPeople: data?.pages.flatMap((page) => page?.popular_people ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET VIEW MORE CATEGORIES
const fetchGetViewMoreCategories = async (
	userInfo: string,
	values: TypePostSearchDiscovery,
	city: string,
	categoryName: string,
	pageParam: number,
	tagSpotList: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = VIEW_MORE_ENDPOINTS.POST_VIEW_MORE_DISCOVERY_CATEGORIES(
		city,
		categoryName,
		LIMIT_VIEW_MORE,
		pageParam,
		tagSpotList,
	);
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return viewMoreCategories.parse(response);
};
export const useGetViewMoreCategories = (
	city: string,
	tagSpotList: string,
	values: TypePostSearchDiscovery,
) => {
	const { setIsLoading, user, setIsErrorScreen } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
			setIsErrorScreen: state.setIsErrorScreen,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { search_content } = values;

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
		queryKey: ['viewMoreCategories', search_content, city, tagSpotList],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetViewMoreCategories(
				userInfo,
				values,
				city,
				'categories',
				pageParam,
				tagSpotList,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.spot_lists?.length ?? 0;
			if (lastPageLength < LIMIT_VIEW_MORE) return undefined;
			return allPages.flatMap((page) => page?.spot_lists ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
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

// GET VIEW MORE SPOTS NEARBY

export const fetchGetViewMoreSpotsNearby = async (
	userInfo: string,
	values: TypePostSpotsNearby,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	const { city, latitude, longitude } = values;

	if (!idToken || !city || !latitude || !longitude) return null;

	const endpoint = VIEW_MORE_ENDPOINTS.GET_SPOTS_NEARBY;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return getSpotsNearbyResponseSchema.parse(response);
};
export const useGetViewMoreSpotsNearby = (values: TypePostSpotsNearby) => {
	const { setIsLoading, user, setIsErrorScreen, setIsNotFoundScreen } =
		useAppStore(
			useShallow((state) => ({
				setIsLoading: state.setIsLoading,
				user: state.user,
				setIsErrorScreen: state.setIsErrorScreen,
				setIsNotFoundScreen: state.setIsNotFoundScreen,
			})),
		);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	const { city, latitude, longitude } = values;

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['spotsNearby', city, latitude, longitude],
		queryFn: () => {
			setIsLoading(isLoading);
			return fetchGetViewMoreSpotsNearby(userInfo, values);
		},
		onSuccess: (data) => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			setIsNotFoundScreen(true);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		enabled: !!city && !!latitude && !!longitude,
	});

	return {
		spotsNearby: data?.spots,
		isLoading,
		isError,
		error,
		refetch,
	};
};
