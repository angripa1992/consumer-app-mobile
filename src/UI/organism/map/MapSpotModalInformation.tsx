import { useSpotStatusTags } from '@/lib/hooks/useSpotStatusTags';
import SpotButtons from '@/UI/molecules/spot/SpotButtons';
import SpotContact from '@/UI/molecules/spot/SpotContact';
import SpotInteractions from '@/UI/molecules/spot/SpotInteractions';
import SpotTitleSection from '@/UI/molecules/spot/SpotTitleSection';

import type {
	TypeAddStatusTagsFromDB,
	TypeSpotSingleToUserPage,
} from '@/lib/types/spot';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

interface TypeMapSpotModalInformation {
	singleSpot: TypeSpotSingleToUserPage;
	reservationsModalRef: React.RefObject<BottomSheetModal>;
	ordersModalRef: React.RefObject<BottomSheetModal>;
	spotModalRef: React.RefObject<BottomSheetModal>;
}
const MapSpotModalInformation = ({
	singleSpot,
	ordersModalRef,
	spotModalRef,
	reservationsModalRef,
}: TypeMapSpotModalInformation) => {
	const viewersStatusTags = singleSpot?.viewer_status_tags;

	const valuesToUpdate = () => {
		const dataToSave: TypeAddStatusTagsFromDB = {
			spot_id: singleSpot?.id ?? 0,
			google_place_location_id: null,
			spotType: 'db',
		};

		return dataToSave;
	};

	const { hasStatusBeenTo, hasStatusFavorite, onClickFavorite } =
		useSpotStatusTags({
			queryMutateDestination: 'spot',
			spotName: singleSpot?.name || '',
			statusTags: viewersStatusTags,
			valuesToUpdate: valuesToUpdate(),
			spotId: singleSpot?.id ?? 0,
		});

	const orders = singleSpot?.order_suppliers ?? [];

	const reservations = [
		singleSpot?.reservation_mobile_phone,
		singleSpot?.reservation_web_url,
	];

	const reservationsToShow = reservations.filter(
		(reservation) => reservation !== null && reservation,
	);

	const hasReservations = reservationsToShow.length > 0;
	const hasOrders = orders.length > 0;

	const onPressNavigateTo = () => {
		spotModalRef.current?.close();
	};

	return (
		<>
			<SpotTitleSection
				spotId={singleSpot.id}
				title={singleSpot.name}
				onClickFavorite={onClickFavorite}
				hasStatusFavorite={hasStatusFavorite}
				cuisineValues={singleSpot.cuisine}
			/>
			<SpotButtons
				hasOrders={hasOrders}
				hasReservations={hasReservations}
				ordersModalRef={ordersModalRef}
				reservationsModalRef={reservationsModalRef}
			/>
			<SpotInteractions
				spotId={singleSpot.id}
				onPressNavigateTo={onPressNavigateTo}
			/>
			<SpotContact
				hasStatusBeenTo={hasStatusBeenTo}
				onClickBeenTo={undefined}
				address={singleSpot.address}
				phone={singleSpot.phone}
				weekday_text={singleSpot.weekday_text}
				website_option_one={singleSpot.website_option_one}
				website_option_two={singleSpot.website_option_two}
				website_option_three={singleSpot.website_option_three}
				price_level={singleSpot.price_level}
			/>
		</>
	);
};

export default MapSpotModalInformation;
