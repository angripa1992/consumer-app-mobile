import { Text, View, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';

import { useDebounce } from '@/lib/hooks/useDebounce';
import { useAppStore } from '@/lib/store/store';
import { locationFilterValidationSchema } from '@/lib/schemas/discovery';

import MainLayout from '@/UI/layouts/MainLayout';
import SearchInput from '@/UI/molecules/input/SearchInput';
import LocationFilter from '@/UI/organism/filters/LocationFilter';
import Header from '@/UI/layouts/Header';
import BackIcon from '@/UI/assets/svg/BackIcon';

import {
	AppStackNavigationProp,
	type SearchSpotScreenRouteParams,
} from '@/lib/types/tabScreenParams';
import SearchResults from '@/UI/molecules/search/SearchResults';

const SearchSpotScreen = ({ route }: SearchSpotScreenRouteParams) => {
	const { spotListId } = route.params;

	const navigation = useNavigation<AppStackNavigationProp>();

	const { userStoredCity, globalCityFilterValue, setGlobalCityFilterValue } =
		useAppStore(
			useShallow((state) => ({
				userStoredCity: state.user?.city,
				globalCityFilterValue: state.globalCityFilterValue,
				setGlobalCityFilterValue: state.setGlobalCityFilterValue,
			})),
		);

	const { control, setValue, watch, reset } = useForm({
		defaultValues: {
			city: userStoredCity ?? '',
		},
		resolver: zodResolver(locationFilterValidationSchema),
	});

	const {
		watch: watchSearchQuery,
		reset: resetSearchQuery,
		control: controlSearchQuery,
	} = useForm({
		defaultValues: {
			searchQuery: '',
		},
	});

	const spotSearchValue = watchSearchQuery('searchQuery');
	const debounceSpotSearchQuery = useDebounce(spotSearchValue);
	const isSearchDone = debounceSpotSearchQuery.length > 0;

	const handleRedirect = () => {
		navigation.goBack();
	};

	const onClearInput = () => {
		resetSearchQuery();
	};

	return (
		<>
			<Header headerStyles=' items-center' showDefaultHeader={false}>
				<TouchableOpacity
					activeOpacity={1}
					onPress={handleRedirect}
					className=' justify-center py-2'
					hitSlop={10}
				>
					<BackIcon />
				</TouchableOpacity>
				<LocationFilter
					customStyles='mb-0 flex-1 ml-5'
					control={control}
					currentCity={globalCityFilterValue}
					setCurrentCity={setGlobalCityFilterValue}
					setValue={setValue}
					watch={watch}
					reset={reset}
					testID='location-filter'
				/>
			</Header>
			<MainLayout subContainerStyles='pt-4'>
				<SearchInput
					searchQueryValue={spotSearchValue}
					control={controlSearchQuery}
					name={'searchQuery'}
					clearInput={onClearInput}
					placeholder={'addingSpot'}
					testID='search-spot-input'
				/>
				<View
					className={
						'py-2 w-[110px] mt-5 mb-4 bg-middle-gray border border-middle-gray rounded-full'
					}
				>
					<Text className={`text-white text-center text-xs `}>
						{i18nInstance.t('spots')}
					</Text>
				</View>
				<SearchResults
					currentCity={globalCityFilterValue}
					debounceSpotSearchQuery={debounceSpotSearchQuery}
					spotListId={spotListId}
					isSearchDone={isSearchDone}
				/>
			</MainLayout>
		</>
	);
};

export default SearchSpotScreen;
