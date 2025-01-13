import { TypeSpotStatusTagsEnum } from '../types/spot';

export const getStatusToUpdate = ({
	statusTag,
	hasStatusFavorite = false,
	hasStatusSaved = false,
	hasStatusBeenTo = false,
}: {
	statusTag: TypeSpotStatusTagsEnum;
	hasStatusFavorite?: boolean;
	hasStatusSaved?: boolean;
	hasStatusBeenTo?: boolean;
}) => {
	if (statusTag === 'Favorites') {
		return {
			is_like_spot: hasStatusFavorite,
		};
	}
	if (statusTag === 'Saved') {
		return {
			is_saved: hasStatusSaved,
		};
	}
	if (statusTag === 'Been to') {
		return {
			is_been_to: hasStatusBeenTo,
		};
	}
};
