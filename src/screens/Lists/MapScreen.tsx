import { useEffect, useRef, useState } from 'react';

import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import MapSpotModal from '@/UI/organism/map/MapSpotModal';
import MapSpots from '@/UI/organism/map/MapSpots';
import { TypeSpotSingleToSpotList } from '@/lib/types/spot';
import { MapRouteParams } from '@/lib/types/tabScreenParams';
import { useGetSpotsFromSpotList } from '@/lib/hooks/useQuerySpotList';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import { View } from 'react-native';
import SpotReservationsModal from '@/UI/organism/spot/SpotReservationsModal';
import SpotOrders from '@/UI/organism/spot/SpotOrders';
import { useGetSingleSpot } from '@/lib/hooks/UseQuerySpot';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

const MapScreen = ({ route }: MapRouteParams) => {
	const { spotListName, isSpotListOwner, spotListId, spotsCounter } =
		route.params;
	const { spots, isLoading: isLoadingSpots } = useGetSpotsFromSpotList(
		spotListId,
		spotsCounter,
	);

	const [spotToShow, setSpotToShow] = useState<TypeSpotSingleToSpotList | null>(
		null,
	);

	const { singleSpot } = useGetSingleSpot(spotToShow?.spot_id);

	const [spotCoordinatesToShow, setSpotCoordinatesToShow] = useState<
		string | null
	>(null);

	const spotModalRef = useRef<BottomSheetModal>(null);
	const reservationsModalRef = useRef<BottomSheetModal>(null);
	const ordersModalRef = useRef<BottomSheetModal>(null);

	const reservations = [
		singleSpot?.reservation_mobile_phone,
		singleSpot?.reservation_web_url,
	];
	const reservationsToShow = reservations.filter(
		(reservation) => reservation !== null && reservation,
	);
	const hasReservations = reservationsToShow.length > 0;
	const orders = singleSpot?.order_suppliers ?? [];

	useEffect(() => {
		const spot =
			spots?.find((spot) => spot.coordinates === spotCoordinatesToShow) ?? null;
		setSpotToShow(spot);
	}, [spotCoordinatesToShow]);

	return (
		<>
			<HeaderGoBack
				titleStyles='text-light-white text-xs'
				title={spotListName}
			/>
			<View className='bg-black flex-1'>
				{isLoadingSpots && (
					<View className='flex-1 flex flex-row justify-center items-center'>
						<SpinnerCup isFullPage={false} />
					</View>
				)}
				{spots && (
					<MapSpots
						viewStyles='w-full h-full'
						spotModalRef={spotModalRef}
						spots={spots}
						spotToShow={spotToShow}
						setSpotCoordinatesToShow={setSpotCoordinatesToShow}
					/>
				)}
			</View>
			<MapSpotModal
				spotModalRef={spotModalRef}
				spotToShow={spotToShow}
				setSpotToShow={setSpotToShow}
				setSpotCoordinatesToShow={setSpotCoordinatesToShow}
				isSpotListOwner={isSpotListOwner}
				reservationsModalRef={reservationsModalRef}
				ordersModalRef={ordersModalRef}
			/>
			<SpotOrders orders={orders} ordersModalRef={ordersModalRef} />
			<SpotReservationsModal
				reservations={reservationsToShow}
				hasReservations={hasReservations}
				reservationsModalRef={reservationsModalRef}
			/>
		</>
	);
};

export default MapScreen;
