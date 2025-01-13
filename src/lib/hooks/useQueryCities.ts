import { useQuery } from '@tanstack/react-query';

import { getData } from '../helpers/getData';
import { FILTER_ENDPOINTS, CITY_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import {
	citiesSchemaResponseSchema,
	getAllActiveCitiesResponseSchema,
	getAllAreasByCityResponseSchema,
} from '../schemas/cities';
import { useShallow } from 'zustand/react/shallow';
import { postData, postDataWithToken } from '../helpers/postData';
import { TypeGetAllAreasByCityValuesSchema } from '../types/cities';
import { auth } from 'config/firebase';

// GET CITIES
const fetchGetCities = async (userInfo: string) => {
	const endpoint = FILTER_ENDPOINTS.GET_CITIES;
	const response = await getData(endpoint, userInfo);

	return citiesSchemaResponseSchema.parse(response);
};
export const useGetCities = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['cities'],
		refetchOnWindowFocus: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		staleTime: 1 * 60 * 60 * 1000, // 1 hours
		cacheTime: 30 * 60 * 1000, // 30 minutes
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetCities(userInfo);
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
		cities: data?.cities,
		isLoading,
		isError,
		error,
	};
};

// GET ALL ACTIVE CITIES
const fetchGetAllActiveCities = async (userInfo: string) => {
	const endpoint = CITY_ENDPOINTS.GET_ALL_ACTIVE_CITIES;
	const response = await getData(endpoint, userInfo);

	return getAllActiveCitiesResponseSchema.parse(response);
};
export const useGetAllActiveCities = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['allActiveCities'],
		refetchOnWindowFocus: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		staleTime: 1 * 60 * 60 * 1000, // 1 hours
		cacheTime: 30 * 60 * 1000, // 30 minutes
		queryFn: async () => {
			return fetchGetAllActiveCities(userInfo);
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
		allActiveCities: data?.cities,
		isLoading,
		isError,
		error,
	};
};

const fetchGetAllAreasByCity = async (
	values: TypeGetAllAreasByCityValuesSchema | undefined,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const valuesToSend = values ?? {};
	const endpoint = CITY_ENDPOINTS.GET_ALL_AREAS_BY_CITY;
	const response = await postDataWithToken(
		endpoint,
		valuesToSend,
		idToken,
		userInfo,
	);

	return getAllAreasByCityResponseSchema.parse(response);
};
export const useGetAllAreasByCity = (
	values: TypeGetAllAreasByCityValuesSchema | undefined,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const cityName = values?.city_name ?? '';

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['areas', cityName],
		refetchOnWindowFocus: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		staleTime: 1 * 60 * 60 * 1000,
		cacheTime: 30 * 60 * 1000,
		queryFn: async () => {
			return fetchGetAllAreasByCity(values, userInfo);
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
		allAreasByCity: data?.areas ?? [],
		isLoading,
		isError,
		error,
	};
};
