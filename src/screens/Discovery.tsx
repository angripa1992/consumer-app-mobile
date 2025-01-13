import { TouchableOpacity, View } from 'react-native';
import { i18nInstance } from 'config/i18n';

import MainLayout from '@/UI/layouts/MainLayout';
import DiscoveryFlatListResults from '@/UI/organism/discovery/DiscoveryFlatListResults';
import SearchInput from '@/UI/molecules/input/SearchInput';
import DiscoverySpotsNearbyButton from '@/UI/molecules/discovery/DiscoverySpotsNearbyButton';

import useDiscoveryScreen from '@/lib/hooks/useDiscoveryScreen';
import TextElement from '@/UI/atoms/text/TextElement';
import DiscoveryFilterModal from '@/UI/organism/discovery/DiscoveryFilterModal';
import FilterModalIcon from '@/UI/assets/svg/FilterModalIcon';

const DiscoveryScreen = () => {
	const {
		tabIndex,
		setTabIndex,
		routes,
		status,
		requestPermission,
		userRealTimeCity,
		userRealTimeCountry,
		userRealTimeLatitude,
		userRealTimeLongitude,
		globalCityFilterValue,
		searchQueryValue,
		discoveryResults,
		isLoadingSearch,
		onClearInput,
		controlDiscoveryFilter,
		watchDiscoveryFilter,
		debounceSearchQuery,
		setValueDiscoveryFilter,
		showLocationMessageError,
		locationMessageError,
		filterModalRef,
		isFilterModalOpen,
		setIsFilterModalOpen,
		areasValue,
	} = useDiscoveryScreen();

	return (
		<MainLayout isDismissKeyboardActive={false} hasBgTexture={true}>
			<TextElement
				fontFamily='pachang'
				designVariation='main-title'
				textStyles='mb-4'
			>
				{i18nInstance.t('explore')}
			</TextElement>
			<View className='flex-row items-center'>
				<SearchInput
					searchQueryValue={searchQueryValue}
					control={controlDiscoveryFilter}
					name={'searchQuery'}
					clearInput={onClearInput}
					showCustomError={showLocationMessageError}
					customErrorText={locationMessageError}
					testID='discovery-search-input'
					containerStyles='flex-1 mr-3'
				/>
				<TouchableOpacity
					onPress={() => {
						filterModalRef.current?.present();
						setIsFilterModalOpen(true);
					}}
					activeOpacity={1}
				>
					<View className='bg-principal-green p-3 rounded-lg'>
						<FilterModalIcon />
					</View>
				</TouchableOpacity>
			</View>
			<DiscoverySpotsNearbyButton
				showButton={tabIndex === 3 || tabIndex === 0}
				status={status}
				requestPermission={requestPermission}
			/>
			<DiscoveryFilterModal
				filterModalRef={filterModalRef}
				tabIndex={tabIndex}
				setTabIndex={setTabIndex}
				controlDiscoveryFilter={controlDiscoveryFilter}
				watchDiscoveryFilter={watchDiscoveryFilter}
				isFilterModalOpen={isFilterModalOpen}
				setIsFilterModalOpen={setIsFilterModalOpen}
				setValueDiscoveryFilter={setValueDiscoveryFilter}
			/>
			<DiscoveryFlatListResults
				userRealTimeLatitude={userRealTimeLatitude}
				userRealTimeLongitude={userRealTimeLongitude}
				userRealTimeCountry={userRealTimeCountry}
				userRealTimeCity={userRealTimeCity}
				currentCity={globalCityFilterValue}
				discoveryResults={discoveryResults}
				debounceSearchQuery={debounceSearchQuery}
				isLoadingSearch={isLoadingSearch}
				routes={routes}
				tabIndex={tabIndex}
				setTabIndex={setTabIndex}
				currentAreas={areasValue}
			/>
		</MainLayout>
	);
};

export default DiscoveryScreen;
