import { useShallow } from 'zustand/react/shallow';
import Constants from 'expo-constants';
import { signOut } from 'firebase/auth';

import { useAppStore } from '@/lib/store/store';
import { i18nInstance } from 'config/i18n';
import { auth } from 'config/firebase';

import ConfirmModal from '../../modal/ConfirmModal';
import { useDeleteNotificationToken } from '@/lib/hooks/useQueryNotifications';
import { getExpoPushTokenAsync } from 'expo-notifications';

const LogOutModal = () => {
	const { mutateAsync: deleteNotificationToken } = useDeleteNotificationToken();
	const {
		showProfileLogoutModal,
		setShowProfileLogoutModal,
		setUser,
		setUserAuth,
	} = useAppStore(
		useShallow((state) => ({
			showProfileLogoutModal: state.showProfileLogoutModal,
			setShowProfileLogoutModal: state.setShowProfileLogoutModal,
			setUserAuth: state.setUserAuth,
			setUser: state.setUser,
			setShowUnblockModal: state.setShowUnblockModal,
			showUnblockModal: state.showUnblockModal,
			user: state.user,
		})),
	);

	const onLogout = async () => {
		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ??
			Constants?.easConfig?.projectId;
		if (!projectId) {
			throw new Error('Project ID not found');
		}

		const expoToken = await getExpoPushTokenAsync({
			projectId,
		});

		await deleteNotificationToken(expoToken.data);

		await signOut(auth).catch((error) => {
			console.error('Error during clear session', error);
		});
		setUser(null);
		setUserAuth(null);
		setShowProfileLogoutModal(false);
	};

	return (
		<ConfirmModal
			showConfirmModal={showProfileLogoutModal}
			setShowConfirmModal={setShowProfileLogoutModal}
			questionText={i18nInstance.t('areYouSureYouWantToLogout')}
			confirmButtonText={i18nInstance.t('logout')}
			cancelButtonText={i18nInstance.t('cancel')}
			onConfirm={onLogout}
		/>
	);
};

export default LogOutModal;
