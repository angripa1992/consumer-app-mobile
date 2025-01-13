import { useCallback, useEffect, useState } from 'react';
import { PressableProps, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import { useFocusEffect } from '@react-navigation/native';

import { useAppStore } from '@/lib/store/store';
import {
	useDeleteSpotFromList,
	usePostSpotToSpotList,
} from '@/lib/hooks/useQuerySpotSpot';
import { usePostHasRelationshipSpotAndList } from '@/lib/hooks/UseQuerySpot';

import TextElement from '@/UI/atoms/text/TextElement';
import ShareButton from '@/UI/molecules/share/ShareButton';
import SpotCuisine from './SpotCuisine';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import AddSpotButton from '@/UI/atoms/spot/AddSpotButton';
import {
	TypeAddSpotFromDBToSpotList,
	TypeAddSpotFromGooglePlacesToSpotList,
} from '@/lib/types/spotList';
import {
	TypeAddSpotToSpotListEvent,
	TypeHasRelationshipSpotAndListRequestBody,
} from '@/lib/types/spot';
import SpotHeartButton from '@/UI/atoms/spot/SpotHeartButton';

type TypeSpotTitleSectionProps = {
	title: string;
	subtitle?: string;
	spotId?: number | null;
	googlePlacesId?: string;
	cuisineValues?: string[] | null;
	onClickFavorite?: PressableProps['onPress'];
	hasStatusFavorite?: boolean;
	showFavoriteButton?: boolean;
	isOnPressTitle?: boolean;
	listIdToAddSpot?: number;
	spotSpotListIdToRemove?: number | null;
	isSpotInteraction?: boolean;
};

const SpotTitleSection = ({
	title,
	subtitle,
	spotId,
	googlePlacesId,
	cuisineValues,
	onClickFavorite,
	hasStatusFavorite,
	showFavoriteButton = true,
	isOnPressTitle = false,
	listIdToAddSpot,
	spotSpotListIdToRemove,
	isSpotInteraction,
}: TypeSpotTitleSectionProps) => {
	const navigation = useNavigation<AppStackNavigationProp>();

	const { mutateAsync: postHasRelationshipSpotAndList } =
		usePostHasRelationshipSpotAndList();
	const { mutateAsync: addSpotToSpotList } = usePostSpotToSpotList({
		queryMutateDestination: 'spot',
		spotId: spotId ?? googlePlacesId,
		googlePlaceLocationId: googlePlacesId ?? undefined,
		isCandidateSpot: !spotId,
	});
	const [currentSpotSpotListIdToRemove, setCurrentSpotSpotListIdToRemove] =
		useState(spotSpotListIdToRemove);

	const { mutateAsync: deleteSpot } = useDeleteSpotFromList({
		queryMutateDestination: 'spot',
		spotSpotListId: currentSpotSpotListIdToRemove,
		spotListId: listIdToAddSpot,
		googlePlaceLocationId: googlePlacesId,
		spotId: spotId ?? undefined,
	});

	const { spotCandidate } = useAppStore(
		useShallow((state) => ({
			spotCandidate: state.spotCandidate,
		})),
	);

	const [hasRelationshipSpotAndList, setHasRelationshipSpotAndList] =
		useState(false);
	const [disableAddSpotButton, setDisableAddSpotButton] = useState(false);

	const checkRelationshipSpotAndList = useCallback(async () => {
		if (listIdToAddSpot) {
			const valuesToSend: TypeHasRelationshipSpotAndListRequestBody = {
				spot_list_id: listIdToAddSpot,
			};

			if (spotId) {
				valuesToSend.spot_id = spotId;
			} else if (googlePlacesId) {
				valuesToSend.google_place_location_id = googlePlacesId;
			}

			await postHasRelationshipSpotAndList(valuesToSend).then((res) => {
				setHasRelationshipSpotAndList(
					res?.relationship_with_spot_list ?? false,
				);
				setCurrentSpotSpotListIdToRemove(res?.spot_spot_list_id);
				setDisableAddSpotButton(false);
			});
		}
	}, []);

	const onPressAddSpotToList = async () => {
		if (!listIdToAddSpot || (!spotId && !googlePlacesId)) {
			return;
		}

		setDisableAddSpotButton(true);
		setHasRelationshipSpotAndList(!hasRelationshipSpotAndList);

		let dataAddSpotEvent: TypeAddSpotToSpotListEvent = {
			spot_id: spotId ?? googlePlacesId,
			spot_name: title,
			spot_list_id: listIdToAddSpot,
		};
		let dataToSend:
			| TypeAddSpotFromGooglePlacesToSpotList
			| TypeAddSpotFromDBToSpotList
			| null = null;

		if (googlePlacesId && spotCandidate) {
			const candidateAddress = spotCandidate.address;
			const candidateCity = spotCandidate.city;
			const candidateCountry = spotCandidate.country;
			const candidateName = spotCandidate.name;

			dataToSend = {
				spot_id: null,
				spot_list_id: listIdToAddSpot,
				google_place_location_id: googlePlacesId,
				city: candidateCity,
				country: candidateCountry,
				address: candidateAddress ?? '',
				name: candidateName,
				spotType: 'googlePlaces',
			};
		} else if (spotId) {
			dataToSend = {
				spot_id: spotId,
				spot_list_id: listIdToAddSpot,
				spotType: 'db',
			};
		}

		if (dataToSend) {
			await addSpotToSpotList({
				values: dataToSend,
				dataAddSpotEvent,
			}).then((res) => {
				setCurrentSpotSpotListIdToRemove(res?.spot_spot_list.id);
			});
			await checkRelationshipSpotAndList();
		}
	};

	const onPlusIconClickToDelete = async () => {
		setDisableAddSpotButton(true);
		setHasRelationshipSpotAndList(!hasRelationshipSpotAndList);
		await deleteSpot();
		await checkRelationshipSpotAndList();
	};

	const onPressTitle = () => {
		if (spotId) {
			navigation.replace('SingleSpot', { spotId });

			return;
		}

		if (googlePlacesId) {
			navigation.replace('SingleSpot', {
				spotId: googlePlacesId,
				isCandidateSpot: true,
			});
		}
	};

	const renderAddToListButton = () => {
		if (listIdToAddSpot) {
			return (
				<AddSpotButton
					onPlusIconClick={(e) => {
						if (hasRelationshipSpotAndList) {
							onPlusIconClickToDelete();
						} else {
							onPressAddSpotToList();
						}
					}}
					isFilled={hasRelationshipSpotAndList}
					isDisabled={disableAddSpotButton}
				/>
			);
		}

		return <></>;
	};

	useFocusEffect(
		useCallback(() => {
			checkRelationshipSpotAndList();
		}, []),
	);

	return (
		<View>
			<View className='flex flex-row justify-between '>
				<View className='flex-1'>
					{!isSpotInteraction ? (
						<TextElement
							textStyles='text-lg text-gray font-bold mr-2'
							testID={`spot-name`}
							onPress={isOnPressTitle ? onPressTitle : undefined}
						>
							{title}
						</TextElement>
					) : (
						<>
							<TextElement
								textStyles='text-2xl text-white font-bold '
								fontFamily='pachang'
							>
								{title}
							</TextElement>
							<TextElement
								textStyles='text-xl text-white font-semibold mt-2 '
								testID={`spot-name`}
								onPress={isOnPressTitle ? onPressTitle : undefined}
							>
								{subtitle}
							</TextElement>
						</>
					)}
				</View>
				<View
					className='flex-row flex items-center mt-[-6px]'
					style={{ gap: 6 }}
				>
					<View>{renderAddToListButton()}</View>
					{spotId && (
						<ShareButton
							type='spot'
							id={spotId}
							showText={false}
							testID={'spot-share-button'}
							color='#B0B0B0'
						/>
					)}
					{showFavoriteButton && (
						<SpotHeartButton
							onClickFavorite={(e) => {
								if (onClickFavorite) onClickFavorite(e);
							}}
							hasStatusFavorite={!!hasStatusFavorite}
						/>
					)}
				</View>
			</View>
			<SpotCuisine cuisine={cuisineValues ?? []} />
		</View>
	);
};

export default SpotTitleSection;
