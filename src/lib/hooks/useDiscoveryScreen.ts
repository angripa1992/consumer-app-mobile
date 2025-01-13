import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { Route } from 'react-native-tab-view';
import { useShallow } from 'zustand/react/shallow';
import * as Location from 'expo-location';
import * as Sentry from '@sentry/react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { usePostSearchDiscovery } from '@/lib/hooks/useQueryDiscovery';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { useAppStore } from '@/lib/store/store';
import { discoveryFilterFormSchema } from '../schemas/discovery';

import type { TypeDiscoveryFilterFormSchema } from '../types/discovery';

const useDiscoveryScreen = () => {
	const {
		showLocationMessageError,
		setShowLocationMessageError,
		globalCityFilterValue,
		setGlobalCityFilterValue,
		locationMessageError,
	} = useAppStore(
		useShallow((state) => ({
			userStoredCity: state.user?.city,
			showLocationMessageError: state.showLocationMessageError,
			setShowLocationMessageError: state.setShowLocationMessageError,
			globalCityFilterValue: state.globalCityFilterValue,
			setGlobalCityFilterValue: state.setGlobalCityFilterValue,
			locationMessageError: state.locationMessageError,
		})),
	);

	const filterModalRef = useRef<BottomSheetModal>(null);
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [routes] = useState<Route[]>([
		{ key: 'all' },
		{ key: 'categories' },
		{ key: 'spot' },
		{ key: 'user' },
		{ key: 'spotList' },
	]);
	const [status, requestPermission] = Location.useForegroundPermissions();
	const [userRealTimeCity, setUserRealtimeCity] = useState<string | null>(null);
	const [userRealTimeCountry, setUserRealtimeCountry] = useState<string | null>(
		null,
	);
	const [userRealTimeLatitude, setUserRealtimeLatitude] = useState<
		string | null
	>(null);
	const [userRealTimeLongitude, setUserRealtimeLongitude] = useState<
		string | null
	>(null);

	const {
		control: controlDiscoveryFilter,
		setValue: setValueDiscoveryFilter,
		watch: watchDiscoveryFilter,
		reset: resetDiscoveryFilter,
	} = useForm<TypeDiscoveryFilterFormSchema>({
		defaultValues: {
			searchQuery: '',
			areas: [],
			tags: [],
		},
		resolver: zodResolver(discoveryFilterFormSchema),
	});

	const searchQueryValue = watchDiscoveryFilter('searchQuery');
	const debounceSearchQuery = useDebounce(searchQueryValue);
	const areasValue = watchDiscoveryFilter('areas');

	const {
		discoveryResults,
		isLoading: isLoadingSearch,
		refetch,
	} = usePostSearchDiscovery(globalCityFilterValue, {
		search_content: debounceSearchQuery,
	});

	useRefetchOnFocus(refetch);

	const onClearInput = () => {
		setValueDiscoveryFilter('searchQuery', '');
	};

	useEffect(() => {
		try {
			const getCity = async () => {
				const location = await Location.getCurrentPositionAsync({
					accuracy:
						Platform.OS === 'android'
							? Location.Accuracy.Low
							: Location.Accuracy.Lowest,
				});

				const { latitude, longitude } = location.coords;
				const address = await Location.reverseGeocodeAsync({
					latitude,
					longitude,
				});
				setUserRealtimeCity(address[0].city);
				setUserRealtimeCountry(address[0].country);
				setUserRealtimeLatitude(latitude.toString());
				setUserRealtimeLongitude(longitude.toString());
			};

			if (status?.status === 'granted') {
				getCity();
			}
		} catch (error) {
			console.error('Error while getting location - ', error);
			Sentry.captureException(error);
		}
	}, [status]);

	useEffect(() => {
		if (showLocationMessageError) {
			setTimeout(() => {
				setShowLocationMessageError(false);
			}, 4000);
		}
	}, [showLocationMessageError]);

	return {
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
		setGlobalCityFilterValue,
		searchQueryValue,
		discoveryResults,
		isLoadingSearch,
		onClearInput,
		setValueDiscoveryFilter,
		watchDiscoveryFilter,
		controlDiscoveryFilter,
		resetDiscoveryFilter,
		debounceSearchQuery,
		showLocationMessageError,
		locationMessageError,
		filterModalRef,
		isFilterModalOpen,
		setIsFilterModalOpen,
		areasValue,
	};
};

export default useDiscoveryScreen;
