import { useToast } from 'react-native-toast-notifications';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { i18nInstance } from 'config/i18n';
import { auth } from '../../../config/firebase';
import { useAppStore } from '../store/store';
import { invalidationsWhenUpdateOrRemoveScribble } from '../helpers/invalidatons/invalidationsForScribbles';
import { getDataWithToken } from '../helpers/getData';
import { postDataWithToken, postFormData } from '../helpers/postData';
import { putDataWithToken, putFormData } from '../helpers/putData';
import {
	getAllUserScribblesResponseSchema,
	getFollowingScribblesForSpotResponseSchema,
	getGeneralScribblesForSpotResponseSchema,
	getScribblesRecommendationsResponseSchema,
} from '../schemas/scribbles';
import { deleteDataWithToken } from '../helpers/deleteData';
import { SCRIBBLES_ENDPOINTS } from '../utils/routes';
import { LIMIT_SCRIBBLES } from '../utils/constants';

import type { AxiosError } from 'axios';
import type { TypeAddOrEditScribbleValues, TypeGetAllUserScribblesParams } from '../types/scribbles';
import type { TypeQueriesMutateDestination } from '../types/queries';

// GET SINGLE SCRIBBLE
const fetchGetSingleScribble = async (userInfo: string, scribbleId?: number) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !scribbleId) return undefined;

	const endpoint = SCRIBBLES_ENDPOINTS.GET_SINGLE_SCRIBBLE(scribbleId);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return response;
}
export const useGetSingleScribble = (
	scribbleId?: number
) => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['singleScribble', scribbleId],
		queryFn: () => {
			return fetchGetSingleScribble(userInfo, scribbleId);
		}
	})

	return {
		singleScribbleData: data,
		isError,
		error,
		isLoading,
		refetch
	}
}

// GET GENERAL SCRIBBLES
const fetchGetGeneralScribbles = async (
	userInfo: string,
	offset: number,
	userId?: number,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return undefined;
	if (!spotId && !googlePlacesId) return undefined;

	const endpoint = SCRIBBLES_ENDPOINTS.GET_GENERAL_SCRIBBLES(
		userId,
		LIMIT_SCRIBBLES,
		offset,
		spotId,
		googlePlacesId,
	);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getGeneralScribblesForSpotResponseSchema.parse(response);
};
export const useGetGeneralScribbles = (
	spotId?: number,
	googlePlacesId?: string,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['scribbles', spotId],
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetGeneralScribbles(
				userInfo,
				pageParam,
				user?.id,
				spotId,
				googlePlacesId,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.data_community_spot.length ?? 0;
			if (lastPageLength < LIMIT_SCRIBBLES) return undefined;
			return allPages.flatMap((page) => page?.data_community_spot ?? []).length;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const isErrorGeneralScribbles = () => {
		const errorCode = (error as AxiosError)?.response?.status;

		return error instanceof Error || errorCode === 500;
	};

	return {
		generalScribbles: data?.pages.flatMap(
			(page) => page?.data_community_spot ?? [],
		),
		isErrorGeneralScribbles: isErrorGeneralScribbles(),
		isLoadingGeneralScribbles: isLoading,
		hasNextPageGeneralScribbles: hasNextPage,
		fetchNextPageGeneralScribbles: fetchNextPage,
		isFetchingNextPageGeneralScribbles: isFetchingNextPage,
		refetchGeneralScribbles: refetch,
	};
};

// GET FOLLOWING SCRIBBLES
const fetchGetFollowingScribbles = async (
	userInfo: string,
	offset: number,
	userId?: number,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return undefined;
	if (!spotId && !googlePlacesId) return undefined;

	const endpoint = SCRIBBLES_ENDPOINTS.GET_FOLLOWING_SCRIBBLES(
		userId,
		LIMIT_SCRIBBLES,
		offset,
		spotId,
		googlePlacesId,
	);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getFollowingScribblesForSpotResponseSchema.parse(response);
};
export const useGetFollowingScribbles = (
	spotId?: number,
	googlePlacesId?: string,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['followingScribbles', spotId],
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetFollowingScribbles(
				userInfo,
				pageParam,
				user?.id,
				spotId,
				googlePlacesId,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.data_following_spot.length ?? 0;
			if (lastPageLength < LIMIT_SCRIBBLES) return undefined;
			return allPages.flatMap((page) => page?.data_following_spot ?? []).length;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	const isErrorFollowingScribbles = () => {
		const errorCode = (error as AxiosError)?.response?.status;

		return error instanceof Error || errorCode === 500;
	};

	return {
		followingScribbles: data?.pages.flatMap(
			(page) => page?.data_following_spot ?? [],
		),
		isErrorFollowingScribbles: isErrorFollowingScribbles(),
		isLoadingFollowingScribbles: isLoading,
		hasNextPageFollowingScribbles: hasNextPage,
		fetchNextPageFollowingScribbles: fetchNextPage,
		isFetchingNextPageFollowingScribbles: isFetchingNextPage,
		refetchFollowingScribbles: refetch,
	};
};

//POST SCRIBBLE
const fetchPostScribble = async (
	values: TypeAddOrEditScribbleValues,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return null;

	const endpoint = SCRIBBLES_ENDPOINTS.POST_SCRIBBLE;
	const response = await postFormData(endpoint, values, idToken, userInfo);

	return response;
};
export const usePostScribble = (
	queryMutationDestination: TypeQueriesMutateDestination,
	spotId?: number,
	googlePlacesLocationId?: string,
) => {
	const toast = useToast();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: TypeAddOrEditScribbleValues) => {
			setIsLoading(true);
			return fetchPostScribble(values, userInfo);
		},
		onError: (err: AxiosError) => {
			toast.show(i18nInstance.t('somethingWentWrong'));
			setIsLoading(false);
			console.error(err);
		},
		onSuccess: () => {
			toast.show(i18nInstance.t('scribbleCreated'), {
				type: 'success',
			});
			setIsLoading(false);

			currentQueryClient.invalidateQueries({
				queryKey: ['singleSpotCandidate', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['singleSpot', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['singleSpotCandidate', googlePlacesLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', googlePlacesLocationId],
			});

			currentQueryClient.invalidateQueries({
				queryKey: [queryMutationDestination, spotId],
				refetchPage: (_, index) => index === 0,
			});
		},
	});
};

//PUT SCRIBBLE
const fetchPutScribble = async (
	values: TypeAddOrEditScribbleValues,
	scribbleId: number,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SCRIBBLES_ENDPOINTS.PUT_SCRIBBLE(scribbleId);
	const response = await putFormData(endpoint, values, idToken, userInfo);

	return response;
};
export const usePutScribble = (
	queryMutateDestination: TypeQueriesMutateDestination,
	scribbleId: number,
	spotId?: number,
	googlePlacesLocationId?: string,
) => {
	const toast = useToast();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: TypeAddOrEditScribbleValues) => {
			setIsLoading(true);
			return fetchPutScribble(values, scribbleId, userInfo);
		},
		onError: (err: AxiosError) => {
			toast.show(i18nInstance.t('somethingWentWrong'));
			setIsLoading(false);
			console.error(err);
		},
		onSuccess: () => {
			toast.show(i18nInstance.t('scribbleUpdate'), {
				type: 'success',
			});
			setIsLoading(false);

			invalidationsWhenUpdateOrRemoveScribble({
				queryMutateDestination,
				currentQueryClient,
				spotId,
				scribbleId,
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['singleSpotCandidate', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['singleSpot', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['singleSpotCandidate', googlePlacesLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', googlePlacesLocationId],
			});
		},
	});
};

//DELETE SCRIBBLE
const fetchDeleteScribble = async (scribbleId: number, userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SCRIBBLES_ENDPOINTS.DELETE_SCRIBBLE(scribbleId);
	const response = await deleteDataWithToken(endpoint, idToken, userInfo);

	return response;
};
export const useDeleteScribble = (
	queryMutateDestination: TypeQueriesMutateDestination,
	scribbleId: number,
	spotId?: number,
) => {
	const toast = useToast();
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
			return fetchDeleteScribble(scribbleId, userInfo);
		},
		onError: (err: AxiosError) => {
			toast.show(i18nInstance.t('somethingWentWrong'));
			setIsLoading(false);
			console.error(err);
		},
		onSuccess: () => {
			toast.show(i18nInstance.t('scribbleDeleted'), {
				type: 'success',
			});
			setIsLoading(false);

			invalidationsWhenUpdateOrRemoveScribble({
				currentQueryClient,
				queryMutateDestination,
				spotId,
				scribbleId,
			});
		},
	});
};

