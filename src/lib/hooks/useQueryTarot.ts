import { useShallow } from 'zustand/react/shallow';

import { TAROT_ENDPOINTS } from '../utils/routes';
import { auth } from '../../../config/firebase';
import { getDataWithToken } from '../helpers/getData';
import { useAppStore } from '../store/store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import {
	getAllTarotShapesResponseSchema,
	getAllTarotCodesResponseSchema,
	getSingleTarotUserResponseSchema,
} from '../schemas/tarot';
import { putDataWithToken } from '../helpers/putData';
import { TypeUpdateTarotCardValues } from '../types/tarot';
import { useToast } from 'react-native-toast-notifications';
import { i18nInstance } from 'config/i18n';

// GET ALL TAROT SHAPES
const fetchGetAllTarotShapes = async (userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = TAROT_ENDPOINTS.GET_ALL_TAROT_SHAPES;
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getAllTarotShapesResponseSchema.parse(response);
};
export const useGetAllTarotShapes = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['allTarotShapes'],
		queryFn: () => {
			setIsLoading(isLoading);
			return fetchGetAllTarotShapes(userInfo);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		allTarotShapes: data?.tarot_shapes,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// GET ALL TAROT CODES
const fetchGetAllTarotCodes = async (userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;

	const endpoint = TAROT_ENDPOINTS.GET_ALL_TAROT_CODES;
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getAllTarotCodesResponseSchema.parse(response);
};
export const useGetAllTarotCodes = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['allTarotCodes'],
		queryFn: () => {
			setIsLoading(isLoading);
			return fetchGetAllTarotCodes(userInfo);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		allTarotCodes: data?.tarot_codes,
		isLoading,
		isError,
		error,
		refetch,
	};
};

// GET SINGLE TAROT USER
const fetchGetSingleTarotUser = async (userInfo: string, userId?: number) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return undefined;

	const endpoint = TAROT_ENDPOINTS.GET_SINGLE_TAROT_USER(userId);
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getSingleTarotUserResponseSchema.parse(response);
};
export const useGetSingleTarotUser = (userId?: number) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['singleTarotUser', userId],
		queryFn: () => {
			setIsLoading(isLoading);
			return fetchGetSingleTarotUser(userInfo, userId);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		singleTarotUser: data?.tarot_user,
		isLoading,
		isError,
		error,
		refetch,
	};
};

const fetchPutSingleTarotUser = async (
	values: TypeUpdateTarotCardValues,
	userInfo: string,
	userId?: number | null,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return null;

	const endpoint = TAROT_ENDPOINTS.PUT_SINGLE_TAROT_USER(userId);
	const response = await putDataWithToken(endpoint, values, idToken, userInfo);

	return response;
};
export const usePutSingleTarotUser = () => {
	const toast = useToast();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userId = user?.id;

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: any) => {
			setIsLoading(true);
			return fetchPutSingleTarotUser(values, userInfo, userId);
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
			toast.show(i18nInstance.t('somethingWentWrong'));
		},
		onSettled: () => {
			currentQueryClient.invalidateQueries({
				queryKey: ['singleTarotUser', userId],
			});
			setIsLoading(false);
		},
	});
};
