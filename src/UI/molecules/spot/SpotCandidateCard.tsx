import { memo, useEffect, useMemo, useRef } from 'react';
import {
	GestureResponderEvent,
	Platform,
	PressableProps,
	TouchableOpacity,
	View,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import TextElement from '@/UI/atoms/text/TextElement';

import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';
import {
	useDeleteSpotFromList,
	usePostSpotToSpotList,
} from '@/lib/hooks/useQuerySpotSpot';
import { useSpotStatusTags } from '@/lib/hooks/useSpotStatusTags';
import { useGetSpotImage } from '@/lib/hooks/UseQuerySpot';
import { useAppStore } from '@/lib/store/store';

import CustomImage from '@/UI/atoms/image/CustomImage';
import Spinner from '@/UI/atoms/spinner/Spinner';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import HeartIcon from '@/UI/assets/svg/HeartIcon';
import PlusButtonIcon from '@/UI/assets/svg/PlusButtonIcon';
import AddSpotButton from '@/UI/atoms/spot/AddSpotButton';
import ScribbleIcon from '@/UI/assets/svg/ScribbleIcon';

import DefaultImageForListAndSpot from '@/images/default-color-image-for-spot-and-list.png';

import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import type {
	TypeAddSpotToSpotListEvent,
	TypeAddStatusTagsFromDB,
	TypeAddStatusTagsFromGooglePlaces,
	TypeSpotCandidateCard,
	TypeStatusTagsSchema,
} from '@/lib/types/spot';
import type {
	TypeAddSpotFromDBToSpotList,
	TypeAddSpotFromGooglePlacesToSpotList,
} from '@/lib/types/spotList';
import LottieView from 'lottie-react-native';
import SpotHeartButton from '@/UI/atoms/spot/SpotHeartButton';

type TypeSpotCandidateCardProps = TypeSpotCandidateCard & {
	viewerStatusTags: TypeStatusTagsSchema;
	testID?: string;
	queryMutateDestination: TypeQueriesMutateDestination;
	cardContainerStyles?: string;
	smallImage?: string | null;
	searchQuery?: string;
	currentCity?: string | null;
	tripAdvisorLocationId?: number | null;
	currentArea?: string;
};

const SpotCandidateCard = ({
	testID,
	cardContainerStyles = 'flex-1',
	queryMutateDestination,
	smallImage,
	viewerStatusTags,
	searchQuery,
	currentCity,
	tripAdvisorLocationId,
	currentArea,
	...props
}: TypeSpotCandidateCardProps) => {
	const { setSpotCandidate } = useAppStore(
		useShallow((state) => ({
			setSpotCandidate: state.setSpotCandidate,
		})),
	);

	const { spotType, screen, name, id, googlePlaceLocationId } = props;
	const heartAnimationRef = useRef<LottieView>(null);

	const navigation = useNavigation<AppStackNavigationProp>();

	const {
		mutateAsync: addSpotToSpotList,
		isLoading: isLoadingAddSpotToSpotList,
	} = usePostSpotToSpotList({
		queryMutateDestination,
		searchQuery,
		currentCity,
	});

	const { mutateAsync: deleteSpot } = useDeleteSpotFromList({
		queryMutateDestination,
		spotSpotListId: screen === 'searchSpots' ? props.spotSpotListId : null,
		spotListId: screen === 'searchSpots' ? props.spotListId : undefined,
		searchQuery,
		currentCity,
	});

	const spotSmallImage = smallImage || undefined;
	const placeholder =
		Platform.OS === 'android'
			? (spotSmallImage ?? DefaultImageForListAndSpot)
			: spotSmallImage;
	const { spotImage } = useGetSpotImage(
		{
			imageSize: 'small',
			tripAdvisorLocationId,
			spotGooglePlacesId: googlePlaceLocationId,
		},
		!spotSmallImage,
	);

	const spotImageToShow = useMemo(
		() => spotSmallImage ?? spotImage,
		[spotSmallImage, spotImage],
	);

	const valuesToUpdate = useMemo(() => {
		if (!id && spotType === 'googlePlaces') {
			const { name, address, city, country, googlePlaceLocationId, state } =
				props;

			const dataToSave: TypeAddStatusTagsFromGooglePlaces = {
				spot_id: null,
				city,
				country,
				name,
				address,
				state,
				google_place_location_id: googlePlaceLocationId,
				spotType: 'googlePlaces',
			};
			return dataToSave;
		}

		const dataToSave: TypeAddStatusTagsFromDB = {
			spot_id: id as number,
			google_place_location_id: null,
			spotType: 'db',
		};
		return dataToSave;
	}, [id, props, spotType]);

	const { hasStatusFavorite, onClickFavorite } = useSpotStatusTags({
		spotName: name,
		statusTags: viewerStatusTags,
		spotId: id ?? (googlePlaceLocationId as string),
		spotListId: screen === 'searchSpots' ? props.spotListId : undefined,
		queryMutateDestination,
		valuesToUpdate,
		currentCity,
		searchQuery,
		currentArea,
	});

	const onClickCardToRedirect = () => {
		if (id) {
			navigation.push('SingleSpot', {
				spotId: id,
				listIdToAddSpot:
					screen === 'searchSpots' ? props.spotListId : undefined,
				spotSpotListIdToRemove:
					screen === 'searchSpots' ? props.spotSpotListId : undefined,
			});
			return;
		}

		if (!id && spotType === 'googlePlaces') {
			const { name, address, city, country, state } = props;
			const dataToSave = {
				id: null,
				address,
				city,
				country,
				name,
				google_place_location_id: googlePlaceLocationId,
				state,
				small_image: null,
				spot_image: null,
			};

			setSpotCandidate(dataToSave);

			navigation.push('SingleSpot', {
				spotId: googlePlaceLocationId,
				isCandidateSpot: true,
				listIdToAddSpot:
					screen === 'searchSpots' ? props.spotListId : undefined,
				spotSpotListIdToRemove:
					screen === 'searchSpots' ? props.spotSpotListId : undefined,
			});

			return;
		}
	};

	const onPlusIconClick: PressableProps['onPress'] = (e) => {
		e.stopPropagation();
		if (screen !== 'searchSpots') return;

		const { spotListId } = props;

		const dataAddSpotEvent: TypeAddSpotToSpotListEvent = {
			spot_id: id ?? googlePlaceLocationId,
			spot_name: name,
			spot_list_id: spotListId,
		};

		if (!id && spotType === 'googlePlaces') {
			const { name, address, city, country } = props;

			const dataToSend: TypeAddSpotFromGooglePlacesToSpotList = {
				address,
				spot_id: null,
				name,
				google_place_location_id: googlePlaceLocationId,
				spot_list_id: spotListId,
				city,
				country,
				spotType: 'googlePlaces',
			};

			addSpotToSpotList({
				values: dataToSend,
				dataAddSpotEvent,
			});
			return;
		}

		const dataToSend: TypeAddSpotFromDBToSpotList = {
			spot_id: id as number,
			spot_list_id: spotListId,
			spotType: 'db',
		};

		addSpotToSpotList({
			values: dataToSend,
			dataAddSpotEvent,
		});
	};

	const onPlusIconClickToDelete: PressableProps['onPress'] = (e) => {
		if (screen !== 'searchSpots') return;

		e.stopPropagation();

		deleteSpot();
	};

	const renderPlusIcon = () => {
		if (screen !== 'searchSpots') return;

		const { relationshipWithSpotList, spotSpotListId } = props;

		return (
			<View className='mr-auto'>
				<AddSpotButton
					onPlusIconClick={(e) => {
						if (relationshipWithSpotList) {
							onPlusIconClickToDelete(e);
						} else {
							onPlusIconClick(e);
						}
					}}
					isFilled={relationshipWithSpotList}
				/>
			</View>
		);
	};

	const renderScribbleCount = () => {
		if (
			spotType === 'db' &&
			props.spotScribblesCount !== undefined &&
			props.spotScribblesCount !== null &&
			props.spotScribblesCount >= 0
		) {
			return props.spotScribblesCount;
		}
		return 0;
	};

	useEffect(() => {
		if (hasStatusFavorite) {
			heartAnimationRef?.current?.play(0, 25);
		} else {
			heartAnimationRef?.current?.reset();
		}
	}, []);

	return (
		<>
			<TouchableOpacity
				activeOpacity={1}
				className={` my-2 p-0 ${cardContainerStyles}`}
				onPress={onClickCardToRedirect}
				testID={testID}
			>
				<View>
					<View
						className='mb-2  flex flex-row  justify-between '
						style={{ columnGap: 2 }}
					>
						<TextElement
							textStyles='text-white text-sm font-medium flex-1 '
							numberOfLines={1}
						>
							{name}
						</TextElement>
					</View>
					<View className='overflow-hidden rounded-lg h-[150px]'>
						<CustomImage
							imageSrc={spotImageToShow}
							className='flex-1 w-full'
							contentFit='cover'
							width={150}
							height={150}
							testID='spot-thumbnail-image'
							placeholder={placeholder}
						/>
					</View>

					<View
						className={`flex-row items-center mt-1 ${screen !== 'searchSpots' ? '' : 'justify-end'}`}
						style={{ gap: 5 }}
					>
						{renderPlusIcon()}
						<SpotHeartButton
							onClickFavorite={(e: GestureResponderEvent) => {
								if (onClickFavorite) {
									onClickFavorite(e);
								}
							}}
							hasStatusFavorite={hasStatusFavorite}
							spotLikeCounter={
								spotType === 'db' && !!props.spotLikeCounter
									? props.spotLikeCounter
									: undefined
							}
						/>
						<View className='flex flex-row items-center justify-center'>
							<ScribbleIcon width={22} height={18} color='#B0B0B0' />
							<TextElement textStyles='text-xs ml-1 text-white'>
								{renderScribbleCount()}
							</TextElement>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		</>
	);
};

export default memo(SpotCandidateCard);