// GET SCRIBBLE RECOMMENDATIONS
export const fetchGetScribbleRecommendations = async (
	userInfo: string,
	id: number | string,
	isFromGooglePlace?: boolean,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SCRIBBLES_ENDPOINTS.GET_SCRIBBLES_RECOMMENDATIONS(
		id,
		isFromGooglePlace,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getScribblesRecommendationsResponseSchema.parse(response);
};
export const useGetScribbleRecommendations = (
	id: number | string,
	isFromGooglePlace?: boolean,
) => {
	const { username, email } = useAppStore(
		useShallow((state) => ({
			username: state.user?.username,
			email: state.user?.email,
		})),
	);

	const userInfo = username ? `${username} - ${email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['scribblesRecommendation', id],
		queryFn: () => {
			return fetchGetScribbleRecommendations(userInfo, id, isFromGooglePlace);
		},
	});

	return {
		scribblesRecommendations: data,
		isErrorScribblesRecommendations: isError,
		isLoadingScribblesRecommendations: isLoading,
		refetchScribblesRecommendations: refetch,
	};
};

// GET USER SCRIBBLES
const fetchGetUserScribbles = async (values: TypeGetAllUserScribblesParams, offset: number, userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SCRIBBLES_ENDPOINTS.GET_ALL_USER_SCRIBBLES(
		values.userId,
		values.scribbleOption,
		offset,
		LIMIT_SCRIBBLES,
		values?.city
	);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getAllUserScribblesResponseSchema.parse(response);
};
export const useGetUserScribbles = (values: TypeGetAllUserScribblesParams) => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['userScribbles', values.userId],
		queryFn: async ({ pageParam = 0 }) => {
			return fetchGetUserScribbles(values, pageParam, userInfo);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.scribbles.length ?? 0;
			if (lastPageLength < LIMIT_SCRIBBLES) return undefined;
			return allPages.flatMap((page) => page?.scribbles ?? []).length;
		},
		onError: (err) => {
			console.error(err);
		},
	});

	const isErrorScribblesFromUser = () => {
		const errorCode = (error as AxiosError)?.response?.status;

		return error instanceof Error || errorCode === 500;
	};

	return {
		userScribbles: data?.pages.flatMap((page) => page?.scribbles ?? []),
		isErrorUserScribbles: isErrorScribblesFromUser(),
		isLoadingUserScribbles: isLoading,
		hasNextPageUserScribbles: hasNextPage,
		fetchNextPageUserScribbles: fetchNextPage,
		isFetchingNextUserScribbles: isFetchingNextPage,
		refetchUserScribbles: refetch,
	};
};