import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';
import {
	useGetFollowingScribbles,
	useGetGeneralScribbles,
	usePostScribble,
} from '@/lib/hooks/useQueryScribbles';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import ScribblesForSpotCard from '@/UI/organism/spot/card/ScribblesForSpotCard';
import ScribbleFormModal from '@/UI/organism/spot/modal/ScribbleFormModal';
import SpotNoResultsView from './error/SpotNoResultsView';

import type { TypeFeedTabFilter } from '@/lib/types/feed';
import type {
	TypeAddOrEditScribbleFormValues,
	TypeAddOrEditScribbleValues,
	TypeScribble,
} from '@/lib/types/scribbles';
import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import {
	TypeAddStatusTagsFromDB,
	TypeAddStatusTagsFromGooglePlaces,
	TypeDetailsSpotCandidate,
	TypeSpotSingleToUserPage,
} from '@/lib/types/spot';
import { ImagePickerAsset } from 'expo-image-picker';
import { getImageUriInformation } from '@/lib/helpers/strings/getImageUriInformation';
import { addOrEditScribbleFormValuesSchema } from '@/lib/schemas/scribbles';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

interface ScribblesForSpotFlatListProps {
	spotId?: number;
	googlePlacesId?: string;
	spotName: string;
	scribblesForFilterValue: TypeFeedTabFilter;
	setThereIsResults: (value: boolean) => void;
	setShowScribbleAnimation: (value: boolean) => void;
	singleSpot: TypeSpotSingleToUserPage | TypeDetailsSpotCandidate;
}

