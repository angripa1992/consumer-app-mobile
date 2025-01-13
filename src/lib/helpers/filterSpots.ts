import { TypeSingleListSpotsFilterValue } from '../types/listFilter';
import { TypeSpotSingleToSpotList } from '../types/spot';

interface TypeFilterSpotsByStatusTag {
	filterTagValue: TypeSingleListSpotsFilterValue;
	spots?: TypeSpotSingleToSpotList[];
}

export const filterSpotsByStatusTag = ({
	spots,
	filterTagValue,
}: TypeFilterSpotsByStatusTag) => {
	if (!spots) return [];
	if (filterTagValue === 'all') return spots;

	return spots?.filter((spot) => {
		return (
			spot.viewer_status_tags[filterTagValue] ||
			spot.owner_status_tags[filterTagValue]
		);
	});
};
