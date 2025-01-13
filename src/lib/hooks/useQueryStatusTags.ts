import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { SPOT_STATUS_TAGS_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import { updateStatusTagsInSingleSpotResponseSchema } from '../schemas/status';
import { putDataWithToken } from '../helpers/putData';
import { auth } from '../../../config/firebase';
import { addStatusTagsEvent } from '../helpers/analytics/customEvents';
import {
	onErrorOptimisticWhenUpdateStatusTags,
	updateOptimisticWhenUpdateStatusTags,
} from '../helpers/optimistic/optimisticUpdatesForSpots';
import { invalidationsWhenUpdateStatusTags } from '../helpers/invalidatons/invalidationForSpots';

import type {
	TypeAddStatusTagsEvent,
	TypeAddStatusTagsToSpot,
} from '../types/spot';
import type { PartialOptional } from '../types/partialOptional';
import type { UseUpdateStatusTagsInSingleSpot } from '../types/queries';

// PUT STATUS TAGS IN SINGLE SPOT AND SPOT CANDIDATE
const fetchPutStatusTagsInSingleSpot = async (
	values: PartialOptional<TypeAddStatusTagsToSpot, 'spotType'>,
	dataStatusTagsEvent: TypeAddStatusTagsEvent,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_STATUS_TAGS_ENDPOINTS.UPDATE_SPOT_STATUS_TAGS;
	const response = await putDataWithToken(endpoint, values, idToken, userInfo);

	await addStatusTagsEvent(dataStatusTagsEvent);
	return updateStatusTagsInSingleSpotResponseSchema.parse(response);
};
export const useUpdateStatusTagsInSingleSpot = ({
	searchQuery,
	...props
}: UseUpdateStatusTagsInSingleSpot) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const searchQueryValidate = searchQuery ?? '';

	return useMutation({
		mutationFn: ({
			values,
			dataStatusTagsEvent,
		}: {
			values: TypeAddStatusTagsToSpot;
			dataStatusTagsEvent: TypeAddStatusTagsEvent;
		}) => {
			const { spotType, ...rest } = values;
			setIsLoading(true);
			return fetchPutStatusTagsInSingleSpot(
				rest,
				dataStatusTagsEvent,
				userInfo,
			);
		},
		onMutate: async ({ values }) => {
			const { is_been_to, is_like_spot } = values;

			const getStatusTag = () => {
				if (is_been_to !== undefined) {
					return 'is_been_to';
				}
				if (is_like_spot !== undefined) {
					return 'is_like_spot';
				}
				return 'is_saved';
			};

			const statusTagToUpdate = getStatusTag();

			const newStatusTags = {
				[statusTagToUpdate]: !values[statusTagToUpdate],
			};

			await updateOptimisticWhenUpdateStatusTags({
				currentQueryClient,
				searchQuery: searchQueryValidate,
				newStatusTags,
				...props,
			});
		},
		onError: (err: Error, _, context) => {
			setIsLoading(false);
			console.error(err);

			onErrorOptimisticWhenUpdateStatusTags({
				currentQueryClient,
				searchQuery: searchQueryValidate,
				context,
				...props,
			});
		},
		onSuccess: () => {
			currentQueryClient.invalidateQueries(['viewMoreUserSpots']);
			currentQueryClient.invalidateQueries(['allAvailableSpots']);

			invalidationsWhenUpdateStatusTags({
				currentQueryClient,
				searchQuery: searchQueryValidate,
				...props,
			});
			setIsLoading(false);
		},
	});
};