const ScribblesForSpotFlatList = ({
	spotId,
	googlePlacesId,
	spotName,
	scribblesForFilterValue,
	setThereIsResults,
	setShowScribbleAnimation,
	singleSpot,
}: ScribblesForSpotFlatListProps) => {
	const { user, spotCandidate } = useAppStore(
		useShallow((state) => ({
			user: state.user,
			spotCandidate: state.spotCandidate,
		})),
	);
	const navigation = useNavigation<AppStackNavigationProp>();
	const scribbleFormModalRef = useRef<BottomSheetModal>(null);
	const [scribbleImagesToSave, setScribbleImagesToSave] = useState<
		ImagePickerAsset[] | null
	>([]);
	const formMethods = useForm<TypeAddOrEditScribbleFormValues>({
		resolver: zodResolver(addOrEditScribbleFormValuesSchema),
		defaultValues: {
			visit_date: null,
			is_positive: undefined,
			review_description: undefined,
		},
	});

	const {
		generalScribbles,
		isLoadingGeneralScribbles,
		fetchNextPageGeneralScribbles,
		hasNextPageGeneralScribbles,
		isFetchingNextPageGeneralScribbles,
		refetchGeneralScribbles,
		isErrorGeneralScribbles,
	} = useGetGeneralScribbles(spotId, googlePlacesId);

	const {
		followingScribbles,
		isLoadingFollowingScribbles,
		fetchNextPageFollowingScribbles,
		hasNextPageFollowingScribbles,
		isFetchingNextPageFollowingScribbles,
		refetchFollowingScribbles,
		isErrorFollowingScribbles,
	} = useGetFollowingScribbles(spotId, googlePlacesId);

	useRefetchOnFocus(refetchFollowingScribbles);
	useRefetchOnFocus(refetchGeneralScribbles);

	const handleRedirectToProfileView = (userId: number) => {
		navigation.navigate('ProfileScreen', { userId });
	};

	const queryMutateDestination =
		scribblesForFilterValue === 'community'
			? 'scribbles'
			: 'followingScribbles';
	const { mutateAsync: postScribble, isLoading: isLoadingPostScribble } =
		usePostScribble(queryMutateDestination, spotId, googlePlacesId);

	const renderCard = (scribble: TypeScribble, index: number) => {
		return (
			<ScribblesForSpotCard
				spotId={spotId}
				scribbleId={scribble.scribble_id}
				spotName={spotName}
				eventId={scribble.event_id}
				userId={scribble.creator_user_id}
				username={scribble.creator_username}
				emojis={scribble.emojis}
				reviewDescription={scribble.review_description}
				visitedDate={scribble.visit_date}
				profilePictureUrl={scribble.creator_image}
				isPositive={scribble.is_positive}
				queryMutateDestination={queryMutateDestination}
				testId={`scribble-card-${index}`}
				handleRedirectProfile={handleRedirectToProfileView}
				googlePlacesLocationId={googlePlacesId}
				scribbleImages={scribble.scribble_images}
			/>
		);
	};

	const valuesToUpdate = () => {
		if (singleSpot?.id) {
			const dataToSave: Partial<TypeAddStatusTagsFromDB> = {
				spot_id: singleSpot.id,
			};

			return dataToSave;
		}

		if (singleSpot?.google_place_location_id && spotCandidate) {
			const dataToSave: Partial<TypeAddStatusTagsFromGooglePlaces> = {
				city: spotCandidate.city,
				country: spotCandidate.country,
				name: spotCandidate.name,
				address: spotCandidate.address,
				google_place_location_id: googlePlacesId,
			};

			return dataToSave;
		}

		return {};
	};

	const onSubmit: SubmitHandler<TypeAddOrEditScribbleFormValues> = async (
		data,
	) => {
		if (!user || isLoadingPostScribble) return;

		const dataToSend: TypeAddOrEditScribbleValues = {
			is_positive: data.is_positive,
			review_description: data.review_description,
			user_id: user.id,
			...valuesToUpdate(),
		};

		if (data?.visit_date) {
			const visitIsoDate = data?.visit_date.toISOString();

			dataToSend['visit_date'] = visitIsoDate;
		}

		const isValidScribbleImagesToSend =
			scribbleImagesToSave &&
			Array.isArray(scribbleImagesToSave) &&
			scribbleImagesToSave.length > 0;

		if (isValidScribbleImagesToSend) {
			const imagesToSend = scribbleImagesToSave.map((image) => {
				const { fileName, fileType } = getImageUriInformation(image.uri);

				return {
					uri: image.uri,
					type: fileType,
					name: fileName,
				};
			});

			dataToSend['scribble_file_images'] = imagesToSend.slice(0, 3);
		}

		scribbleFormModalRef.current?.close();

		setShowScribbleAnimation(true);
		await postScribble(dataToSend);
		await setTimeout(() => {
			setShowScribbleAnimation(false);
		}, 1000);
	};

	const onPressAddScribble = () => {
		setScribbleImagesToSave(null);
		formMethods.reset();
		scribbleFormModalRef.current?.present();
	};

	useEffect(() => {
		if (scribblesForFilterValue === 'community') {
			refetchGeneralScribbles();
		} else {
			refetchFollowingScribbles();
		}
	}, [scribblesForFilterValue]);

	useEffect(() => {
		if (scribblesForFilterValue === 'community') {
			if ((generalScribbles?.length ?? 0) > 0 || isLoadingGeneralScribbles) {
				setThereIsResults(true);
			} else {
				setThereIsResults(false);
			}
		} else {
			if (
				(followingScribbles?.length ?? 0) > 0 ||
				isLoadingFollowingScribbles
			) {
				setThereIsResults(true);
			} else {
				setThereIsResults(false);
			}
		}
	}, [scribblesForFilterValue, generalScribbles, followingScribbles]);

	return (
		<>
			{scribblesForFilterValue === 'community' ? (
				<InfiniteScrollFlashList
					dataToRender={generalScribbles}
					renderItem={({ item: event, index }) => {
						return renderCard(event, index);
					}}
					hasNextPage={hasNextPageGeneralScribbles}
					isLoading={isLoadingGeneralScribbles}
					fetchNextPage={fetchNextPageGeneralScribbles}
					isFetchingNextPage={isFetchingNextPageGeneralScribbles}
					customEmptyComponent={<SpotNoResultsView typeMessage='scribbles' />}
					keyExtractor={(_, index) => {
						return index.toString();
					}}
					isOneColumn
					isError={isErrorGeneralScribbles}
					refetch={refetchGeneralScribbles}
				/>
			) : (
				<InfiniteScrollFlashList
					dataToRender={followingScribbles}
					renderItem={({ item: event, index }) => {
						return renderCard(event, index);
					}}
					hasNextPage={hasNextPageFollowingScribbles}
					isLoading={isLoadingFollowingScribbles}
					fetchNextPage={fetchNextPageFollowingScribbles}
					isFetchingNextPage={isFetchingNextPageFollowingScribbles}
					customEmptyComponent={<SpotNoResultsView typeMessage='scribbles' />}
					keyExtractor={(_, index) => {
						return index.toString();
					}}
					isOneColumn
					isError={isErrorFollowingScribbles}
					refetch={refetchFollowingScribbles}
				/>
			)}
			<ButtonPrimary
				testID='add-scribble-button'
				buttonStyles='mb-3'
				onPress={onPressAddScribble}
				designVariation='green'
			>
				{i18nInstance.t('createScribble')}
			</ButtonPrimary>
			<ScribbleFormModal
				onSubmit={onSubmit}
				scribbleFormModalRef={scribbleFormModalRef}
				isLoadingPostScribble={isLoadingPostScribble}
				scribbleImagesToSave={scribbleImagesToSave}
				setScribbleImagesToSave={setScribbleImagesToSave}
				formMethods={formMethods}
			/>
		</>
	);
};

export default ScribblesForSpotFlatList;
