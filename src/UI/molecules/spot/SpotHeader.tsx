import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { useAppStore } from '@/lib/store/store';

import BackIcon from '@/UI/assets/svg/BackIcon';
import EditDotsIcon from '@/UI/assets/svg/EditDotsIcon';
import Header from '@/UI/layouts/Header';
import ReportModal from '@/UI/organism/report/ReportModal';
import SpotSingleViewModal from '@/UI/organism/spot/SpotSingleViewEditModal';
import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';

interface SpotHeaderProps {
	spotId?: number | null;
	spotName?: string;
}

const SpotHeader = ({ spotId, spotName }: SpotHeaderProps) => {
	const { isErrorScreen } = useAppStore(
		useShallow((state) => ({
			isErrorScreen: state.isErrorScreen,
		})),
	);
	const navigation = useNavigation<AppStackNavigationProp>();
	const spotSingleViewModalRef = useRef<BottomSheetModal>(null);
	const reportModalRef = useRef<BottomSheetModal>(null);
	const hasSpotId = !!spotId;

	const onBackPress = () => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}

		navigation.navigate('TabScreens');
	};

	const handlePressSpotOptions = () => {
		spotSingleViewModalRef.current?.present();
	};

	const onPressReport = () => {
		reportModalRef.current?.present();
	};

	if (isErrorScreen) return null;

	return (
		<Header showDefaultHeader={false} headerStyles=''>
			<View className='w-full flex-row items-center justify-between py-2 relative'>
				<TouchableOpacity
					activeOpacity={1}
					className='py-2'
					onPress={onBackPress}
					hitSlop={10}
				>
					<BackIcon />
				</TouchableOpacity>
				{hasSpotId && (
					<>
						<TouchableOpacity
							activeOpacity={1}
							onPress={handlePressSpotOptions}
							hitSlop={10}
							testID='edit-list-button'
						>
							<EditDotsIcon />
						</TouchableOpacity>
						{spotName && (
							<SpotSingleViewModal
								spotSingleViewModalRef={spotSingleViewModalRef}
								spotName={spotName}
								onPressReport={onPressReport}
							/>
						)}
						<ReportModal
							entityType='spot'
							reportModalRef={reportModalRef}
							reportedId={spotId}
						/>
					</>
				)}
			</View>
		</Header>
	);
};

export default SpotHeader;
