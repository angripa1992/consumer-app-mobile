import { useRef } from 'react';
import { ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { useSpotStatusTags } from '@/lib/hooks/useSpotStatusTags';

import SpotTitleSection from '@/UI/molecules/spot/SpotTitleSection';
import SpotInteractions from '@/UI/molecules/spot/SpotInteractions';
import SpotButtons from '@/UI/molecules/spot/SpotButtons';
import SpotLocationAndContact from '@/UI/molecules/spot/SpotLocationAndContact';
import SpotReservationsModal from './SpotReservationsModal';
import SpotImages from '@/UI/molecules/spot/SpotImages';
import SpotOrders from './SpotOrders';
import SpotRecommendations from '@/UI/molecules/spot/SpotRecommendations';

import type {
	TypeAddStatusTagsFromDB,
	TypeSpotSingleToUserPage,
} from '@/lib/types/spot';

type TypeSpotSingleViewProps = {
	singleSpot: TypeSpotSingleToUserPage;
	refetchSingleSpot: () => void;
	listIdToAddSpot?: number;
	spotSpotListIdToRemove?: number | null;
};

const SpotSingleView = ({
	singleSpot,
	refetchSingleSpot,
	listIdToAddSpot,
	spotSpotListIdToRemove,
}: TypeSpotSingleViewProps) => {
	const reservationsModalRef = useRef<BottomSheetModal>(null);
	const ordersModalRef = useRef<BottomSheetModal>(null);
	const viewersStatusTags = singleSpot.viewer_status_tags;

	const valuesToUpdate = () => {
		const dataToSave: TypeAddStatusTagsFromDB = {
			spot_id: singleSpot.id,
			google_place_location_id: null,
			spotType: 'db',
		};

		return dataToSave;
	};

	const { hasStatusBeenTo, hasStatusFavorite, onClickBeenTo, onClickFavorite } =
		useSpotStatusTags({
			queryMutateDestination: 'spot',
			spotName: singleSpot.name,
			statusTags: viewersStatusTags,
			valuesToUpdate: valuesToUpdate(),
			spotId: singleSpot.id,
		});

	useRefetchOnFocus(refetchSingleSpot);

	const orders = singleSpot.order_suppliers;

	const reservations = [
		singleSpot.reservation_mobile_phone,
		singleSpot.reservation_web_url,
	];

	const reservationsToShow = reservations.filter(
		(reservation) => reservation !== null && reservation,
	);

	const hasReservations = reservationsToShow.length > 0;
	const hasOrders = orders.length > 0;

	return (
		<>
			<ScrollView
				showsVerticalScrollIndicator={false}
				testID='spot-screen-scroll'
			>
				<SpotTitleSection
					spotId={singleSpot.id}
					title={singleSpot.name}
					onClickFavorite={onClickFavorite}
					hasStatusFavorite={hasStatusFavorite}
					listIdToAddSpot={listIdToAddSpot}
					spotSpotListIdToRemove={spotSpotListIdToRemove}
					cuisineValues={singleSpot.cuisine}
				/>
				<SpotImages
					spotImages={singleSpot.spot_images}
					googlePlaceLocationId={singleSpot.google_place_location_id}
					tripAdvisorLocationId={singleSpot.tripadvisor_location_id}
					smallImage={singleSpot.small_image}
					spotLikeCounter={singleSpot.spot_like_counter}
				/>
				<SpotButtons
					hasOrders={hasOrders}
					hasReservations={hasReservations}
					reservationsModalRef={reservationsModalRef}
					ordersModalRef={ordersModalRef}
				/>
				<SpotInteractions spotId={singleSpot.id} />
				<SpotRecommendations id={singleSpot.id} />
				<SpotLocationAndContact
					hasStatusBeenTo={hasStatusBeenTo}
					onClickBeenTo={onClickBeenTo}
					weekday_text={singleSpot.weekday_text}
					price_level={singleSpot.price_level}
					address={singleSpot.address}
					phone={singleSpot.phone}
					website_option_one={singleSpot.website_option_one}
					website_option_two={singleSpot.website_option_two}
					website_option_three={singleSpot.website_option_three}
					latitude={Number(singleSpot?.latitude)}
					longitude={Number(singleSpot?.longitude)}
				/>
				<SpotOrders orders={orders} ordersModalRef={ordersModalRef} />
				<SpotReservationsModal
					reservations={reservationsToShow}
					hasReservations={hasReservations}
					reservationsModalRef={reservationsModalRef}
				/>
			</ScrollView>
		</>
	);
};

export default SpotSingleView;
