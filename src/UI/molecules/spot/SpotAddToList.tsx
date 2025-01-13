import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '@/lib/store/store';
import { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import SpotSpotListThumbnail from './SpotSpotListThumbnail';
import { useGetUserLists } from '@/lib/hooks/useQueryUser';

import InfiniteScrollFlatList from '../infiniteScroll/InfiniteScrollFlatList';
import CustomBottomSheetModal from '@/UI/organism/modal/CustomBottonSheet';
import {
	BottomSheetFooter,
	BottomSheetFooterProps,
	BottomSheetModal,
} from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';

import type { TypeSpotCandidateToSave } from '@/lib/types/spot';

type SpotAddToList = {
	spotName: string;
	spotId: number | null;
	isCandidateSpot?: boolean;
	googlePlaceLocationId?: string | null;
	candidateSpotData?: TypeSpotCandidateToSave | null;
};

const SpotAddToList = ({
	spotName,
	spotId,
	isCandidateSpot,
	googlePlaceLocationId,
	candidateSpotData,
}: SpotAddToList) => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null);
	const { user: userStored } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const userId = userStored?.id;
	const {
		spotLists: userLists,
		isLoading: isLoadingUserLists,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = useGetUserLists(Number(userId), 'my_list');

	const navigation = useNavigation<AppStackNavigationProp>();

	const handlePresentModalPress = useCallback(() => {
		bottomSheetModalRef.current?.present();
	}, []);

	const handleCloseModalPress = useCallback(() => {
		bottomSheetModalRef.current?.close();
	}, []);

	const onPressCreateList = () => {
		handleCloseModalPress();

		if (spotId) {
			navigation.navigate('ListCreate', {
				spotType: 'db',
				prevSpotIdToAdd: spotId,
				spotName,
			});
			return;
		}

		if (candidateSpotData && !spotId) {
			navigation.navigate('ListCreate', {
				spotType: 'googlePlace',
				prevCandidateData: candidateSpotData,
				spotName,
			});
			return;
		}
	};

	const renderFooterComponent = (props: BottomSheetFooterProps) => {
		return (
			<BottomSheetFooter
				{...props}
				style={{
					paddingTop: 20,
					paddingBottom: 50,
					flexDirection: 'row',
					columnGap: 20,
				}}
			>
				<ButtonPrimary
					buttonStyles='flex-1 '
					designVariation='white-transparent'
					onPress={handleCloseModalPress}
				>
					{i18nInstance.t('back')}
				</ButtonPrimary>
				<ButtonPrimary
					buttonStyles='flex-1 '
					textStyles='text-dark-black'
					designVariation='green'
					onPress={onPressCreateList}
				>
					{i18nInstance.t('continue')}
				</ButtonPrimary>
			</BottomSheetFooter>
		);
	};

	return (
		<>
			<View className='py-3'>
				<ButtonPrimary
					onPress={handlePresentModalPress}
					textStyles=' text-button-black text-center'
					testID='add-to-list-button'
					designVariation='green'
				>
					{i18nInstance.t('addToList')}
				</ButtonPrimary>
				<CustomBottomSheetModal
					bottomSheetModalRef={bottomSheetModalRef}
					snapPoints={['70%']}
					footerComponent={renderFooterComponent}
				>
					<TextElement textStyles='text-light-white text-base mb-3 '>
						{i18nInstance.t('addThisSpotToList')}
					</TextElement>
					<InfiniteScrollFlatList
						className='mb-40'
						isBottomSheetFlatList
						isOneColumn
						fetchNextPage={fetchNextPage}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						isLoading={isLoadingUserLists}
						customEmptyComponent={
							<TextElement textStyles='text-gray w-full text-center mt-4'>
								{i18nInstance.t('noListYet')}
							</TextElement>
						}
						dataToRender={userLists}
						keyExtractor={(item, index) => {
							return item.id.toString() + index;
						}}
						renderItem={({ item }) => {
							return (
								<SpotSpotListThumbnail
									spotName={spotName}
									spotList={item}
									spotId={spotId}
									isCandidateSpot={isCandidateSpot}
									googlePlaceLocationId={googlePlaceLocationId}
									candidateSpotData={candidateSpotData}
								/>
							);
						}}
						columnWrapperStyle={undefined}
					/>
				</CustomBottomSheetModal>
			</View>
		</>
	);
};

export default SpotAddToList;
