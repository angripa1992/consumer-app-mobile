import { View } from 'react-native';
import { useRef } from 'react';

import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import SuggestSpotModal from '@/UI/organism/spot/modal/SuggestSpotModal';

import type {
	TypeDiscoveryCategoriesResults,
	TypeDiscoveryResults,
	TypeSpotFromDiscovery,
	TypeSpotListFromDiscovery,
} from '@/lib/types/discovery';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ALL_CITIES } from '@/lib/utils/constants';

interface DiscoveryResultInfoProps {
	currentCity: string;
	debounceSearchQuery: string;
	discoveryResults: TypeDiscoveryResults | undefined;
	discoverySpots: TypeSpotFromDiscovery[] | undefined;
	discoveryLists: TypeSpotListFromDiscovery[] | undefined;
	discoveryCategories: TypeDiscoveryCategoriesResults | undefined;
	discoverySpotsMessage: string | undefined;
	isLoadingDiscoverySpots: boolean;
	isAnySpotNearby?: boolean;
	tabIndex: number;
}

const DiscoveryResultInfo = ({
	tabIndex,
	currentCity,
	debounceSearchQuery,
	discoverySpots,
	discoveryResults,
	discoveryCategories,
	discoveryLists,
	isAnySpotNearby,
	isLoadingDiscoverySpots,
	discoverySpotsMessage,
}: DiscoveryResultInfoProps) => {
	const suggestSpotModalRef = useRef<BottomSheetModal>(null);

	const popularListsLength = discoveryResults?.popular_lists?.length ?? 0;
	const popularSpotsLength = discoveryResults?.popular_spots?.length ?? 0;
	const popularUsersLength = discoveryResults?.popular_people?.length ?? 0;
	const searchSpotsLength = discoverySpots?.length ?? 0;

	const resultsCount = () => {
		if (tabIndex === 0) {
			return (
				popularListsLength +
				popularSpotsLength +
				popularUsersLength +
				searchSpotsLength
			);
		}
		if (tabIndex === 1) {
			const categoriesLength = Object.entries(discoveryCategories ?? {})
				.map(([key, value]) => value.length)
				.reduce((a, b) => a + b, 0);

			return categoriesLength;
		}
		if (tabIndex === 2) {
			const spotsLength = discoverySpots?.length ?? 0;
			return spotsLength;
		}
		if (tabIndex === 4) {
			const listsLength = discoveryLists?.length ?? 0;
			return listsLength;
		}
	};

	const isQuerySearchValid = debounceSearchQuery.length > 0;

	const isSearchDone = isQuerySearchValid;

	const resultsCountTotal = resultsCount();

	const resultsTextWithoutQuerySearch = i18nInstance.t(
		'resultsTextWithoutSearch',
		{ count: resultsCountTotal, city: currentCity },
	);
	const resultsTextWithCityAndQuerySearch = i18nInstance.t(
		'resultsTextWithCityAndSearch',
		{
			count: resultsCountTotal,
			search: debounceSearchQuery,
			city: currentCity,
		},
	);

	const renderResultText = () => {
		if (isQuerySearchValid) {
			return resultsTextWithCityAndQuerySearch;
		}

		if (!isQuerySearchValid) {
			return resultsTextWithoutQuerySearch;
		}
	};

	const renderCreateFullSpotFormButton = () => {
		if (tabIndex === 0) return;

		if (tabIndex === 2 && searchSpotsLength === 0 && !isLoadingDiscoverySpots) {
			return (
				<View className='mb-7 justify-center items-center'>
					<TextElement textStyles='text-admin-tag-gray text-base  mb-5'>
						{i18nInstance.t('ensureSpelling')}
					</TextElement>
					<ButtonPrimary
						onPress={() => {
							suggestSpotModalRef.current?.present();
						}}
						buttonStyles='w-full'
						textStyles='text-sm'
						testID='discovery-no-results-add-spot-button'
						designVariation='white-transparent'
					>
						{i18nInstance.t('suggestSpot')}
					</ButtonPrimary>
					{discoverySpotsMessage && currentCity === ALL_CITIES && (
						<TextElement textStyles='text-white  mt-5'>
							{discoverySpotsMessage}
						</TextElement>
					)}
				</View>
			);
		}
	};

	return (
		<>
			<SuggestSpotModal
				suggestSpotModalRef={suggestSpotModalRef}
				city={currentCity}
			/>
			{(isSearchDone || resultsCountTotal === 0) && tabIndex !== 3 && (
				<TextElement
					textStyles='text-base mb-5 text-[#F0E7FE]'
					testID='discovery-search-result-text'
				>
					{renderResultText()}...
				</TextElement>
			)}
			{isSearchDone ||
				(resultsCountTotal === 0 && (
					<>
						{tabIndex !== 2 && (
							<View testID='discovery-no-results'>
								<TextElement textStyles='text-gray text-sm my-5'>
									{i18nInstance.t('suggestions')}
								</TextElement>
								<View className='pl-2'>
									<TextElement textStyles='text-gray text-sm mb-3'>
										{`\u2022`}{' '}
										{i18nInstance.t('makeSureAllWordsAreSpelledCorrectly')}
									</TextElement>
									<TextElement textStyles='text-gray text-sm mb-3'>
										{`\u2022`} {i18nInstance.t('tryDifferentKeywords')}
									</TextElement>
									<TextElement textStyles='text-gray text-sm mb-3'>
										{`\u2022`} {i18nInstance.t('tryMoreGeneralKeywords')}
									</TextElement>
								</View>
								{isAnySpotNearby && (
									<TextElement textStyles='text-gray text-sm my-5'>
										{i18nInstance.t('youMayAlsoLike')}
									</TextElement>
								)}
							</View>
						)}
						{renderCreateFullSpotFormButton()}
					</>
				))}
		</>
	);
};

export default DiscoveryResultInfo;
