import { View } from 'react-native';
import { Dispatch, SetStateAction } from 'react';

import { useGetSingleSpot } from '@/lib/hooks/UseQuerySpot';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import MapSpotModalInformation from './MapSpotModalInformation';

import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { TypeSpotSingleToSpotList } from '@/lib/types/spot';

interface MapSpotModalProps {
	spotToShow?: TypeSpotSingleToSpotList | null;
	spotModalRef: React.RefObject<BottomSheetModal>;
	reservationsModalRef: React.RefObject<BottomSheetModal>;
	ordersModalRef: React.RefObject<BottomSheetModal>;
	isSpotListOwner: boolean;
	setSpotToShow: Dispatch<SetStateAction<TypeSpotSingleToSpotList | null>>;
	setSpotCoordinatesToShow: Dispatch<SetStateAction<string | null>>;
}

const MapSpotModal = ({
	spotToShow,
	spotModalRef,
	setSpotToShow,
	setSpotCoordinatesToShow,
	reservationsModalRef,
	ordersModalRef,
}: MapSpotModalProps) => {
	const { singleSpot, isLoading: isLoadingSingleSpot } = useGetSingleSpot(
		spotToShow?.spot_id,
	);

	const snapPoints = ['70%'];

	const onCloseMapSpotModal = () => {
		setSpotCoordinatesToShow(null);
		setSpotToShow(null);
	};

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={spotModalRef}
			onDismiss={onCloseMapSpotModal}
			snapPoints={snapPoints}
		>
			{isLoadingSingleSpot && (
				<View className='h-[400px] flex justify-center items-center'>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{singleSpot && (
				<MapSpotModalInformation
					singleSpot={singleSpot}
					ordersModalRef={ordersModalRef}
					reservationsModalRef={reservationsModalRef}
					spotModalRef={spotModalRef}
				/>
			)}
		</CustomBottomSheetModal>
	);
};

export default MapSpotModal;
