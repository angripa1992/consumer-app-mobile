import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SPOT_LIST_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import { deleteSpotFromSpotListResponseSchema } from '../schemas/spot';
import { SPOT_SPOT_LIST_ENDPOINTS } from '../utils/routes';
import { deleteDataWithToken } from '../helpers/deleteData';
import { TypeAddSpotToSpotList } from '../types/spotList';
import { postDataWithToken } from '../helpers/postData';
import { auth } from '../../../config/firebase';
import { postSpotToSpotListResponseSchema } from '../schemas/spotSpotList';
import { UseDeleteSpotFromList, UsePostSpotToSpotList } from '../types/queries';
import { PartialOptional } from '../types/partialOptional';
import { TypeAddSpotToSpotListEvent } from '../types/spot';
import { addSpotToSpotListEvent } from '../helpers/analytics/customEvents';
import { updateOptimisticWhenAddSpotInSpotList } from '../helpers/optimistic/optimisticUpdatesForAddingSpots';
import { useShallow } from 'zustand/react/shallow';
import { onErrorOptimisticWhenAddSpotInSpotList } from '../helpers/optimistic/optimisticUpdatesForAddingSpots';
import {
	onErrorOptimisticWhenRemoveSpotInSpotList,
	updateOptimisticWhenRemoveSpotInSpotList,
} from '../helpers/optimistic/optimisticUpdatesForRemovingSpots';
import { invalidationsWhenAddSpotInSpotList } from '../helpers/invalidatons/invalidationsForAddingSpots';
import { invalidationWhenRemoveSpotInSpotList } from '../helpers/invalidatons/invalidationsForRemovingSpots';

// DELETE SPOT FROM SPOT_LIST
const fetchDeleteSpotFromList = async (
	spotSpotListId?: number | null,
	userInfo?: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken || !spotSpotListId) return null;

	const endpoint =
		SPOT_SPOT_LIST_ENDPOINTS.DELETE_SPOT_SPOT_LIST(spotSpotListId);
	const response = await deleteDataWithToken(endpoint, idToken, userInfo!);

	return deleteSpotFromSpotListResponseSchema.parse(response);
};

export const useDeleteSpotFromList = ({
	queryMutateDestination,
	spotSpotListId,
	spotListId,
	searchQuery,
	currentCity,
	spotId,
	googlePlaceLocationId,
}: UseDeleteSpotFromList) => {
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
		mutationFn: () => {
			setIsLoading(true);
			return fetchDeleteSpotFromList(spotSpotListId, userInfo);
		},
		onMutate: async () => {
			if (spotSpotListId) {
				await updateOptimisticWhenRemoveSpotInSpotList({
					currentQueryClient,
					queryMutateDestination,
					spotSpotListId,
					spotListId,
					searchQuery: searchQueryValidate,
					currentCity,
					userId: user?.id,
				});
			}
		},

		onError: (err: Error, _, context) => {
			setIsLoading(false);
			console.error(err);

			onErrorOptimisticWhenRemoveSpotInSpotList({
				currentQueryClient,
				queryMutateDestination,
				spotSpotListId,
				spotListId,
				searchQuery: searchQueryValidate,
				currentCity,
				context,
			});
		},
		onSuccess: () => {
			invalidationWhenRemoveSpotInSpotList({
				currentQueryClient,
				queryMutateDestination,
				spotSpotListId,
				spotListId,
				searchQuery: searchQueryValidate,
				currentCity,
				userId: user?.id,
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', googlePlaceLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['followingFeaturedLists', googlePlaceLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['featuredLists', googlePlaceLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['followingFeaturedLists', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['featuredLists', spotId],
			});
			setIsLoading(false);
		},
	});
};

//POST SPOT TO SPOT LIST
const fetchPostSpotToSpotList = async (
	values: PartialOptional<TypeAddSpotToSpotList, 'spotType'>,
	dataAddSpotEvent: TypeAddSpotToSpotListEvent,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = SPOT_LIST_ENDPOINTS.ADD_SPOT_TO_SPOT_LIST;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	await addSpotToSpotListEvent(dataAddSpotEvent);
	return postSpotToSpotListResponseSchema.parse(response);
};
export const usePostSpotToSpotList = ({
	queryMutateDestination,
	spotId,
	isCandidateSpot,
	searchQuery,
	currentCity,
	googlePlaceLocationId,
}: UsePostSpotToSpotList) => {
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
			dataAddSpotEvent,
		}: {
			values: TypeAddSpotToSpotList;
			dataAddSpotEvent: TypeAddSpotToSpotListEvent;
		}) => {
			const { spotType, ...rest } = values;
			setIsLoading(true);
			return fetchPostSpotToSpotList(rest, dataAddSpotEvent, userInfo);
		},
		onMutate: async ({ values }) => {
			const { spotType, spot_list_id } = values;

			const spotIdForOptimisticUpdate =
				spotType === 'db' ? values.spot_id : values.google_place_location_id;

			const spotListIdForOptimisticUpdate = spot_list_id;

			await updateOptimisticWhenAddSpotInSpotList({
				currentQueryClient,
				queryMutateDestination,
				spotId: spotIdForOptimisticUpdate,
				isCandidateSpot: spotType === 'googlePlaces',
				currentCity,
				searchQuery: searchQueryValidate,
				spotListId: spotListIdForOptimisticUpdate,
				userId: user?.id,
			});
		},
		onError: (err: Error, variables, context) => {
			const { values } = variables;
			const { spot_list_id } = values;

			const spotListIdForOptimisticUpdate = spot_list_id;

			setIsLoading(false);
			console.error(err);

			onErrorOptimisticWhenAddSpotInSpotList({
				context,
				currentQueryClient,
				queryMutateDestination,
				spotId,
				spotListId: spotListIdForOptimisticUpdate,
				searchQuery,
				currentCity,
				isCandidateSpot,
			});
		},
		onSuccess: (data, variables) => {
			const { values } = variables;
			const { spotType, spot_list_id } = values;

			const spotListIdForInvalidation = spot_list_id;
			const spotIdForInvalidation =
				spotType === 'db' ? values.spot_id : values.google_place_location_id;

			invalidationsWhenAddSpotInSpotList({
				currentQueryClient,
				queryMutateDestination,
				spotId,
				isCandidateSpot,
				searchQuery: searchQueryValidate,
				currentCity,
				userId: user?.id,
				spotIdForInvalidation,
				spotListIdForInvalidation,
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['spotInteractions', googlePlaceLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['followingFeaturedLists', googlePlaceLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['featuredLists', googlePlaceLocationId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['followingFeaturedLists', spotId],
			});
			currentQueryClient.invalidateQueries({
				queryKey: ['featuredLists', spotId],
			});

			currentQueryClient.invalidateQueries({
				queryKey: [queryMutateDestination, spotId],
				refetchPage: (_, index) => index === 0,
			});

			setIsLoading(false);
		},
	});
};
