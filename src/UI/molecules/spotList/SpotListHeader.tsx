import { useRef } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';

import {
	useDeleteSpotList,
	useGetSpotList,
} from '@/lib/hooks/useQuerySpotList';
import { useAppStore } from '@/lib/store/store';
import { i18nInstance } from 'config/i18n';

import Header from '@/UI/layouts/Header';
import SpotListNotOwnModal from '@/UI/organism/spotList/SpotListNotOwnModal';
import SpotListEditModal from '@/UI/organism/spotList/SpotListEditModal';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';
import EditDotsIcon from '@/UI/assets/svg/EditDotsIcon';
import BackIcon from '@/UI/assets/svg/BackIcon';
import ReportModal from '@/UI/organism/report/ReportModal';

import type {
	AppStackNavigationProp,
	SingleListScreenRouteParams,
} from '@/lib/types/tabScreenParams';

const SpotListHeader = ({ route }: SingleListScreenRouteParams) => {
	const {
		user,
		isReorderingSpotListActive,
		showDeleteSpotListModal,
		setShowDeleteSpotListModal,
		setIsReorderingSpotListActive,
	} = useAppStore(
		useShallow((state) => ({
			user: state.user,
			isReorderingSpotListActive: state.isReorderingSpotListActive,
			showDeleteSpotListModal: state.showDeleteSpotListModal,
			setShowDeleteSpotListModal: state.setShowDeleteSpotListModal,
			setIsReorderingSpotListActive: state.setIsReorderingSpotListActive,
		})),
	);
	const { spotListId } = route.params;
	const toast = useToast();
	const navigation = useNavigation<AppStackNavigationProp>();

	const { spotList, isLoading: isLoadingSpotList } = useGetSpotList(
		spotListId ?? undefined,
	);
	const deleteSpotList = useDeleteSpotList(spotListId ?? undefined);

	const isSpotListOwner = !isLoadingSpotList && spotList?.user_id === user?.id;
	const reportModalRef = useRef<BottomSheetModal>(null);
	const spotListNotOwnModalRef = useRef<BottomSheetModal>(null);
	const spotListEditModalRef = useRef<BottomSheetModal>(null);

	const onGoBack = () => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}

		navigation.navigate('TabScreens');
	};

	const onBackPress = () => {
		setIsReorderingSpotListActive(false);
		onGoBack();
	};

	const onClickDeleteList = () => {
		spotListEditModalRef.current?.close();
		setShowDeleteSpotListModal(false);

		onGoBack();
		deleteSpotList.mutateAsync().then(() => {
			toast.show(i18nInstance.t('spotListDeletedSuccessfully'), {
				type: 'success',
			});
		});
	};

	const handlePressSpotListOptions = () => {
		if (isSpotListOwner) {
			spotListEditModalRef.current?.present();
		} else {
			spotListNotOwnModalRef.current?.present();
		}
	};

	const handlePressReport = () => {
		spotListNotOwnModalRef.current?.close();
		spotListNotOwnModalRef.current?.close();
		reportModalRef.current?.present();
	};

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
				{!isReorderingSpotListActive && (
					<TouchableOpacity
						activeOpacity={1}
						onPress={handlePressSpotListOptions}
						hitSlop={10}
						testID='edit-list-button'
					>
						<EditDotsIcon />
					</TouchableOpacity>
				)}
				<ReportModal
					entityType='list'
					reportModalRef={reportModalRef}
					reportedId={spotListId}
				/>
				<SpotListNotOwnModal
					spotListName={spotList?.name ?? ''}
					spotListNotOwnModalRef={spotListNotOwnModalRef}
					onPressReport={handlePressReport}
				/>
				<SpotListEditModal
					spotListEditModalRef={spotListEditModalRef}
					setShowDeleteSpotListModal={setShowDeleteSpotListModal}
					spotList={spotList}
				/>
				{showDeleteSpotListModal && (
					<ConfirmModal
						showConfirmModal={showDeleteSpotListModal}
						setShowConfirmModal={setShowDeleteSpotListModal}
						questionText={i18nInstance.t('areYouSureYouWantToDeleteThisList')}
						confirmButtonText={i18nInstance.t('yes')}
						cancelButtonText={i18nInstance.t('no')}
						onConfirm={onClickDeleteList}
					/>
				)}
			</View>
		</Header>
	);
};
export default SpotListHeader;
