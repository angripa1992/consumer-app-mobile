import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import MainLayout from '@/UI/layouts/MainLayout';
import {
	useGetSingleSpot,
	useGetDetailsSingleCandidateSpot,
} from '@/lib/hooks/UseQuerySpot';
import { SpotScreenRouteParams } from '@/lib/types/tabScreenParams';

import { useAppStore } from '@/lib/store/store';

import SpotSingleView from '@/UI/organism/spot/SpotSingleView';
import SpotSingleCandidateView from '@/UI/organism/spot/SpotSingleCandidateView';
import NoConnection from '@/UI/molecules/NoConnection';
import SpotHeader from '@/UI/molecules/spot/SpotHeader';
import { useShallow } from 'zustand/react/shallow';

const SingleSpotScreen = ({ route }: SpotScreenRouteParams) => {
	const { spotId, isCandidateSpot, listIdToAddSpot, spotSpotListIdToRemove } =
		route.params;
	const {
		singleSpot,
		isLoading,
		refetch: refetchSingleSpot,
	} = useGetSingleSpot(isCandidateSpot ? undefined : spotId);

	const {
		singleCandidateSpot,
		error,
		refetch: refetchSpotCandidate,
	} = useGetDetailsSingleCandidateSpot(isCandidateSpot ? spotId : undefined);
	const { spotCandidate } = useAppStore(
		useShallow((state) => ({
			spotCandidate: state.spotCandidate,
		})),
	);
	const isLoadingSpotCandidate = isLoading || !singleCandidateSpot;
	const isShowSpotCandidate =
		!isLoading &&
		singleCandidateSpot &&
		spotCandidate &&
		spotId === spotCandidate?.google_place_location_id;

	const isLoadingSpot = isLoading || !singleSpot || spotId !== singleSpot.id;
	const isShowSpot = !isLoading && singleSpot && spotId === singleSpot.id;

	const renderSpotView = () => {
		const errorStatus = error?.response?.status;
		const is504Error = errorStatus === 504;

		if (isCandidateSpot) {
			return (
				<>
					{is504Error && <NoConnection refetch={refetchSpotCandidate} />}
					{isLoadingSpotCandidate && <SpinnerCup />}
					{isShowSpotCandidate && !is504Error && (
						<SpotSingleCandidateView
							singleCandidateSpot={singleCandidateSpot}
							address={spotCandidate.address ?? ''}
							refetchSpotCandidate={refetchSpotCandidate}
							listIdToAddSpot={listIdToAddSpot}
							spotSpotListIdToRemove={spotSpotListIdToRemove}
						/>
					)}
				</>
			);
		}
		if (!isCandidateSpot) {
			return (
				<>
					{isLoadingSpot && <SpinnerCup />}
					{isShowSpot && (
						<SpotSingleView
							refetchSingleSpot={refetchSingleSpot}
							singleSpot={singleSpot}
							listIdToAddSpot={listIdToAddSpot}
							spotSpotListIdToRemove={spotSpotListIdToRemove}
						/>
					)}
				</>
			);
		}
	};

	return (
		<>
			<SpotHeader
				spotId={isCandidateSpot ? singleCandidateSpot?.id : singleSpot?.id}
				spotName={
					isCandidateSpot ? singleCandidateSpot?.name : singleSpot?.name
				}
			/>
			<MainLayout isDismissKeyboardActive={false}>
				{renderSpotView()}
			</MainLayout>
		</>
	);
};

export default SingleSpotScreen;
