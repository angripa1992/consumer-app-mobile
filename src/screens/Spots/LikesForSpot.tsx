import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';

import {
	useGetDetailsSingleCandidateSpot,
	useGetSingleSpot,
} from '@/lib/hooks/UseQuerySpot';
import { i18nInstance } from 'config/i18n';

import MainLayout from '@/UI/layouts/MainLayout';
import FeedFilterTabs from '@/UI/organism/feed/filter/FeedFilterTabs';
import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import SpotTitleSection from '@/UI/molecules/spot/SpotTitleSection';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextureError from '@/UI/assets/images/textures/texture-error.png';
import LikesForSpotFlatList from '@/UI/organism/spot/LikesForSpotFlatList';
import SpotLikeListButton from '@/UI/molecules/spot/SpotLikeListButton';
import HeaderPurple from '@/images/layout/background-layout-purple.png';

import type { TypeFeedTabFilter } from '@/lib/types/feed';
import type {
	LikesForSpotScreenRouteParams,
	SpotScreenRouteProp,
} from '@/lib/types/tabScreenParams';

const LikesForSpotScreen = ({ route }: LikesForSpotScreenRouteParams) => {
	const { spotId, googlePlacesId } = route.params;
	const navigation = useNavigation<SpotScreenRouteProp>();

	const { singleSpot } = useGetSingleSpot(spotId);
	const { singleCandidateSpot } =
		useGetDetailsSingleCandidateSpot(googlePlacesId);

	const [thereIsResults, setThereIsResults] = useState(true);

	const [likesForFilterValue, setLikesForFilterValue] =
		useState<TypeFeedTabFilter>('community');

	const [spotToShow, setSpotToShow] = useState(
		singleSpot ? singleSpot : singleCandidateSpot,
	);

	const onBackPress = () => {
		navigation.goBack();
	};

	useEffect(() => {
		setSpotToShow(singleSpot ? singleSpot : singleCandidateSpot);
	}, [singleSpot, singleCandidateSpot]);

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
					source={HeaderPurple}
					className='h-[150px] w-screen absolute left-0 top-0 z-[-1]'
				/>

				<SpotTitleSection
					spotId={spotId}
					title={i18nInstance.t('likes')}
					subtitle={spotToShow?.name ?? ''}
					showFavoriteButton={false}
					cuisineValues={spotToShow?.cuisine}
					isSpotInteraction
				/>
				<View className='h-[60px] mb-4'>
					<FeedFilterTabs
						currentFilter={likesForFilterValue}
						setCurrentFilter={setLikesForFilterValue}
					/>
				</View>
				<LikesForSpotFlatList
					likesForFilterValue={likesForFilterValue}
					spotId={spotToShow?.id ?? undefined}
					googlePlacesId={spotToShow?.google_place_location_id ?? undefined}
					setThereIsResults={setThereIsResults}
				/>
				<View className='mb-3'>
					{spotToShow ? (
						<SpotLikeListButton singleSpot={spotToShow} />
					) : (
						<ButtonPrimary
							disabled
						>{`${i18nInstance.t('loading')}...`}</ButtonPrimary>
					)}
				</View>
			</MainLayout>
		</>
	);
};

export default LikesForSpotScreen;
