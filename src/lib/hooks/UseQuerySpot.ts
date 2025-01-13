import { i18nInstance } from 'config/i18n';
import { useToast } from 'react-native-toast-notifications';
import {
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import type { AxiosError } from 'axios';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/react-native';

import {
	spotSingleToUserPageResponseSchema,
	getCandidateSpotsResponseSchema,
	getDetailsSpotCandidateResponseSchema,
	getAllAvailableSpotsResponseSchema,
	getAllUserSpotSchemaResponse,
	spotImageResponseSchema,
	spotInteractionsResponseSchema,
	getFollowingLikesForSpotResponseSchema,
	getGeneralLikesForSpotResponseSchema,
	hasRelationshipSpotAndListRequestBody,
	postRelationshipSpotAndListResponseSchema,
} from '../schemas/spot';

import { useAppStore } from '../store/store';
import { auth } from '../../../config/firebase';
import { getDataWithToken } from '../helpers/getData';
import { postDataWithToken, postFormData } from '../helpers/postData';
import { deleteDataWithToken } from '../helpers/deleteData';
import {
	getFollowingFeaturedListsFromSpotResponseSchema,
	getGeneralFeaturedListsFromSpotResponseSchema,
} from '../schemas/spotList';
import {
	AUTHORIZED_SPOTS,
	SPOT_ENDPOINTS,
	USER_SPOTS_ENDPOINTS,
} from '../utils/routes';
import {
	ALL_CITIES,
	LIMIT_FEATURED_LISTS,
	LIMIT_LIKES_FOR_SPOT,
	LIMIT_SEARCH_SPOT_AVAILABLE,
	LIMIT_SEARCH_SPOT_CANDIDATES,
} from '@/utils/constants';

import type {
	TypeAuthorizedSpotValuesToSend,
	TypeHasRelationshipSpotAndListRequestBody,
	TypePostSearchCandidate,
	TypeSpotImageValues,
	TypeSpotImageValuesToSend,
} from '../types/spot';

// GET SINGLE SPOT
const fetchGetSingleSpot = async (
	userInfo: string,
	spotId?: number | string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !spotId) return null;

	const endpoint = SPOT_ENDPOINTS.GET_SINGLE_SPOT(spotId);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return spotSingleToUserPageResponseSchema.parse(response);
};
export const useGetSingleSpot = (
	spotId?: number | string,
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
		queryKey: ['singleSpot', spotId],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetSingleSpot(userInfo, spotId);
		},
		onError: (err) => {
			setIsLoading(false);
			setIsErrorScreen(true);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		enabled,
	});
	return {
		singleSpot: data?.spot,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// POST SEARCH SPOT CANDIDATES
const fetchGetSpotCandidates = async (
	values: TypePostSearchCandidate,
	offset: number,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_ENDPOINTS.POST_SEARCH_CANDIDATES(
		LIMIT_SEARCH_SPOT_CANDIDATES,
		offset,
	);
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return getCandidateSpotsResponseSchema.parse(response);
};
export const useGetSpotCandidates = (
	values: TypePostSearchCandidate,
	currentCity: string,
	isSearchDone: boolean,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	const { name: spotNameQuery, spot_list_id: spotListId } = values;

	const {
		data,
		isError,
		error,
		isLoading,
		refetch,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	} = useInfiniteQuery({
		queryKey: ['spotCandidates', spotNameQuery, currentCity, spotListId],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetSpotCandidates(values, pageParam, userInfo);
		},
		getNextPageParam: (lastPage, allPages) => {
			const isLastPage = lastPage?.api_spots ?? false;
			if (isLastPage) return undefined;
			return allPages.flatMap((page) => page?.spots ?? []).length;
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		enabled: isSearchDone,
	});

	return {
		spotCandidates: data?.pages.flatMap((page) => page?.spots ?? []),
		isLoading,
		isError,
		error,
		refetch,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
	};
};

// GET DETAILS SINGLE CANDIDATE SPOT
const fetchGetDetailsSingleCandidateSpot = async (
	googlePlaceLocationId?: number | string,
	userInfo?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !googlePlaceLocationId) return null;

	const endpoint = SPOT_ENDPOINTS.GET_DETAILS_SPOT_CANDIDATE(
		googlePlaceLocationId,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo!);

	return getDetailsSpotCandidateResponseSchema.parse(response);
};
export const useGetDetailsSingleCandidateSpot = (
	googlePlaceLocationId?: number | string,
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
		queryKey: ['singleSpotCandidate', googlePlaceLocationId],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetDetailsSingleCandidateSpot(
				googlePlaceLocationId,
				userInfo,
			);
		},
		onError: (err: AxiosError) => {
			const errorCode = err?.response?.status;
			setIsLoading(false);
			console.error(err);

			if (errorCode !== 504) {
				setIsErrorScreen(true);
			}
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
	return {
		singleCandidateSpot: data?.spot,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// GET ALL AVAILABLE SPOTS
const fetchGetAllAvailableSpots = async (
	spotListId: number,
	currentCity: string,
	offset: number,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !spotListId) return null;

	const endpoint = SPOT_ENDPOINTS.GET_ALL_SPOTS_AVAILABLE(
		spotListId,
		currentCity,
		LIMIT_SEARCH_SPOT_AVAILABLE,
		offset,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo!);

	return getAllAvailableSpotsResponseSchema.parse(response);
};
export const useGetAllAvailableSpots = (
	spotListId: number,
	currentCity: string,
) => {
	const { setIsLoading, setIsErrorScreen, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			setIsErrorScreen: state.setIsErrorScreen,
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
		queryKey: ['allAvailableSpots', spotListId, currentCity],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetAllAvailableSpots(
				spotListId,
				currentCity,
				pageParam,
				userInfo,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.spots?.length ?? 0;
			if (lastPageLength < LIMIT_SEARCH_SPOT_AVAILABLE) return undefined;
			return allPages.flatMap((page) => page?.spots ?? []).length;
		},

		onError: (err) => {
			setIsLoading(false);
			setIsErrorScreen(true);
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
		allAvailableSpots: data?.pages.flatMap((page) => page?.spots ?? []),
		isLoading,
		isError,
		error,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	};
};

// GET ALL SPOTS RELATED TO AN USER
const fetchGetAllUserSpots = async (userInfo: string, userId?: number) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!userId || !idToken) return null;

	const endpoint = USER_SPOTS_ENDPOINTS.GET_ALL_USER_SPOTS(userId);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getAllUserSpotSchemaResponse.parse(response);
};
export const useGetAllUserSpots = (userId?: number, enabled?: boolean) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['allUserSpots', userId],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetAllUserSpots(userInfo, userId);
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
		enabled,
	});
	return {
		allUserSpots: data?.spots_user,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// DELETE USER SPOT
const fetchDeleteUserSpot = async (
	userId?: number | null,
	spotId?: number | null,
	userInfo?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId || !spotId) return null;

	const endpoint = USER_SPOTS_ENDPOINTS.DELETE_USER_SPOT(userId, spotId);
	const response = await deleteDataWithToken(endpoint, idToken, userInfo!);
	return response;
};
export const useDeleteUserSpot = (userIdToInvalidate?: number | null) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: {
			userId?: number | null;
			spotId?: number | null;
		}) => {
			setIsLoading(true);
			return fetchDeleteUserSpot(values.userId, values.spotId, userInfo);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			currentQueryClient.invalidateQueries({ queryKey: ['user', user?.id] });
			currentQueryClient.invalidateQueries({ queryKey: ['allSpotList'] });
			currentQueryClient.invalidateQueries({
				queryKey: ['allUserSpots', userIdToInvalidate],
			});
			setIsLoading(false);
		},
	});
};

