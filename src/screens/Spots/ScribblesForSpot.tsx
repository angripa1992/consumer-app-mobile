import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { ResizeMode, Video } from 'expo-av';

import {
	useGetDetailsSingleCandidateSpot,
	useGetSingleSpot,
} from '@/lib/hooks/UseQuerySpot';

import { i18nInstance } from 'config/i18n';

import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import MainLayout from '@/UI/layouts/MainLayout';
import SpotTitleSection from '@/UI/molecules/spot/SpotTitleSection';
import TextureError from '@/UI/assets/images/textures/texture-error.png';
import FeedFilterTabs from '@/UI/organism/feed/filter/FeedFilterTabs';
import ScribblesForSpotFlatList from '@/UI/organism/spot/ScribblesForSpotFlatList';
import HeaderViolet from '@/images/layout/background-layout-violet.png';

import type { TypeFeedTabFilter } from '@/lib/types/feed';
import type {
	ScribblesForSpotScreenRouteParams,
	SpotScreenRouteProp,
} from '@/lib/types/tabScreenParams';

const ScribblesForSpot = ({ route }: ScribblesForSpotScreenRouteParams) => {
	const { spotId, googlePlacesId } = route.params;
	const navigation = useNavigation<SpotScreenRouteProp>();
	const { singleSpot } = useGetSingleSpot(spotId);
	const { singleCandidateSpot } =
		useGetDetailsSingleCandidateSpot(googlePlacesId);

	const [thereIsResults, setThereIsResults] = useState(true);
	const [showScribbleAnimation, setShowScribbleAnimation] = useState(false);
	const [spotToShow, setSpotToShow] = useState(
		singleSpot ? singleSpot : singleCandidateSpot,
	);
	const [scribblesForFilterValue, setScribblesForFilterValue] =
		useState<TypeFeedTabFilter>('community');

	const onBackPress = () => {
		navigation.goBack();
	};

	useEffect(() => {
		setSpotToShow(singleSpot ? singleSpot : singleCandidateSpot);
	}, [singleSpot, singleCandidateSpot]);

	return (
		<>
			{showScribbleAnimation && (
				<View className='h-screen w-screen bg-black flex opacity-[0.85] justify-center items-center absolute top-0 left-0 z-10'>
					<Video
						className='h-full w-[200px]'
						source={require('../../UI/assets/videos/scribble-submitted.mp4')}
						shouldPlay
						resizeMode={ResizeMode.CONTAIN}
						isLooping
						isMuted
					/>
				</View>
			)}
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
					source={HeaderViolet}
					className='h-[150px] w-screen absolute left-0 top-0 z-[-1]'
				/>

				<SpotTitleSection
					spotId={spotId}
					title={i18nInstance.t('scribbles')}
					subtitle={spotToShow?.name ?? ''}
					showFavoriteButton={false}
					cuisineValues={spotToShow?.cuisine}
					isSpotInteraction
					isOnPressTitle
				/>
				<View className='h-[60px] mb-4'>
					<FeedFilterTabs
						currentFilter={scribblesForFilterValue}
						setCurrentFilter={setScribblesForFilterValue}
					/>
				</View>
				{spotToShow && (
					<ScribblesForSpotFlatList
						spotId={spotToShow.id ?? undefined}
						googlePlacesId={spotToShow.google_place_location_id ?? undefined}
						spotName={spotToShow?.name}
						scribblesForFilterValue={scribblesForFilterValue}
						setThereIsResults={setThereIsResults}
						singleSpot={spotToShow}
						setShowScribbleAnimation={setShowScribbleAnimation}
					/>
				)}
			</MainLayout>
		</>
	);
};

export default ScribblesForSpot;
