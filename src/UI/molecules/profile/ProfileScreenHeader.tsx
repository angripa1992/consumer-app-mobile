import { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';
import { useGetUser } from '@/lib/hooks/useQueryUser';
import { usePostBlockUser, usePutUnblockUser } from '@/lib/hooks/useQueryBlock';

import Header from '@/UI/layouts/Header';
import BackIcon from '@/UI/assets/svg/BackIcon';
import EditDotsIcon from '@/UI/assets/svg/EditDotsIcon';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';
import ProfileEditModal from '@/UI/organism/profile/ProfileEditModal';
import ReportModal from '@/UI/organism/report/ReportModal';
import ProfileBlockConfirmationModal from '@/UI/organism/profile/ProfileBlockConfirmationModal';
import LogOutModal from '@/UI/organism/profile/modal/LogOutModal';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ProfileScreenHeaderProps {
	userId: number;
	hideBackButton?: boolean;
}

const ProfileScreenHeader = ({
	userId,
	hideBackButton,
}: ProfileScreenHeaderProps) => {
	const {
		showProfileLogoutModal,
		setShowProfileLogoutModal,
		setShowUnblockModal,
		showUnblockModal,
		appUserId,
	} = useAppStore(
		useShallow((state) => ({
			showProfileLogoutModal: state.showProfileLogoutModal,
			setShowProfileLogoutModal: state.setShowProfileLogoutModal,
			setShowUnblockModal: state.setShowUnblockModal,
			showUnblockModal: state.showUnblockModal,
			appUserId: state.user?.id,
		})),
	);

	const navigation = useNavigation<AppStackNavigationProp>();

	const currentUserId = appUserId;

	const { user } = useGetUser(userId);

	const { mutateAsync: fetchPostBlockUser, isLoading: isLoadingBlockUser } =
		usePostBlockUser(currentUserId);
	const { mutateAsync: fetchPutUnblockUser } = usePutUnblockUser(currentUserId);

	const reportModalRef = useRef<BottomSheetModal>(null);
	const profileEditModalRef = useRef<BottomSheetModal>(null);
	const profileBlockConfirmationModal = useRef<BottomSheetModal>(null);

	const isBlock = user?.is_blocked_user;
	const isAuthenticateUser = appUserId === userId;

	const handlePressReport = () => {
		reportModalRef.current?.present();
		profileEditModalRef.current?.close();
		setShowProfileLogoutModal(false);
	};

	const handleConfirmUnblockModal = () => {
		fetchPutUnblockUser({
			blocked_id: userId,
		}).finally(() => {
			setShowUnblockModal(false);
		});
	};

	const handleBlockUser = () => {
		fetchPostBlockUser({
			blocked_id: userId,
		}).finally(() => {
			profileBlockConfirmationModal.current?.close();
			profileEditModalRef.current?.close();
		});
	};

	const handlePressBlockInDotsModal = () => {
		profileEditModalRef.current?.close();

		if (isBlock) {
			setShowUnblockModal(true);
		} else {
			profileBlockConfirmationModal.current?.present();
		}
	};

	const goBack = () => {
		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}

		navigation.navigate('TabScreens');
	};

	return (
		<Header showDefaultHeader={false}>
			<View className=' w-full flex-row items-center justify-between relative'>
				{!hideBackButton ? (
					<TouchableOpacity
						activeOpacity={1}
						className='py-2'
						onPress={goBack}
						hitSlop={10}
					>
						<BackIcon />
					</TouchableOpacity>
				) : (
					<View></View>
				)}
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => {
						profileEditModalRef.current?.present();
					}}
					hitSlop={10}
					testID='profile-options'
				>
					<EditDotsIcon />
				</TouchableOpacity>
			</View>
			<ProfileEditModal
				name={user?.name}
				profileEditModalRef={profileEditModalRef}
				isAuthenticateUser={isAuthenticateUser}
				onPressReport={handlePressReport}
				onPressBlock={handlePressBlockInDotsModal}
				isBlock={isBlock}
			/>
			<ReportModal
				entityType='profile'
				reportModalRef={reportModalRef}
				reportedId={userId}
			/>
			<ConfirmModal
				showConfirmModal={showUnblockModal}
				setShowConfirmModal={setShowUnblockModal}
				questionText='Are you sure you want to unblock this profile?'
				confirmButtonText='Yes'
				cancelButtonText='No'
				onConfirm={handleConfirmUnblockModal}
			/>
			<ProfileBlockConfirmationModal
				name={user?.name}
				profileImageUrl={user?.profile_image_url}
				profileBlockConfirmationModal={profileBlockConfirmationModal}
				onPressBlock={handleBlockUser}
				isLoading={isLoadingBlockUser}
			/>
			{showProfileLogoutModal && <LogOutModal />}
		</Header>
	);
};

export default ProfileScreenHeader;
