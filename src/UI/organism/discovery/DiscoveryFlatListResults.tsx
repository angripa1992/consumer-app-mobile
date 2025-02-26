import { useCallback } from 'react';
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { TabView, Route } from 'react-native-tab-view';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import DiscoveryResultInfo from '@/UI/molecules/discovery/DiscoveryResultInfo';
import DiscoveryMainResults from './DiscoveryMainResults';
import DiscoveryCategoriesResults from './DiscoveryCategoriesResults';
import useDiscoveryResults from '@/lib/hooks/useDiscoveryResults';

import DiscoveryPeople from './DiscoveryPeople';
import DiscoveryAllSpots from './DiscoveryAllSpots';
import DiscoveryLists from './DiscoveryLists';

import type { TypeDiscoveryResults } from '@/lib/types/discovery';

type TypeDiscoveryFlatListResultsProps = {
	userRealTimeCountry: string | null;
	userRealTimeCity: string | null;
	userRealTimeLatitude: string | null;
	userRealTimeLongitude: string | null;
	currentCity: string;
	debounceSearchQuery: string;
	discoveryResults: TypeDiscoveryResults | undefined;
	isLoadingSearch: boolean;
	routes: Route[];
	tabIndex: number;
	setTabIndex: (index: number) => void;
	currentAreas: string[];
};

const DiscoveryFlatListResults = ({
	userRealTimeLatitude,
	userRealTimeLongitude,
	userRealTimeCountry,
	userRealTimeCity,
	currentCity,
	debounceSearchQuery,
	discoveryResults,
	isLoadingSearch,
	routes,
	tabIndex,
	setTabIndex,
	currentAreas,
}: TypeDiscoveryFlatListResultsProps) => {
	const layout = useWindowDimensions();

	const {
		refetchDiscoverySpots,
		isAnySpotNearby,
		renderPersonCard,
		renderPopularSpotCard,
		renderCandidateSpotCard,
		renderSpotListCard,
		renderSpotsNearby,
		isLoadingAllDiscoverySpots,
		discoverySpots,
		discoveryCategories,
		discoveryLists,
		discoverySpotsMessage,
	} = useDiscoveryResults({
		currentAreas,
		userRealTimeLatitude,
		userRealTimeLongitude,
		userRealTimeCity,
		currentCity,
		debounceSearchQuery,
		userRealTimeCountry,
		tabIndex,
	});

	const loadingSpinner = (
		<View className='h-full w-full flex items-center justify-center'>
			<SpinnerCup />
		</View>
	);

	const renderLoadingSpinner = useCallback(() => {
		const isLoadingSearchAndDiscoverySpots =
			isLoadingSearch || isLoadingAllDiscoverySpots;

		if (tabIndex === 2 && isLoadingSearchAndDiscoverySpots) {
			return loadingSpinner;
		}

		if (isLoadingSearch) {
			return loadingSpinner;
		}

		return null;
	}, [isLoadingSearch, isLoadingAllDiscoverySpots, tabIndex]);

	const renderScene = useCallback(
		({ route }: { route: Route }) => {
			switch (route.key) {
				case 'all':
					return (
						<ScrollView
							showsVerticalScrollIndicator={false}
							className='flex-1 mt-2'
						>
							{renderSpotsNearby()}
							{discoveryResults && (
								<DiscoveryMainResults
									currentArea={currentAreas}
									discoverySpots={discoverySpots}
									refetchDiscoverySpots={refetchDiscoverySpots}
									discoveryResults={discoveryResults}
									renderPersonCard={renderPersonCard}
									renderPopularSpotCard={renderPopularSpotCard}
									renderSpotListCard={renderSpotListCard}
									renderCandidateSpotCard={renderCandidateSpotCard}
									currentCity={currentCity}
									debounceSearchQuery={debounceSearchQuery}
								/>
							)}
						</ScrollView>
					);
				case 'categories':
					return (
						<DiscoveryCategoriesResults
							currentCity={currentCity}
							debounceSearchQuery={debounceSearchQuery}
							renderSpotListCard={renderSpotListCard}
						/>
					);
				case 'spot':
					return (
						<DiscoveryAllSpots
							searchQuery={debounceSearchQuery}
							spotsNearbyComponent={renderSpotsNearby()}
							renderCandidateSpotCard={renderCandidateSpotCard}
							currentCity={currentCity}
							currentAreas={currentAreas}
						/>
					);
				case 'user':
					return (
						<DiscoveryPeople
							searchQuery={debounceSearchQuery}
							renderPersonCard={renderPersonCard}
						/>
					);
				case 'spotList':
					return (
						<DiscoveryLists
							currentCity={currentCity}
							searchQuery={debounceSearchQuery}
							renderSpotListCard={renderSpotListCard}
						/>
					);

				default:
					return null;
			}
		},
		[
			renderSpotsNearby,
			discoveryResults,
			discoverySpots,
			refetchDiscoverySpots,
			renderPersonCard,
			renderPopularSpotCard,
			renderSpotListCard,
			renderCandidateSpotCard,
			currentCity,
			currentAreas,
			debounceSearchQuery,
		],
	);

	return (
		<View className='flex-1 mt-5'>
			{renderLoadingSpinner()}
			{discoveryResults && !isLoadingSearch && (
				<>
					<DiscoveryResultInfo
						currentCity={currentCity}
						debounceSearchQuery={debounceSearchQuery}
						discoveryCategories={discoveryCategories}
						discoveryLists={discoveryLists}
						discoveryResults={discoveryResults}
						discoverySpots={discoverySpots}
						isLoadingDiscoverySpots={isLoadingAllDiscoverySpots}
						tabIndex={tabIndex}
						isAnySpotNearby={isAnySpotNearby()}
						discoverySpotsMessage={discoverySpotsMessage}
					/>
					<TabView
						lazy
						navigationState={{ index: tabIndex, routes }}
						renderTabBar={() => null}
						renderScene={renderScene}
						onIndexChange={setTabIndex}
						initialLayout={{ width: layout.width }}
						swipeEnabled={false}
					/>
				</>
			)}
		</View>
	);
};

export default DiscoveryFlatListResults;
