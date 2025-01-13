import { useQuery } from '@tanstack/react-query';

import { getData } from '../helpers/getData';
import { FILTER_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import { tagsSchemaResponseSchema } from '../schemas/tags';
import { useShallow } from 'zustand/react/shallow';

// GET TAGS
const fetchGetTags = async (userInfo: string) => {
	const endpoint = FILTER_ENDPOINTS.GET_TAGS;
	const response = await getData(endpoint, userInfo);

	return tagsSchemaResponseSchema.parse(response);
};
export const useGetTags = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['tags'],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetTags(userInfo);
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
		tags: data?.tags,
		isLoading,
		isError,
		error,
	};
};
