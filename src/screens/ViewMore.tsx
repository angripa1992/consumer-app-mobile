import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useForm } from 'react-hook-form';

import { i18nInstance } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';

import LocationMarkerIcon from '@/UI/assets/svg/LocationMarkerIcon';
import TextElement from '@/UI/atoms/text/TextElement';
import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import MainLayout from '@/UI/layouts/MainLayout';
import ViewMoreForCategories from '@/UI/organism/viewMore/ViewMoreForCategories';
import ViewMoreForHome from '@/UI/organism/viewMore/ViewMoreForHome';
import ViewMoreForPopularLists from '@/UI/organism/viewMore/ViewMoreForPopularLists';
import ViewMoreForPopularPeople from '@/UI/organism/viewMore/ViewMoreForPopularPeople';
import ViewMoreForPopularSpots from '@/UI/organism/viewMore/ViewMoreForPopularSpots';
import ViewMoreForSearchSpots from '@/UI/organism/viewMore/ViewMoreForSearchSpots';
import ViewMoreForSpotsNearby from '@/UI/organism/viewMore/ViewMoreForSpotsNearby';
import ViewMoreForUserSpots from '@/UI/organism/viewMore/ViewMoreForUserSpots';
import LocationFilter from '@/UI/organism/filters/LocationFilter';

import type { ViewMoreRouteParams } from '@/lib/types/tabScreenParams';

const ViewMore = ({ route }: ViewMoreRouteParams) => {
	const { city, type, title } = route.params;

	const { globalCityFilterValue, setGlobalCityFilterValue } = useAppStore(
		useShallow((state) => ({
			globalCityFilterValue: state.globalCityFilterValue,
			setGlobalCityFilterValue: state.setGlobalCityFilterValue,
		})),
	);

	const { control, watch, setValue, reset } = useForm({
		defaultValues: {
			city: globalCityFilterValue,
		},
	});

	const renderContent = () => {
		if (type === 'home') {
			const { categoryName } = route.params;

			return <ViewMoreForHome city={city} categoryName={categoryName} />;
		}
		if (type === 'userSpots') {
			const { categoryName, userId } = route.params;
			return (
				<ViewMoreForUserSpots categoryName={categoryName} userId={userId} />
			);
		}
		if (type === 'popularLists') {
			const { querySearch } = route.params;
			return <ViewMoreForPopularLists city={city} querySearch={querySearch} />;
		}
		if (type === 'popularPeople') {
			const { querySearch } = route.params;
			return <ViewMoreForPopularPeople city={city} querySearch={querySearch} />;
		}
		if (type === 'popularSpots') {
			const { querySearch } = route.params;
			return <ViewMoreForPopularSpots city={city} querySearch={querySearch} />;
		}
		if (type === 'categories') {
			const { categoryName, querySearch } = route.params;
			return (
				<ViewMoreForCategories
					city={city}
					querySearch={querySearch}
					categoryName={categoryName}
				/>
			);
		}
		if (type === 'spotsNearby') {
			const { latitude, longitude } = route.params;
			return (
				<ViewMoreForSpotsNearby
					city={city}
					latitude={latitude}
					longitude={longitude}
				/>
			);
		}
		if (type === 'searchSpots') {
			const { querySearch, area } = route.params;

			return (
				<ViewMoreForSearchSpots
					city={city}
					querySearch={querySearch}
					area={area}
				/>
			);
		}
	};

	return (
		<>
			<HeaderGoBack testID='view-more-back' />
			<MainLayout isDismissKeyboardActive={false}>
				<View className='mb-2'>
					{type === 'userSpots' ? (
						<LocationFilter
							title={i18nInstance.t(title)}
							control={control}
							currentCity={globalCityFilterValue}
							setCurrentCity={setGlobalCityFilterValue}
							setValue={setValue}
							watch={watch}
							reset={reset}
						/>
					) : (
						<>
							<TextElement textStyles='text-2xl font-medium text-white'>
								{type === 'categories' ? title : i18nInstance.t(title)}
							</TextElement>
							<View className='flex flex-row items-center mt-1 '>
								<LocationMarkerIcon />
								<TextElement textStyles='text-white ml-1 mr-2 text-sm'>
									{city}
									{type === 'searchSpots' &&
										(!!route.params.area ? `, ${route.params.area}` : '')}
								</TextElement>
							</View>
						</>
					)}
				</View>
				{renderContent()}
			</MainLayout>
		</>
	);
};

export default ViewMore;
