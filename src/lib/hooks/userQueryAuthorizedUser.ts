import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postData } from '../helpers/postData';
import { AUTHORIZED_USERS } from '../utils/routes';
import { useAppStore } from '../store/store';

import { postUserSingleWaitListResponseSchema } from '../schemas/waitList';
import type { TypePostWaitListUserValues } from '../types/waitList';
import { useShallow } from 'zustand/react/shallow';

// POST SINGLE WAITLIST USER
const fetchPostSingleWaitListUser = async (
	values: TypePostWaitListUserValues,
) => {
	if (!values) return null;

	const endpoint = AUTHORIZED_USERS.POST_AUTHORIZED_USER;
	const response = await postData(endpoint, values);

	return postUserSingleWaitListResponseSchema.parse(response);
};
export const usePostSingleWaitListUser = () => {
	const { setIsLoading } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
		})),
	);

	return useMutation({
		mutationFn: (values: TypePostWaitListUserValues) => {
			setIsLoading(true);
			return fetchPostSingleWaitListUser(values);
		},
		onError: (err) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};
