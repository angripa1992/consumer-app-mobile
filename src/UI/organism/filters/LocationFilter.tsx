import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';

import { locationSearchQuerySchema } from '@/lib/schemas/discovery';
import { useGetAllActiveCities } from '@/lib/hooks/useQueryCities';
import { ALL_CITIES } from '@/lib/utils/constants';
import { i18nInstance } from 'config/i18n';
import { useDebounce } from '@/lib/hooks/useDebounce';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import DownArrowIcon from '@/svg/DownArrowIcon';
import LocationMarkerIcon from '@/svg/LocationMarkerIcon';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import CheckIcon from '@/UI/assets/svg/CheckIcon';
import SearchInput from '@/UI/molecules/input/SearchInput';

import {
	useForm,
	type Control,
	type UseFormReset,
	type UseFormSetValue,
	type UseFormWatch,
} from 'react-hook-form';
import type {
	TypeLocationFilter,
	TypeLocationSearchQuery,
} from '@/lib/types/listFilter';
import type {
	BottomSheetFlatListMethods,
	BottomSheetModal,
} from '@gorhom/bottom-sheet';

export type LocationFilterProps = {
	title?: string;
	placeholder?: string;
	disabled?: boolean;
	customStyles?: string;
	testID?: string;
	currentCity: string;
	setCurrentCity: (value: string) => void;
	setValue: UseFormSetValue<TypeLocationFilter>;
	watch: UseFormWatch<TypeLocationFilter>;
	control: Control<TypeLocationFilter, any>;
	reset: UseFormReset<TypeLocationFilter>;
	designVariation?: 'dropdown' | 'header';
	disabledGlobal?: boolean;
};

const heightOfItem = 40;

const LocationFilter = ({
	title,
	setValue,
	currentCity,
	setCurrentCity,
	watch,
	disabled,
	customStyles,
	testID,
	designVariation = 'header',
	disabledGlobal = false,
}: LocationFilterProps) => {
	const { allActiveCities } = useGetAllActiveCities();

	const flatListRef = useRef<BottomSheetFlatListMethods>(null);
	const modalRef = useRef<BottomSheetModal>(null);

	const cityValue = watch('city');
	const [isModalOpen, setIsModalOpen] = useState(false);

	const {
		control: controlSearchQuery,
		watch: watchSearchQuery,
		reset: resetSearchQuery,
	} = useForm<TypeLocationSearchQuery>({
		defaultValues: {
			searchQuery: '',
		},
		resolver: zodResolver(locationSearchQuerySchema),
	});

	const searchQueryValue = watchSearchQuery('searchQuery');
	const debounceSearchQuery = useDebounce(searchQueryValue, 500);

	const cityNames = useMemo(() => {
		let citiesNamesToFilter =
			allActiveCities?.map((singleCity) => singleCity.name) ?? [];

		if (!disabledGlobal) {
			citiesNamesToFilter = [ALL_CITIES, ...citiesNamesToFilter];
		}

		return citiesNamesToFilter?.filter((singleCity) =>
			singleCity.toLowerCase().includes(debounceSearchQuery.toLowerCase()),
		);
	}, [allActiveCities, debounceSearchQuery]);

	const onSelectCity = useCallback(
		(citySelected: string) => {
			setCurrentCity(citySelected);
			modalRef.current?.dismiss();
		},
		[setCurrentCity],
	);

	const scrollToItem = useCallback(
		(index: number) => {
			flatListRef.current?.scrollToIndex({ index, animated: true });
		},
		[flatListRef],
	);

	const onClickLocationPicker = useCallback(() => {
		modalRef.current?.present();
		setIsModalOpen(true);
	}, [currentCity]);

	const currentCityText =
		currentCity && currentCity[0].toUpperCase() + currentCity.slice(1);

	const renderCityItem = useCallback(
		({ item }: { item: string }) => {
			return (
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={() => {
						onSelectCity(item);
					}}
					style={{ height: heightOfItem }}
					className='justify-between items-center flex-row'
				>
					<TextElement textStyles='text-white'>
						{item && item[0].toUpperCase() + item.slice(1)}
					</TextElement>
					{currentCity === item && <CheckIcon />}
				</TouchableOpacity>
			);
		},
		[currentCity],
	);

	const buttonStyles = () => {
		if (designVariation === 'dropdown') {
			return 'border-[#3B3B3B] rounded-md bg-dark-gray';
		}
		if (designVariation === 'header') {
			return 'border-transparent px-0 mr-auto';
		}
	};

	const buttonNodeContentStyles = () => {
		if (designVariation === 'dropdown') {
			return 'justify-between items-center';
		}
		if (designVariation === 'header') {
			return 'items-center justify-center';
		}
	};

	useEffect(() => {
		setValue('city', currentCity);
	}, [currentCity]);

	useEffect(() => {
		if (!cityValue && designVariation === 'header') {
			onSelectCity(ALL_CITIES);
		}
	}, [cityValue]);

	useEffect(() => {
		if (!isModalOpen) return;

		const timeout = setTimeout(() => {
			const index = cityNames.indexOf(currentCity);

			if (index !== -1) {
				scrollToItem(index);
			}
		}, 800);

		return () => {
			clearTimeout(timeout);
		};
	}, [isModalOpen]);

	useEffect(() => {
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
	}, [debounceSearchQuery]);

	return (
		<View className={`mb-2 relative ${customStyles ?? ''}`}>
			{!!title && (
				<TextElement textStyles='text-2xl font-medium text-white'>
					{title}
				</TextElement>
			)}
			<ButtonPrimary
				designVariation='white-transparent'
				buttonStyles={`mt-1 ${buttonStyles()}`}
				nodeContentStyles={`flex flex-row ${buttonNodeContentStyles()}`}
				isReactNodeContent
				onPress={disabled ? undefined : onClickLocationPicker}
				testID={testID}
			>
				{designVariation === 'header' && (
					<View className='mr-1'>
						<LocationMarkerIcon />
					</View>
				)}
				<TextElement
					textStyles='text-white mr-2 text-sm'
					fontFamily={designVariation === 'header' ? 'pachang' : 'inter'}
				>
					{designVariation === 'header' && currentCityText}

					{designVariation === 'dropdown' &&
						(currentCityText || i18nInstance.t('selectCity'))}
				</TextElement>
				{!disabled && <DownArrowIcon rotate={isModalOpen} />}
			</ButtonPrimary>
			<CustomBottomSheetModal
				snapPoints={['80%']}
				bottomSheetModalRef={modalRef}
				onDismiss={() => {
					setIsModalOpen(false);
					resetSearchQuery();
				}}
			>
				<TextElement textStyles='text-white text-xl my-5'>
					{i18nInstance.t('selectCity')}
				</TextElement>

				<SearchInput
					searchQueryValue={searchQueryValue}
					control={controlSearchQuery}
					name={'searchQuery'}
					clearInput={() => resetSearchQuery()}
					showCustomError={false}
					placeholder={'search'}
					testID='location-filter-search-input'
				/>
				<View className='mb-16 mt-5 flex-1'>
					<BottomSheetFlatList
						className='flex-1'
						ref={flatListRef}
						data={cityNames}
						renderItem={renderCityItem}
						keyExtractor={(item) => item}
						getItemLayout={(data, index) => ({
							length: heightOfItem,
							offset: heightOfItem * index,
							index,
						})}
						ListEmptyComponent={
							<TextElement textStyles='text-white'>
								{i18nInstance.t('noCitiesFound')}
							</TextElement>
						}
					/>
				</View>
			</CustomBottomSheetModal>
		</View>
	);
};

export default LocationFilter;
