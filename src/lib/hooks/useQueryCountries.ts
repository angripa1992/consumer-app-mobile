import { useQuery } from '@tanstack/react-query';

import { getData } from '../helpers/getData';
import { COUNTRIES_ENDPOINTS, FILTER_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import {
	countriesSchemaResponseSchema,
	getCountryByIpResponseSchema,
} from '../schemas/countries';
import { postData } from '../helpers/postData';
import { TypeGetCountryByIpValuesToSend } from '../types/countries';
import { getIp } from '@mobeuv/react-native-check-ip';
import { useShallow } from 'zustand/react/shallow';

// ...

// GET COUNTRIES
const fetchGetCountries = async (userInfo: string) => {
	const endpoint = COUNTRIES_ENDPOINTS.GET_COUNTRIES;
	const response = await getData(endpoint, userInfo);

	return countriesSchemaResponseSchema.parse(response);
};
export const useGetCountries = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['countries'],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetCountries(userInfo);
		},
		staleTime: 3 * 60 * 60 * 1000, // 3 hours
		cacheTime: 6 * 60 * 60 * 1000, // 6 hours
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
	return {
		countries: data?.countries,
		isLoading,
		isError,
		error,
	};
};

// POST COUNTRY BY IP
const fetchPostCountryByIp = async () => {
	const result = await getIp();
	const ip = result?.ipv4;

	if (!ip) return null;
	const valuesToSend: TypeGetCountryByIpValuesToSend = { user_ip: ip };

	const endpoint = COUNTRIES_ENDPOINTS.POST_COUNTRY_BY_IP;
	const response = await postData(endpoint, valuesToSend);

	return getCountryByIpResponseSchema.parse(response);
};
export const usePostCountryByIp = () => {
	const { setIsLoading } = useAppStore();

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['countryByIp'],
		queryFn: async () => {
			setIsLoading(true);
			return fetchPostCountryByIp();
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
		country: data?.country,
		isLoading,
		isError,
		error,
	};
};
