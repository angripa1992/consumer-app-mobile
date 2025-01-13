import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postDataWithToken } from '../helpers/postData';
import { useAppStore } from '../store/store';
import { BLOCK_ENDPOINTS } from '../utils/routes';

import type { TypePostPutBlockUser } from '../types/block';
import { createUpdateBlockUserSchema } from '../schemas/block';
import { putDataWithToken } from '../helpers/putData';
import { auth } from '../../../config/firebase';
import { useShallow } from 'zustand/react/shallow';

// POST BLOCK USER
const fetchPostBlockUser = async (
	values: TypePostPutBlockUser,
	userInfo: string,
	userId?: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return null;

	const endpoint = BLOCK_ENDPOINTS.POST_BLOCK_USER(userId);
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return createUpdateBlockUserSchema.parse(response);
};
export const usePostBlockUser = (userId?: number) => {
	const currentQueryClient = useQueryClient();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypePostPutBlockUser) => {
			setIsLoading(true);
			return fetchPostBlockUser(values, userInfo, userId);
		},
		onSuccess: () => {
			currentQueryClient.invalidateQueries(['user']);
			currentQueryClient.invalidateQueries(['allSpotList']);
		},
		onError: (err: Error) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

// PUT UNBLOCK USER
const fetchPutUnblockUser = async (
	values: TypePostPutBlockUser,
	userInfo: string,
	userId?: number,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken || !userId) return null;

	const endpoint = BLOCK_ENDPOINTS.PUT_BLOCK_USER(userId);
	const response = await putDataWithToken(endpoint, values, idToken, userInfo);

	return createUpdateBlockUserSchema.parse(response);
};
export const usePutUnblockUser = (userId?: number) => {
	const currentQueryClient = useQueryClient();
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypePostPutBlockUser) => {
			setIsLoading(true);
			return fetchPutUnblockUser(values, userInfo, userId);
		},
		onSuccess: () => {
			currentQueryClient.invalidateQueries(['user']);
			currentQueryClient.invalidateQueries(['allSpotList']);
		},
		onError: (err: Error) => {
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};
