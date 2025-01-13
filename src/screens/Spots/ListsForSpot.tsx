import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { useShallow } from 'zustand/react/shallow';

import {
	useGetDetailsSingleCandidateSpot,
	useGetSingleSpot,
} from '@/lib/hooks/UseQuerySpot';
import { useAppStore } from '@/lib/store/store';
import { i18nInstance } from 'config/i18n';

import MainLayout from '@/UI/layouts/MainLayout';
import FeedFilterTabs from '@/UI/organism/feed/filter/FeedFilterTabs';
import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import SpotTitleSection from '@/UI/molecules/spot/SpotTitleSection';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import SpotAddToList from '@/UI/molecules/spot/SpotAddToList';
import ListsForSpotFlatList from '@/UI/organism/spot/ListsForSpotFlatList';
import TextureError from '@/UI/assets/images/textures/texture-error.png';
import HeaderYellow from '@/images/layout/bacground-layout-yellow.png';

import type { TypeFeedTabFilter } from '@/lib/types/feed';
import type {
	ListsForSpotScreenRouteParams,
	SpotScreenRouteProp,
} from '@/lib/types/tabScreenParams';

const ListsForSpotScreen = ({ route }: ListsForSpotScreenRouteParams) => {
	const { spotId, googlePlacesId } = route.params;
	const navigation = useNavigation<SpotScreenRouteProp>();

	const { singleSpot } = useGetSingleSpot(spotId);
	const { singleCandidateSpot } =
		useGetDetailsSingleCandidateSpot(googlePlacesId);

	const { spotCandidate } = useAppStore(
		useShallow((state) => ({
			spotCandidate: state.spotCandidate,
		})),
	);

	const [thereIsResults, setThereIsResults] = useState(true);
	const [spotToShow, setSpotToShow] = useState(
		singleSpot ? singleSpot : singleCandidateSpot,
	);

	const [listsForFilterValue, setListsForFilterValue] =
		useState<TypeFeedTabFilter>('community');

	const onBackPress = () => {
		navigation.goBack();
	};

	useEffect(() => {
		setSpotToShow(singleSpot ? singleSpot : singleCandidateSpot);
	}, [singleCandidateSpot, singleSpot]);

	return (
		<>
			<HeaderGoBack redirect={onBackPress} />
			<MainLayout
				isDismissKeyboardActive={false}
				isKeyAvoidingView={false}
				subContainerStyles='w-full px-5'
				customSubContainerElement={
					<>
						{!thereIsResults && (
							<Image
								source={TextureError}
								className='absolute bottom-0 right-0 w-full h-full z-[-1] flex-1'
							/>
						)}
					</>
				}
			>
				<Image
					source={HeaderYellow}
					className='h-[150px] w-screen absolute left-0 top-0 z-[-1]'
				/>
				<View>
					<SpotTitleSection
						spotId={spotId}
						title={i18nInstance.t('lists')}
						subtitle={spotToShow?.name ?? ''}
						showFavoriteButton={false}
						cuisineValues={spotToShow?.cuisine}
						isSpotInteraction
					/>
					<View className='h-[60px] mb-4'>
						<FeedFilterTabs
							currentFilter={listsForFilterValue}
							setCurrentFilter={setListsForFilterValue}
						/>
					</View>
				</View>
				<ListsForSpotFlatList
					spotId={spotId}
					googlePlacesId={googlePlacesId}
					listsForFilterValue={listsForFilterValue}
					setThereIsResults={setThereIsResults}
				/>
				{!spotToShow ? (
					<ButtonPrimary disabled>
						{`${i18nInstance.t('loading')}...`}
					</ButtonPrimary>
				) : (
					<SpotAddToList
						spotName={spotToShow.name}
						spotId={spotToShow.id}
						googlePlaceLocationId={spotToShow.google_place_location_id}
						candidateSpotData={spotCandidate}
						isCandidateSpot={spotToShow.id ? false : true}
					/>
				)}
			</MainLayout>
		</>
	);
};

export default ListsForSpotScreen;
