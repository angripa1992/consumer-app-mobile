import {
	RefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useGetTags } from '@/lib/hooks/useQueryTags';
import { i18nInstance } from 'config/i18n';

import DiscoveryTabs from './DiscoveryTabs';
import ArrowIcon from '@/UI/assets/svg/Arrow';
import TextElement from '@/UI/atoms/text/TextElement';
import MultiSelectForm from '@/UI/atoms/select/MultiSelectForm';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';

import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { TypeDiscoveryFilterFormSchema } from '@/lib/types/discovery';
import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';
import {
	useGetAllActiveCities,
	useGetAllAreasByCity,
} from '@/lib/hooks/useQueryCities';

interface TypeDiscoveryFilterModal {
	controlDiscoveryFilter: Control<TypeDiscoveryFilterFormSchema>;
	watchDiscoveryFilter: UseFormWatch<TypeDiscoveryFilterFormSchema>;
	setValueDiscoveryFilter: UseFormSetValue<TypeDiscoveryFilterFormSchema>;
	filterModalRef: RefObject<BottomSheetModal>;
	tabIndex: number;
	setTabIndex: (index: number) => void;
	isFilterModalOpen: boolean;
	setIsFilterModalOpen: (value: boolean) => void;
}

const DiscoveryFilterModal = ({
	watchDiscoveryFilter,
	controlDiscoveryFilter,
	setValueDiscoveryFilter,
	filterModalRef,
	tabIndex,
	setTabIndex,
	isFilterModalOpen,
	setIsFilterModalOpen,
}: TypeDiscoveryFilterModal) => {
	const { globalCityFilterValue } = useAppStore(
		useShallow((state) => ({
			globalCityFilterValue: state.globalCityFilterValue,
		})),
	);

	const snapPoints = ['70%'];
	const [showTags, setShowTags] = useState(false);
	const [showAreas, setShowAreas] = useState(false);
	const flatListRef = useRef<FlatList>(null);

	const { tags } = useGetTags();
	const { allActiveCities } = useGetAllActiveCities();

	const currentCityValues = useMemo(() => {
		const currentCity = allActiveCities?.find(
			(city) => city.name === globalCityFilterValue,
		);

		if (!currentCity) return;

		return {
			city_name: currentCity?.name,
			city_id: currentCity?.id,
		};
	}, [allActiveCities, globalCityFilterValue]);
	const { allAreasByCity } = useGetAllAreasByCity(currentCityValues);

	const areasToShow = useMemo(() => {
		return allAreasByCity.map((area) => ({
			label: area.name,
			value: area.name,
			color: '#fff',
		}));
	}, [allAreasByCity]);

	const tagsToShow =
		tags?.map((tag) => ({
			label: tag.name,
			value: tag.name,
			color: '#fff',
		})) || [];

	const tagsSelected = watchDiscoveryFilter('tags');
	const tagsSelectedLength = tagsSelected.length;

	const areasSelected = watchDiscoveryFilter('areas');
	const areasSelectedLength = areasSelected.length;

	const buttonStylesBackground =
		areasSelectedLength > 0 ? 'white' : 'white-transparent';
	const buttonStylesText =
		areasSelectedLength > 0 ? 'text-black' : 'text-white';
	const arrowColor = areasSelectedLength > 0 ? '#000' : '#fff';

	const onPressTags = () => {
		setShowTags((prev) => !prev);
	};

	const onPressAreas = () => {
		setShowAreas((prev) => !prev);
	};

	const onClearTags = () => {
		setValueDiscoveryFilter('tags', []);
	};

	const onClearAreas = () => {
		setValueDiscoveryFilter('areas', []);
	};

	const scrollToItem = useCallback(
		(index: number) => {
			flatListRef.current?.scrollToIndex({ index, animated: true });
		},
		[flatListRef],
	);

	useEffect(() => {
		if (!isFilterModalOpen) return;

		const timeout = setTimeout(() => {
			scrollToItem(tabIndex);
		}, 800);

		return () => {
			clearTimeout(timeout);
		};
	}, [isFilterModalOpen]);

	useEffect(() => {
		setValueDiscoveryFilter('areas', []);
	}, [globalCityFilterValue]);

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={filterModalRef}
			snapPoints={snapPoints}
			onDismiss={() => setIsFilterModalOpen(false)}
		>
			<View className='mt-5'>
				<TextElement
					className='text-white mb-5 text-lg text-center'
					fontFamily='pachang'
				>
					{i18nInstance.t('searchIt')}
				</TextElement>
				<View className='flex-row items-center gap-x-3'>
					{/* <ButtonPrimary
						buttonStyles='rounded-lg '
						nodeContentStyles='flex-row items-center'
						isReactNodeContent
						onPress={onPressTags}
					>
						<TextElement>
							{i18nInstance.t('tags')}{' '}
							{tagsSelectedLength > 0 && tagsSelectedLength}
						</TextElement>
						<View className={`ml-2 ${showTags ? '' : 'rotate-90'}`}>
							<ArrowIcon color='#000' />
						</View>
					</ButtonPrimary> */}
					<ButtonPrimary
						buttonStyles={`rounded-lg `}
						nodeContentStyles={`flex-row items-center`}
						isReactNodeContent
						onPress={onPressAreas}
						designVariation={buttonStylesBackground}
					>
						<TextElement className={buttonStylesText}>
							{i18nInstance.t('areas')}{' '}
							{areasSelectedLength > 0 && areasSelectedLength}
						</TextElement>
						<View className={`ml-2 ${showAreas ? '' : 'rotate-90'}`}>
							<ArrowIcon color={arrowColor} />
						</View>
					</ButtonPrimary>
				</View>
				<DiscoveryTabs
					scrollToItem={scrollToItem}
					flatListRef={flatListRef}
					index={tabIndex}
					setIndex={setTabIndex}
				/>
				{/* {showTags && (
					<>
						<View className='flex-row items-center justify-between'>
							<TextElement
								className='text-white text-lg my-3'
								fontFamily='pachang'
							>
								{i18nInstance.t('tags')}
							</TextElement>
							{tagsSelectedLength > 0 && (
								<TouchableOpacity onPress={onClearTags}>
									<TextElement className='text-white te my-3'>
										{i18nInstance.t('clearTags')}
									</TextElement>
								</TouchableOpacity>
							)}
						</View>
						<MultiSelectForm
							options={tagsToShow}
							control={controlDiscoveryFilter}
							name={'tags'}
							containerOptionsStyles='flex-wrap justify-start'
							containerColumnGap={8}
							optionsTextStyles='text-base text-center '
							optionsStyles='px-3 border-[1.5px]'
						/>
					</>
				)} */}
				{showAreas && (
					<>
						<View className='flex-row items-center justify-between'>
							<TextElement
								className='text-white text-lg my-3'
								fontFamily='pachang'
							>
								{i18nInstance.t('areas')}
							</TextElement>
							{areasSelectedLength > 0 && (
								<TouchableOpacity onPress={onClearAreas}>
									<TextElement className='text-white te my-3'>
										{i18nInstance.t('clearTags')}
									</TextElement>
								</TouchableOpacity>
							)}
						</View>
						{areasToShow.length > 0 && (
							<MultiSelectForm
								options={areasToShow}
								control={controlDiscoveryFilter}
								name={'areas'}
								containerOptionsStyles='flex-wrap justify-start'
								containerColumnGap={8}
								optionsTextStyles='text-base text-center '
								optionsStyles='px-3 border-[1.5px] border-white/50'
								optionsActiveTextStyles='text-black'
								optionsDefaultColor='#FFFFFF00'
								optionsBackgroundOpacity=''
								singleSelect
							/>
						)}
						{areasToShow.length === 0 && (
							<TextElement className='text-white'>
								Change the city to another one
							</TextElement>
						)}
					</>
				)}
			</View>
		</CustomBottomSheetModal>
	);
};

export default DiscoveryFilterModal;
