import { useShallow } from 'zustand/react/shallow';
import { ScrollView } from 'react-native-gesture-handler';

import { useAppStore } from '@/lib/store/store';
import { useGetSpotImage } from '@/lib/hooks/UseQuerySpot';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { useSpotStatusTags } from '@/lib/hooks/useSpotStatusTags';
import SpotLocationAndContact from '@/UI/molecules/spot/SpotLocationAndContact';

import CustomImage from '@/UI/atoms/image/CustomImage';
import SpotTitleSection from '@/UI/molecules/spot/SpotTitleSection';
import SpotRecommendations from '@/UI/molecules/spot/SpotRecommendations';
import SpotInteractions from '@/UI/molecules/spot/SpotInteractions';

import type {
	TypeAddStatusTagsFromDB,
	TypeAddStatusTagsFromGooglePlaces,
	TypeDetailsSpotCandidate,
} from '@/lib/types/spot';

type TypeSpotSingleViewProps = {
	singleCandidateSpot: TypeDetailsSpotCandidate;
	address: string;
	refetchSpotCandidate: () => void;
	listIdToAddSpot?: number;
	spotSpotListIdToRemove?: number | null;
};

const SpotSingleCandidateView = ({
	singleCandidateSpot,
	address,
	refetchSpotCandidate,
	listIdToAddSpot,
	spotSpotListIdToRemove,
}: TypeSpotSingleViewProps) => {
	useRefetchOnFocus(refetchSpotCandidate);
	const { spotCandidate } = useAppStore(
		useShallow((state) => ({
			spotCandidate: state.spotCandidate,
		})),
	);
	const googlePlaceLocationId = String(spotCandidate?.google_place_location_id);
	const { spotImage } = useGetSpotImage({
		spotGooglePlacesId: googlePlaceLocationId,
		imageSize: 'medium',
	});

	const viewersStatusTags = singleCandidateSpot.viewer_status_tags;

	const valuesToUpdate = () => {
		if (!singleCandidateSpot.id && spotCandidate) {
			const candidateState = spotCandidate?.state;
			const candidateCity = spotCandidate?.city;
			const candidateCountry = spotCandidate?.country;
			const candidateName = spotCandidate?.name;

			const dataToSave: TypeAddStatusTagsFromGooglePlaces = {
				spot_id: null,
				city: candidateCity,
				country: candidateCountry,
				name: candidateName,
				address,
				state: candidateState,
				google_place_location_id: googlePlaceLocationId,
				spotType: 'googlePlaces',
			};
			return dataToSave;
		}
		const dataToSave: TypeAddStatusTagsFromDB = {
			spot_id: singleCandidateSpot.id as number,
			google_place_location_id: null,
			spotType: 'db',
		};

		return dataToSave;
	};

	const handleGoogleId = () => {
		if (spotCandidate?.id) {
			return undefined;
		}
		return spotCandidate?.google_place_location_id ?? undefined;
	};

	const { hasStatusBeenTo, hasStatusFavorite, onClickBeenTo, onClickFavorite } =
		useSpotStatusTags({
			queryMutateDestination: 'spot',
			spotName: singleCandidateSpot.name,
			statusTags: viewersStatusTags,
			valuesToUpdate: valuesToUpdate(),
			spotId: googlePlaceLocationId,
			isCandidateSpot: true,
		});

	return (
		<>
			<ScrollView showsVerticalScrollIndicator={false}>
				<SpotTitleSection
					spotId={singleCandidateSpot.id}
					title={singleCandidateSpot.name}
					onClickFavorite={onClickFavorite}
					hasStatusFavorite={hasStatusFavorite}
					listIdToAddSpot={listIdToAddSpot}
					spotSpotListIdToRemove={spotSpotListIdToRemove}
					googlePlacesId={googlePlaceLocationId}
					cuisineValues={singleCandidateSpot.cuisine}
				/>
				<CustomImage
					imageSrc={spotImage}
					className='rounded-lg my-0 mx-auto mt-4 w-full h-[206px] mb-5'
					width={500}
					height={500}
					testID='spot-screen-image'
					priority='high'
				/>
				<SpotInteractions
					spotId={spotCandidate?.id ?? undefined}
					googlePlacesId={handleGoogleId()}
				/>
				<SpotRecommendations id={googlePlaceLocationId} isFromGooglePlace />
				<SpotLocationAndContact
					hasStatusBeenTo={hasStatusBeenTo}
					onClickBeenTo={onClickBeenTo}
					weekday_text={singleCandidateSpot.weekday_text}
					price_level={singleCandidateSpot.price_level}
					address={address}
					phone={singleCandidateSpot.phone}
					latitude={Number(singleCandidateSpot?.latitude)}
					longitude={Number(singleCandidateSpot?.longitude)}
				/>
			</ScrollView>
		</>
	);
};

export default SpotSingleCandidateView;
