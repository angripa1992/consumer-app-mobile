import { useCallback } from 'react';
import { View } from 'react-native';

import {
	useGetSpotsNearby,
	usePostDiscoveryCategories,
	usePostDiscoveryLists,
	usePostDiscoverySpots,
	usePostDiscoverySpotsWithInfiniteScroll,
} from '@/lib/hooks/useQueryDiscovery';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import ProfileThumbnail from '@/UI/molecules/profile/ProfileThumbnail';
import SpotThumbnail from '@/UI/organism/spot/SpotThumbnail';
import SpotCandidateCard from '@/UI/molecules/spot/SpotCandidateCard';
import SpotListThumbnail from '@/UI/organism/spotList/SpotListThumbnail';
import DiscoverySpotsNearbyResults from '@/UI/organism/discovery/DiscoverySpotsNearbyResults';

import type {
	TypeDiscoveryPersonCard,
	TypePopularSpotCard,
	TypeSpotFromDiscoveryCard,
	TypeSpotListFromDiscoveryCard,
} from '../types/discovery';

interface UseDiscoveryResultsProps {
	userRealTimeCity: string | null;
	userRealTimeCountry: string | null;
	userRealTimeLatitude: string | null;
	userRealTimeLongitude: string | null;
	currentCity: string;
	debounceSearchQuery: string;
	tabIndex: number;
	currentAreas: string[];
}

