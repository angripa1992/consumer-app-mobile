import { useShallow } from 'zustand/react/shallow';

import { useSpotStatusTags } from '@/lib/hooks/useSpotStatusTags';
import { useAppStore } from '@/lib/store/store';
import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type {
	TypeAddStatusTagsFromDB,
	TypeAddStatusTagsFromGooglePlaces,
	TypeDetailsSpotCandidate,
	TypeSpotSingleToUserPage,
} from '@/lib/types/spot';

type TypeSpotLikeListButtonProps = {
	singleSpot: TypeSpotSingleToUserPage | TypeDetailsSpotCandidate;
};

const SpotLikeListButton = ({ singleSpot }: TypeSpotLikeListButtonProps) => {
	const { appUserId, spotCandidate } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			appUserId: state.user?.id,
			spotCandidate: state.spotCandidate,
		})),
	);

	const viewersStatusTags = singleSpot?.viewer_status_tags;
	const valuesToUpdate = () => {
		if (singleSpot.id) {
			const dataToSave: TypeAddStatusTagsFromDB = {
				spot_id: singleSpot.id,
				google_place_location_id: singleSpot.google_place_location_id,
				spotType: 'db',
			};

			return dataToSave;
		}
		if (spotCandidate) {
			const dataToSave: TypeAddStatusTagsFromGooglePlaces = {
				spot_id: null,
				city: spotCandidate.city,
				country: spotCandidate.country,
				address: spotCandidate.address,
				name: spotCandidate.name,
				state: spotCandidate?.state,
				google_place_location_id: spotCandidate.google_place_location_id ?? '',
				spotType: 'googlePlaces',
			};
			return dataToSave;
		}
	};

	const { hasStatusFavorite, onClickFavorite } = useSpotStatusTags({
		queryMutateDestination: 'likesForSpot',
		spotName: singleSpot.name,
		statusTags: viewersStatusTags,
		valuesToUpdate: valuesToUpdate() ?? undefined,
		spotId: (singleSpot.id
			? singleSpot.id
			: spotCandidate?.google_place_location_id) as string,
		userId: appUserId,
		isCandidateSpot: singleSpot.id ? false : true,
		googlePlaceLocationId: singleSpot?.google_place_location_id ?? undefined,
	});

	return (
		<ButtonPrimary designVariation='green' onPress={onClickFavorite}>
			{i18nInstance.t(hasStatusFavorite ? 'unlike' : 'likeSpot')}
		</ButtonPrimary>
	);
};

export default SpotLikeListButton;
