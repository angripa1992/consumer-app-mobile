import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

import { getDataMeasuringPerfWithToken } from '../helpers/analytics/getDataWithPerf';
import { postDataWithToken } from '../helpers/postData';
import { useAppStore } from '../store/store';
import { SPOT_LIST_ENDPOINTS } from '../utils/routes';

import { AxiosError } from 'axios';
import { auth } from '../../../config/firebase';
import { deleteDataWithToken } from '../helpers/deleteData';
import { getDataWithToken } from '../helpers/getData';
import { putDataWithToken } from '../helpers/putData';
import {
	getRelevantSpotListSchemaResponse,
	postSingleListDataResponse,
	spotListSinglePageResponseSchema,
	spotListsHomeResponseSchema,
	spotsFromSpotListSinglePageSchema,
} from '../schemas/spotList';
import {
	TypeCreateSpotList,
	TypeSpotListDataEvent,
	TypeUpdateSpotList,
} from '../types/spotList';
import { createListEvent } from '../helpers/analytics/customEvents';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/react-native';
import { useToast } from 'react-native-toast-notifications';
import { useShallow } from 'zustand/react/shallow';
import {
	LIMIT_FEATURED_LISTS,
	LIMIT_SPOT_LIST_SPOTS,
} from '../utils/constants';
import { i18nInstance } from 'config/i18n';

// GET ALL SPOT LISTS
const isTestingEnvironment =
	process.env.EXPO_PUBLIC_TEST_AXIOS_INSTANCE === 'true';

const fetchGetAllSpotList = async (
	country: string,
	city: string,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.GET_ALL_SPOT_LISTS(country, city);
	const response = isTestingEnvironment
		? await getDataWithToken(endpoint, idToken, userInfo)
		: await getDataMeasuringPerfWithToken(endpoint, idToken, userInfo);

	return spotListsHomeResponseSchema.parse(response);
};
export const useGetAllSpotList = (
	country: string,
	city: string,
	enabled?: boolean,
) => {
	const { setIsLoading, setIsErrorScreen, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			setIsErrorScreen: state.setIsErrorScreen,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['allSpotList', country, city],
		select: (data) => {
			return data;
		},
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetAllSpotList(country, city, userInfo);
		},
		onError: (err) => {
			setIsLoading(false);
			setIsErrorScreen(true);
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
		},
		onSettled: () => {
			setIsLoading(false);
		},
		enabled,
	});
	return {
		userSpotListCategories: data?.user_categories,
		isLoading,
		isError,
		error,
		refetch,
	};
};

//GET SINGLE SPOT LIST
const fetchGetSpotList = async (userInfo: string, idSpotList?: number) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;
	if (!idSpotList) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.GET_SINGLE_SPOT_LIST(idSpotList);
	const response = isTestingEnvironment
		? await getDataWithToken(endpoint, idToken, userInfo)
		: await getDataMeasuringPerfWithToken(endpoint, idToken, userInfo);

	return spotListSinglePageResponseSchema.parse(response);
};
export const useGetSpotList = (idSpotList?: number) => {
	const { setIsLoading, setIsErrorScreen, user, setIsNotFoundScreen } =
		useAppStore(
			useShallow((state) => ({
				setIsLoading: state.setIsLoading,
				setIsErrorScreen: state.setIsErrorScreen,
				user: state.user,
				setIsNotFoundScreen: state.setIsNotFoundScreen,
			})),
		);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['spotList', idSpotList],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetSpotList(userInfo, idSpotList);
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
	});

	return {
		spotList: data?.spot_list,
		isLoading,
		isError,
		error,
		refetch,
	};
};

//GET SPOTS FROM SPOT LIST
const fetchGetSpotsFromSpotList = async (
	userInfo: string,
	idSpotList: number,
	pageParam: number,
	limit?: number,
	userId?: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !userId || !limit) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.GET_SPOTS_FROM_SPOT_LIST(
		idSpotList,
		userId,
		limit,
		pageParam,
	);

	const response = isTestingEnvironment
		? await getDataWithToken(endpoint, idToken, userInfo)
		: await getDataMeasuringPerfWithToken(endpoint, idToken, userInfo);

	return spotsFromSpotListSinglePageSchema.parse(response);
};

