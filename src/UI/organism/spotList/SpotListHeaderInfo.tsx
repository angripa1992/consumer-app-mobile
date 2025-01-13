import SpotListSocialInfo from '@/UI/organism/spotList/SpotListSocialInfo';
import SpotListButtons from './SpotListButtons';
import SpotListFilterButtons from './SpotListFilterButtons';

import type { TypeSpotSingleToSpotList } from '@/lib/types/spot';
import type { TypeSingleListSpotsFilterValue } from '@/lib/types/listFilter';
import type { TypeSpotListSinglePage } from '@/lib/types/spotList';

interface SpotListHeaderProps {
	spotList: TypeSpotListSinglePage;
	spots?: TypeSpotSingleToSpotList[];
	isSpotListOwner: boolean;
	currentFilter: TypeSingleListSpotsFilterValue;
	setCurrentFilter: React.Dispatch<
		React.SetStateAction<TypeSingleListSpotsFilterValue>
	>;
	isFollowing?: boolean;
}

const SpotListHeaderInfo = ({
	spotList,
	isSpotListOwner,
	currentFilter,
	setCurrentFilter,
	spots,
	isFollowing,
}: SpotListHeaderProps) => {
	return (
		<>
			<SpotListSocialInfo
				followersCounter={spotList.followers_counter}
				spotCounter={spotList.spot_counter}
				viewCounter={spotList.view_counter}
				description={spotList.description}
				tags={spotList.tags}
			/>
			<SpotListButtons
				spotListId={spotList.id}
				spotListName={spotList.name}
				isSpotListOwner={isSpotListOwner}
				spotsCounter={spotList.spot_counter}
			/>
			<SpotListFilterButtons
				spots={spots}
				currentFilter={currentFilter}
				setCurrentFilter={setCurrentFilter}
			/>
		</>
	);
};

export default SpotListHeaderInfo;
