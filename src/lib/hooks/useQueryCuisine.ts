import { useQuery } from '@tanstack/react-query';

import { getDataWithToken } from '../helpers/getData';
import { CUISINE_ENDPOINTS } from '../utils/routes';

import { User } from 'firebase/auth';
import { useAppStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow';
import { auth } from '../../../config/firebase';
import { getAllCuisineTypesSchemaResponse } from '../schemas/cuisine';

// GET ALL CUISINE TYPES
const fetchGetAllCuisineTypes = async (userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return null;

	const endpoint = CUISINE_ENDPOINTS.GET_ALL_CUISINE_TYPES;
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return getAllCuisineTypesSchemaResponse.parse(response);
};
export const useGetAllCuisineTypes = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['allCuisineTypes'],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetAllCuisineTypes(userInfo);
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
		allCuisineTypes: data?.cuisine_types,
		isLoading,
		isError,
		error,
	};
};