const useDiscoveryResults = ({
	tabIndex,
	userRealTimeLatitude,
	userRealTimeLongitude,
	userRealTimeCountry,
	userRealTimeCity,
	currentCity,
	debounceSearchQuery,
	currentAreas,
}: UseDiscoveryResultsProps) => {
	const {
		spotsNearby,
		isLoading: isLoadingSpotsNearby,
		refetch: refetchSpotsNearby,
	} = useGetSpotsNearby({
		city: userRealTimeCity,
		latitude: userRealTimeLatitude,
		longitude: userRealTimeLongitude,
	});

	const {
		discoverySpots,
		discoverySpotsMessage,
		refetch: refetchDiscoverySpots,
	} = usePostDiscoverySpots(currentCity, currentAreas[0], {
		search_content: debounceSearchQuery,
	});

	const { allDiscoverySpots, isLoadingAllDiscoverySpots } =
		usePostDiscoverySpotsWithInfiniteScroll(currentCity, currentAreas[0], {
			search_content: debounceSearchQuery,
		});

	const { discoveryLists } = usePostDiscoveryLists(currentCity, {
		search_content: debounceSearchQuery,
	});

	const { discoveryCategories } = usePostDiscoveryCategories(currentCity, {
		search_content: debounceSearchQuery,
	});

	useRefetchOnFocus(refetchSpotsNearby);

	const isAnySpotNearby = () => {
		const isAllTab = tabIndex === 0;
		const isSpotTab = tabIndex === 2;

		if (isAllTab || isSpotTab) {
			return !!spotsNearby && spotsNearby.length > 0;
		}
		return false;
	};

	const flashListItemsStyles = useCallback(
		(isFlashList: boolean, index: number) => {
			if (isFlashList) {
				return index % 2 === 0 ? 'mr-3' : 'ml-3';
			} else {
				return '';
			}
		},
		[],
	);

	const renderPersonCard = useCallback(
		({
			item,
			index,
			categoryName,
			containerStyles,
			queryMutateDestination,
			isSmallVariant,
		}: TypeDiscoveryPersonCard) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<ProfileThumbnail
					queryMutateDestination={queryMutateDestination}
					name={item.name}
					imageUrl={item.profile_image}
					isFollowing={item.is_following}
					followUserId={item.id}
					searchQuery={debounceSearchQuery}
					currentCity={currentCity}
					categoryName={categoryName}
					testID={`person-card-${index}`}
					containerStyles={`${containerStyles}`}
					designVariation={isSmallVariant ? 'small' : 'large'}
				/>
			);
		},
		[currentCity, debounceSearchQuery],
	);

	const renderPopularSpotCard = useCallback(
		({ item, index, containerStyles }: TypePopularSpotCard) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<SpotThumbnail
					queryMutateDestination={'popularSpotDiscovery'}
					{...item}
					cardContainerStyles={containerStyles}
					searchQuery={debounceSearchQuery}
					currentCity={currentCity}
					testID={`popular-spot-${index}`}
				/>
			);
		},
		[currentCity, debounceSearchQuery],
	);

	const renderCandidateSpotCard = useCallback(
		({
			item,
			index,
			containerStyles,
			queryMutateDestination,
			isFlashList = false,
		}: TypeSpotFromDiscoveryCard) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			if (item.id) {
				return (
					<SpotCandidateCard
						queryMutateDestination={queryMutateDestination}
						id={item.id}
						name={item.name}
						spotType='db'
						smallImage={item.small_image}
						viewerStatusTags={item.viewer_status_tags}
						screen='notSearchSpots'
						googlePlaceLocationId={item.google_place_location_id}
						spotLikeCounter={item.spot_like_counter}
						spotScribblesCount={item.scribbles_count}
						currentCity={currentCity}
						searchQuery={debounceSearchQuery}
						testID={`spot-candidate-${index}`}
						currentArea={currentAreas[0]}
						cardContainerStyles={`flex-1 ${flashListItemsStyles(isFlashList, index)} ${containerStyles}`}
					/>
				);
			}
			return (
				<SpotCandidateCard
					queryMutateDestination={queryMutateDestination}
					id={item.id}
					name={item.name}
					city={item.city}
					country={item.country}
					address={item.address}
					googlePlaceLocationId={item.google_place_location_id as string}
					smallImage={item.small_image}
					spotType='googlePlaces'
					viewerStatusTags={item.viewer_status_tags}
					screen='notSearchSpots'
					currentCity={currentCity}
					searchQuery={debounceSearchQuery}
					state={item.state}
					testID={`spot-candidate-${index}`}
					currentArea={currentAreas[0]}
					cardContainerStyles={`flex-1 ${flashListItemsStyles(isFlashList, index)} ${containerStyles}`}
				/>
			);
		},
		[currentCity, debounceSearchQuery, currentAreas[0]],
	);

	const renderSpotListCard = useCallback(
		({
			item,
			index,
			categoryName,
			containerStyles,
			queryMutateDestination,
			isHorizontal,
		}: TypeSpotListFromDiscoveryCard) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}
			return (
				<SpotListThumbnail
					queryMutateDestination={queryMutateDestination}
					title={item.name}
					creator={item.creator}
					viewsCount={item.view_counter}
					likesCount={item.followers_spot_list_counter}
					locationCount={item.spot_counter}
					userId={item.user_id}
					spotListId={item.id}
					spotsImages={item.spot_images_available}
					isFollowing={item.is_following}
					searchQuery={debounceSearchQuery}
					currentCity={currentCity}
					categoryName={categoryName}
					testID={`list-${index}`}
					customContainerButtonsStyles={isHorizontal ? '' : 'flex-[0_2]'}
					cardContainerStyles={`flex-1 ${flashListItemsStyles(
						!isHorizontal,
						index,
					)} ${containerStyles}`}
				/>
			);
		},
		[currentCity, debounceSearchQuery],
	);

	const renderSpotsNearby = () => {
		return (
			<DiscoverySpotsNearbyResults
				spotsNearby={spotsNearby}
				userRealTimeLatitude={userRealTimeLatitude}
				userRealTimeLongitude={userRealTimeLongitude}
				userRealTimeCity={userRealTimeCity}
				userRealTimeCountry={userRealTimeCountry}
				isLoadingSpotsNearby={isLoadingSpotsNearby}
			/>
		);
	};

	return {
		refetchDiscoverySpots,
		isAnySpotNearby,
		renderPersonCard,
		renderPopularSpotCard,
		renderCandidateSpotCard,
		renderSpotListCard,
		renderSpotsNearby,
		isLoadingAllDiscoverySpots,
		allDiscoverySpots,
		discoverySpots,
		discoveryCategories,
		discoveryLists,
		discoverySpotsMessage,
	};
};

export default useDiscoveryResults;
