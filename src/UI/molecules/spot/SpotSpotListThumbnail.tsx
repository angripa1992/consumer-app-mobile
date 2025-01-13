import { Image, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

import {
	useDeleteSpotFromList,
	usePostSpotToSpotList,
} from '@/lib/hooks/useQuerySpotSpot';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import LocationMarkerIcon from '@/UI/assets/svg/LocationMarkerIcon';
import Spinner from '@/UI/atoms/spinner/Spinner';
import CheckAddedIcon from '@/UI/assets/svg/CheckAddedIcon';
import DefaultImage from '@/images/default-image.png';

import type {
	TypeAddSpotToSpotListEvent,
	TypeSpotCandidateToSave,
} from '@/lib/types/spot';
import type {
	TypeAddSpotFromDBToSpotList,
	TypeAddSpotFromGooglePlacesToSpotList,
} from '@/lib/types/spotList';
import type { TypeSpotListUserSchema } from '@/lib/types/user';
import AddSpotButton from '@/UI/atoms/spot/AddSpotButton';

interface SpotSpotListThumbnailProps {
	spotList: TypeSpotListUserSchema;
	spotId: number | null;
	spotName: string;
	isCandidateSpot?: boolean;
	googlePlaceLocationId?: string | null;
	candidateSpotData?: TypeSpotCandidateToSave | null;
}
const SpotSpotListThumbnail = ({
	spotList,
	spotId,
	spotName,
	isCandidateSpot,
	googlePlaceLocationId,
	candidateSpotData,
}: SpotSpotListThumbnailProps) => {
	const toast = useToast();
	const dataAddSpotEvent: TypeAddSpotToSpotListEvent = {
		spot_id: spotId ?? googlePlaceLocationId,
		spot_name: spotName,
		spot_list_id: spotList.id,
	};

	const { mutateAsync: addSpotToSpotList, isLoading: isLoadingPostSpot } =
		usePostSpotToSpotList({
			queryMutateDestination: 'spot',
			spotId: spotId ?? googlePlaceLocationId,
			googlePlaceLocationId: googlePlaceLocationId ?? undefined,
			isCandidateSpot,
		});

	const findSpot = spotList.spot_and_spot_list_relationship?.find((spot) => {
		if (!spotId) return undefined;
		return spot.spot_id === spotId;
	});

	const spotSpotListId = findSpot?.spot_spot_list_id;

	const { mutateAsync: deleteSpot } = useDeleteSpotFromList({
		queryMutateDestination: 'spot',
		spotSpotListId,
		spotListId: spotList.id,
		spotId: spotId ?? undefined,
		googlePlaceLocationId: googlePlaceLocationId ?? undefined,
	});

	const cardImage = DefaultImage;

	const hasCurrentSpot = !!findSpot;

	const buttonCheckedTestID = `button-${spotList.id}-checked`;
	const buttonUncheckedTestID = `button-${spotList.id}-unchecked`;
	const buttonTestID = hasCurrentSpot
		? buttonCheckedTestID
		: buttonUncheckedTestID;

	const handleAddCandidateSpotToList = () => {
		if (googlePlaceLocationId && candidateSpotData) {
			const candidateAddress = candidateSpotData.address;
			const candidateCity = candidateSpotData.city;
			const candidateCountry = candidateSpotData.country;
			const candidateName = candidateSpotData.name;

			const dataToSend: TypeAddSpotFromGooglePlacesToSpotList = {
				spot_id: null,
				spot_list_id: spotList.id,
				google_place_location_id: googlePlaceLocationId,
				city: candidateCity,
				country: candidateCountry,
				address: candidateAddress ?? '',
				name: candidateName,
				spotType: 'googlePlaces',
			};

			addSpotToSpotList({
				values: dataToSend,
				dataAddSpotEvent,
			});
		}
	};

	const handleAddSpotToList = () => {
		if (!spotId) return;

		const dataToSend: TypeAddSpotFromDBToSpotList = {
			spot_id: spotId,
			spot_list_id: spotList.id,
			spotType: 'db',
		};

		addSpotToSpotList({
			values: dataToSend,
			dataAddSpotEvent,
		}).then(() => {
			toast.show('Spot added to list successfully', {
				type: 'success',
			});
		});
	};

	const onPressAdd = () => {
		if (!spotId) {
			handleAddCandidateSpotToList();
		} else {
			handleAddSpotToList();
		}
	};

	const onPressRemove = () => {
		deleteSpot();
	};

	const onPressCheck = hasCurrentSpot ? onPressRemove : onPressAdd;

	const renderCheckButton = () => {
		return (
			<AddSpotButton
				onPlusIconClick={(e) => {
					e.stopPropagation();
					onPressCheck();
				}}
				isFilled={hasCurrentSpot}
			/>
		);
	};

	return (
		<View className='flex-row my-3 gap-x-3 items-center '>
			<Image
				source={cardImage}
				width={80}
				height={80}
				className='rounded-md w-[80px] h-[80px]'
			/>
			<View className='flex-1'>
				<TextElement textStyles='text-sm text-gray font-medium'>
					{spotList.name}
				</TextElement>
				<View className='flex-row mt-4'>
					<LocationMarkerIcon />
					<TextElement textStyles='text-xs text-gray ml-1'>
						{spotList.spot_counter}
					</TextElement>
				</View>
			</View>
			{renderCheckButton()}
		</View>
	);
};

export default SpotSpotListThumbnail;