export const useGetSpotsFromSpotList = (
	idSpotList: number,
	limit?: number,
	enabled?: boolean,
) => {
	const { setIsLoading, setIsErrorScreen, user, setIsNotFoundScreen } =
		useAppStore(
			useShallow((state) => ({
				setIsLoading: state.setIsLoading,
				setIsErrorScreen: state.setIsErrorScreen,
				user: state.user,
				setIsNotFoundScreen: state.setIsNotFoundScreen,
			})),
		);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['spotListAllSpots', idSpotList],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetSpotsFromSpotList(
				userInfo,
				idSpotList,
				0,
				limit,
				user?.id,
			);
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
		enabled: limit ? enabled : false,
	});

	return {
		spots: data?.spots,
		isLoading,
		isError,
		error,
		refetch,
	};
};

export const useGetSpotsFromSpotListWithInfiniteQuery = (
	idSpotList: number,
) => {
	const { setIsLoading, setIsErrorScreen, user, setIsNotFoundScreen } =
		useAppStore(
			useShallow((state) => ({
				setIsLoading: state.setIsLoading,
				setIsErrorScreen: state.setIsErrorScreen,
				user: state.user,
				setIsNotFoundScreen: state.setIsNotFoundScreen,
			})),
		);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		isError,
		error,
		isLoading,
		refetch,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: ['spotListSpots', idSpotList],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetSpotsFromSpotList(
				userInfo,
				idSpotList,
				pageParam,
				LIMIT_SPOT_LIST_SPOTS,
				user?.id,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.spots?.length ?? 0;
			if (lastPageLength < LIMIT_SPOT_LIST_SPOTS) return undefined;
			return allPages.flatMap((page) => page?.spots ?? []).length;
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			if (errorCode !== 404) {
				setIsErrorScreen(true);
				return;
			}
			setIsNotFoundScreen(true);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		spots: data?.pages.flatMap((page) => page?.spots ?? []),
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
		isLoading,
		isError,
		error,
		refetch,
	};
};

//POST SPOT LIST
const fetchPostSpotList = async (
	values: TypeCreateSpotList,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.POST_SPOT_LIST;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	const dataCreateListEvent: TypeSpotListDataEvent = {
		list_id: response.spot_list.id,
		list_name: values.name,
		list_creator: response.spot_list.creator,
	};

	await createListEvent(dataCreateListEvent);
	return postSingleListDataResponse.parse(response);
};
export const usePostSpotList = () => {
	const toast = useToast();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypeCreateSpotList) => {
			setIsLoading(true);
			return fetchPostSpotList(values, userInfo);
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			if (errorCode === 409) {
				toast.show(i18nInstance.t('listNameAlreadyExist'));
			} else {
				toast.show(i18nInstance.t('somethingWentWrong'));
			}
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

//PUT SPOT LIST
const fetchPutSpotList = async (
	values: TypeUpdateSpotList,
	userInfo: string,
	idSpotList?: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !idSpotList) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.PUT_SPOT_LIST(idSpotList);
	const response = await putDataWithToken(endpoint, values, idToken, userInfo);
	return response;
};
export const usePutSpotList = (idSpotList?: number) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypeUpdateSpotList) => {
			setIsLoading(true);
			return fetchPutSpotList(values, userInfo, idSpotList);
		},
		onSuccess: () => {
			setIsLoading(false);
			currentQueryClient.invalidateQueries(['spotList']);
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

//DELETE SPOT LIST
const fetchDeleteSpotList = async (
	idSpotList?: number | null,
	userInfo?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !idSpotList) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.DELETE_SPOT_LIST(idSpotList);
	const response = await deleteDataWithToken(endpoint, idToken, userInfo!);
	return response;
};
export const useDeleteSpotList = (idSpotList?: number | null) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: () => {
			setIsLoading(true);
			return fetchDeleteSpotList(idSpotList, userInfo);
		},
		onSuccess: () => {
			setIsLoading(false);
			currentQueryClient.invalidateQueries({
				queryKey: ['userLists', user?.id, 'my_list'],
				refetchType: 'all',
			});
			// Pending to add city when city-country filter is in zustand
			currentQueryClient.invalidateQueries({
				queryKey: ['allSpotList'],
				refetchType: 'all',
			});
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

// GET RELEVANT LISTS
export const fetchGetRelevantLists = async (userInfo: string, city: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.GET_RELEVANT_SPOT_LISTS(city);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getRelevantSpotListSchemaResponse.parse(response);
};
export const useGetRelevantLists = (city: string) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user?.username} - ${user?.email}` : 'Not exists';
	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['relevantLists'],
		queryFn: () => {
			setIsLoading(true);
			return fetchGetRelevantLists(userInfo, city);
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
		relevantLists: data?.relevant_spot_lists,
		isLoading,
		isError,
		error,
		refetch,
	};
};
