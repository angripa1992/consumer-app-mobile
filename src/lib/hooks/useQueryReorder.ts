import { useMutation, useQueryClient } from '@tanstack/react-query';

import { putDataWithToken } from '../helpers/putData';
import { useAppStore } from '../store/store';
import { SPOT_SPOT_LIST_ENDPOINTS } from '../utils/routes';
import { TypeReorderSpotListValuesToSend } from '../types/spotList';
import { reorderSpotListResponseSchema } from '../schemas/spotList';
import { auth } from '../../../config/firebase';
import { useShallow } from 'zustand/react/shallow';

//PUT SPOT REORDER
const fetchPutSpotReorderList = async (
	values: TypeReorderSpotListValuesToSend,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_SPOT_LIST_ENDPOINTS.PUT_ORDER_SPOT_SPOT_LIST;
	const response = await putDataWithToken(endpoint, values, idToken, userInfo);
	return reorderSpotListResponseSchema.parse(response);
};
export const useSpotReorderList = (spotListId: number) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypeReorderSpotListValuesToSend) => {
			setIsLoading(true);
			return fetchPutSpotReorderList(values, userInfo);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			currentQueryClient.invalidateQueries({
				queryKey: ['spotListAllSpots', spotListId],
			});

			currentQueryClient.invalidateQueries({
				queryKey: ['spotListSpots', spotListId],
				refetchType: 'all',
			});
			setIsLoading(false);
		},
	});
};