// GET SPOT IMAGE
const fetchGetSpotImage = async (
	userInfo: string,
	values: TypeSpotImageValues,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return null;

	const {
		tripAdvisorLocationId,
		spotGooglePlacesId,
		googleImageName,
		imageSize,
	} = values;

	let valuesToSend: TypeSpotImageValuesToSend = {
		image_size: imageSize,
	};

	if (tripAdvisorLocationId) {
		valuesToSend.tripadvisor_location_id = tripAdvisorLocationId;
	} else if (spotGooglePlacesId) {
		valuesToSend.spot_google_places_id = spotGooglePlacesId;
	} else if (googleImageName) {
		valuesToSend.google_image_name = googleImageName;
	} else {
		return null;
	}

	const endpoint = SPOT_ENDPOINTS.POST_SPOT_IMAGE;
	const response = await postDataWithToken(
		endpoint,
		valuesToSend,
		idToken,
		userInfo,
	);

	return spotImageResponseSchema.parse(response);
};
export const useGetSpotImage = (
	values: TypeSpotImageValues,
	enabled?: boolean,
) => {
	const { username, email } = useAppStore(
		useShallow((state) => ({
			username: state.user?.name,
			email: state.user?.email,
		})),
	);

	const userInfo = username ? `${username} - ${email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['spotImage', values],
		refetchInterval: false,
		refetchIntervalInBackground: false,
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 30 * 60 * 1000, // 30 minutes
		queryFn: async () => {
			return fetchGetSpotImage(userInfo, values);
		},
		onError: (err) => {
			console.error(err);
		},
		retry: false,
		enabled,
	});

	return {
		spotImage: data?.spot_image === 'empty' ? null : data?.spot_image,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// CREATE SPOT
const fetchPostAuthorizedSpot = async (
	values: TypeAuthorizedSpotValuesToSend,
	userInfo?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = AUTHORIZED_SPOTS.POST_AUTHORIZED_SPOT;
	const response = await postFormData(endpoint, values, idToken, userInfo!);

	return response;
};
export const usePostAuthorizedSpot = () => {
	const toast = useToast();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypeAuthorizedSpotValuesToSend) => {
			setIsLoading(true);
			return fetchPostAuthorizedSpot(values, userInfo);
		},
		onError: (err: AxiosError) => {
			setIsLoading(false);
			const errorCode = err?.response?.status;

			if (errorCode === 409) {
				toast.show(i18nInstance.t('spotAlreadyExist'), {
					type: 'danger',
				});
			} else {
				toast.show(i18nInstance.t('errorWhileCreatingSpot'), {
					type: 'danger',
				});
			}
			console.error(err);
		},
		onSuccess: () => {
			toast.show(i18nInstance.t('spotAddedSuccessfully'), {
				type: 'success',
			});
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

// GET SINGLE SPOT INTERACTIONS
const fetchGetSpotInteractions = async (
	userInfo: string,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return null;
	if (!spotId && !googlePlacesId) return null;

	const endpoint = SPOT_ENDPOINTS.GET_SPOT_INTERACTIONS(spotId, googlePlacesId);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return spotInteractionsResponseSchema.parse(response);
};

export const useGetSpotInteractions = (
	spotId?: number,
	googlePlacesId?: string,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			setIsErrorScreen: state.setIsErrorScreen,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['spotInteractions', spotId ? spotId : googlePlacesId],
		queryFn: async () => {
			setIsLoading(true);

			return fetchGetSpotInteractions(userInfo, spotId, googlePlacesId);
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		retry: false,
	});

	return {
		spotInteractions: data,
		isLoadingSpotInteractions: isLoading,
		isErrorSpotInteractions: isError,
		errorSpotInteractions: error,
		refetchSpotInteractions: refetch,
	};
};

// GET GENERAL LIKES FOR SPOT
const fetchGetGeneralLikesForSpot = async (
	userInfo: string,
	offset: number,
	userId?: number,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return undefined;
	if (!spotId && !googlePlacesId) return undefined;

	const endpoint = SPOT_ENDPOINTS.GET_GENERAL_LIKES_FOR_SPOT(
		userId,
		LIMIT_LIKES_FOR_SPOT,
		offset,
		spotId,
		googlePlacesId,
	);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getGeneralLikesForSpotResponseSchema.parse(response);
};
export const useGetGeneralLikesForSpot = (
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
		isError,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['likesForSpot', spotId ? spotId : googlePlacesId],
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetGeneralLikesForSpot(
				userInfo,
				pageParam,
				user?.id,
				spotId,
				googlePlacesId,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.data_community_spot.length ?? 0;
			if (lastPageLength < LIMIT_LIKES_FOR_SPOT) return undefined;
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

	return {
		generalLikesForSpot: data?.pages.flatMap(
			(page) => page?.data_community_spot ?? [],
		),
		isErrorGeneralLikesFor: isError,
		isLoadingGeneralLikesFor: isLoading,
		hasNextPageGeneralLikesFor: hasNextPage,
		fetchNextPageGeneralLikesFor: fetchNextPage,
		isFetchingNextPageGeneralLikesFor: isFetchingNextPage,
		refetchGeneralLikesFor: refetch,
	};
};

// GET FOLLOWING LIKES FOR SPOT
const fetchGetFollowingLikesForSpot = async (
	userInfo: string,
	offset: number,
	userId?: number,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !userId) return undefined;
	if (!spotId && !googlePlacesId) return undefined;

	const endpoint = SPOT_ENDPOINTS.GET_FOLLOWING_LIKES_FOR_SPOT(
		userId,
		LIMIT_LIKES_FOR_SPOT,
		offset,
		spotId,
		googlePlacesId,
	);

	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getFollowingLikesForSpotResponseSchema.parse(response);
};
export const useGetFollowingLikesForSpot = (
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
		isError,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['followingLikesForSpot', spotId ? spotId : googlePlacesId],
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetFollowingLikesForSpot(
				userInfo,
				pageParam,
				user?.id,
				spotId,
				googlePlacesId,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.data_following_spot?.length ?? 0;
			if (lastPageLength < LIMIT_LIKES_FOR_SPOT) return undefined;
			return allPages.flatMap((page) => page?.data_following_spot ?? [])
				?.length;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		followingLikesForSpot: data?.pages.flatMap(
			(page) => page?.data_following_spot ?? [],
		),
		isErrorFollowingLikesFor: isError,
		isLoadingFollowingLikesFor: isLoading,
		hasNextPageFollowingLikesFor: hasNextPage,
		fetchNextPageFollowingLikesFor: fetchNextPage,
		isFetchingNextPageFollowingLikesFor: isFetchingNextPage,
		refetchFollowingLikesFor: refetch,
	};
};

// GET GENERAL FEATURED LISTS
const fetchGetGeneralFeaturedLists = async (
	userInfo: string,
	pageParam: number,
	userId?: number,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return undefined;
	if (!spotId && !googlePlacesId) return undefined;

	const endpoint = SPOT_ENDPOINTS.GET_GENERAL_FEATURED_LISTS(
		userId,
		LIMIT_FEATURED_LISTS,
		pageParam,
		spotId,
		googlePlacesId,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getGeneralFeaturedListsFromSpotResponseSchema.parse(response);
};
export const useGetGeneralFeaturedLists = (
	spotId?: number,
	googlePlacesId?: string,
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
		queryKey: ['featuredLists', spotId ? spotId : googlePlacesId],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetGeneralFeaturedLists(
				userInfo,
				pageParam,
				user?.id,
				spotId,
				googlePlacesId,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.featured_spot_list?.length ?? 0;
			if (lastPageLength < LIMIT_FEATURED_LISTS) return undefined;
			return allPages.flatMap((page) => page?.featured_spot_list ?? []).length;
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
		generalFeaturedLists: data?.pages.flatMap(
			(page) => page?.featured_spot_list ?? [],
		),
		isLoadingGeneralFeaturedLists: isLoading,
		isErrorGeneralFeaturedLists: isError,
		errorGeneralFeaturedLists: error,
		hasNextPageGeneralFeaturedLists: hasNextPage,
		fetchNextPageGeneralFeaturedLists: fetchNextPage,
		isFetchingNextPageGeneralFeaturedLists: isFetchingNextPage,
		refetchGeneralFeaturedLists: refetch,
	};
};

// GET FOLLOWING FEATURED LISTS
const fetchGetFollowingFeaturedLists = async (
	userInfo: string,
	pageParam: number,
	userId?: number,
	spotId?: number,
	googlePlacesId?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return undefined;
	if (!spotId && !googlePlacesId) return undefined;

	const endpoint = SPOT_ENDPOINTS.GET_FOLLOWING_FEATURED_LISTS(
		userId,
		LIMIT_FEATURED_LISTS,
		pageParam,
		spotId,
		googlePlacesId,
	);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getFollowingFeaturedListsFromSpotResponseSchema.parse(response);
};
export const useGetFollowingFeaturedLists = (
	spotId?: number,
	googlePlacesId?: string,
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
		queryKey: ['followingFeaturedLists', spotId ? spotId : googlePlacesId],
		queryFn: async ({ pageParam }) => {
			setIsLoading(true);
			return fetchGetFollowingFeaturedLists(
				userInfo,
				pageParam,
				user?.id,
				spotId,
				googlePlacesId,
			);
		},
		getNextPageParam: (lastPage, allPages) => {
			const lastPageLength = lastPage?.following_spot_list?.length ?? 0;
			if (lastPageLength < LIMIT_FEATURED_LISTS) return undefined;
			return allPages.flatMap((page) => page?.following_spot_list ?? []).length;
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
		followingFeatureLists: data?.pages.flatMap(
			(page) => page?.following_spot_list ?? [],
		),
		isLoadingFollowingFeaturedLists: isLoading,
		isErrorFollowingFeaturedLists: isError,
		errorFollowingFeaturedLists: error,
		hasNextPageFollowingFeaturedLists: hasNextPage,
		fetchNextPageFollowingFeaturedLists: fetchNextPage,
		isFetchingNextPageFollowingFeaturedLists: isFetchingNextPage,
		refetchFollowingFeaturedLists: refetch,
	};
};

// POST HAS RELATIONSHIP SPOT AND LIST
const fetchPostHasRelationshipSpotAndList = async (
	values: TypeHasRelationshipSpotAndListRequestBody,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_ENDPOINTS.POST_HAS_RELATIONSHIP_SPOT_AND_LIST;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return postRelationshipSpotAndListResponseSchema.parse(response);
};
export const usePostHasRelationshipSpotAndList = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: TypeHasRelationshipSpotAndListRequestBody) => {
			setIsLoading(true);
			return fetchPostHasRelationshipSpotAndList(values, userInfo);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};
