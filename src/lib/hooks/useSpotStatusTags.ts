import {
	TypeAddStatusTagsEvent,
	TypeAddStatusTagsToSpot,
	TypeSpotStatusTagsEnum,
	TypeStatusTagsSchema,
} from '../types/spot';
import { PressableProps } from 'react-native';
import { UseUpdateStatusTagsInSingleSpot } from '../types/queries';
import { useUpdateStatusTagsInSingleSpot } from './useQueryStatusTags';
import { getStatusToUpdate } from '../helpers/statusTagsHelpers';
import { useCallback } from 'react';

type UseSpotStatusTagsProps = {
	spotName: string;
	statusTags: TypeStatusTagsSchema | undefined;
	valuesToUpdate?: TypeAddStatusTagsToSpot;
} & UseUpdateStatusTagsInSingleSpot;

export const useSpotStatusTags = ({
	spotName,
	valuesToUpdate,
	statusTags,
	spotId,
	spotListId,
	userId,
	categoryName,
	searchQuery,
	currentCity,
	queryMutateDestination,
	isCandidateSpot,
	isOwner,
	googlePlaceLocationId,
	currentArea,
}: UseSpotStatusTagsProps) => {
	const { mutateAsync: updateStatusTags } = useUpdateStatusTagsInSingleSpot({
		queryMutateDestination,
		isCandidateSpot,
		spotId,
		spotListId,
		userId,
		categoryName,
		searchQuery,
		currentCity,
		isOwner,
		googlePlaceLocationId,
		currentArea,
	});

	const hasStatusBeenTo = !!statusTags?.is_been_to;
	const hasStatusSaved = !!statusTags?.is_saved;
	const hasStatusFavorite = !!statusTags?.is_like_spot;

	const onClickToUpdateStatusTags = useCallback(
		(statusTag: TypeSpotStatusTagsEnum): PressableProps['onPress'] =>
			async (e) => {
				if (!valuesToUpdate) {
					return;
				}
				e.preventDefault();

				const statusTagToUpdate = getStatusToUpdate({
					statusTag,
					hasStatusFavorite,
					hasStatusSaved,
					hasStatusBeenTo,
				});

				const dataToSend = {
					...valuesToUpdate,
					...statusTagToUpdate,
				};

				const dataStatusTagsEvent: TypeAddStatusTagsEvent = {
					spot_id: spotId ?? valuesToUpdate.google_place_location_id,
					status_tag: statusTag,
					spot_name: spotName,
				};

				await updateStatusTags({
					values: dataToSend,
					dataStatusTagsEvent,
				});
			},
		[
			hasStatusBeenTo,
			hasStatusFavorite,
			hasStatusSaved,
			spotId,
			spotName,
			valuesToUpdate,
		],
	);

	const onClickFavorite = onClickToUpdateStatusTags('Favorites');
	const onClickSaved = onClickToUpdateStatusTags('Saved');
	const onClickBeenTo = onClickToUpdateStatusTags('Been to');

	return {
		hasStatusBeenTo,
		hasStatusSaved,
		hasStatusFavorite,
		onClickFavorite,
		onClickSaved,
		onClickBeenTo,
	};
};
