import { Platform } from 'react-native';
import { useCallback, useState } from 'react';
import * as Linking from 'expo-linking';

import { APP_STORE_LINK, GOOGLE_PLAY_STORE_LINK } from '@/lib/utils/constants';

import ConfirmModal from '@/UI/organism/modal/ConfirmModal';
import { i18nInstance } from 'config/i18n';
import { useGetAppVersion } from '@/lib/hooks/useQueryUser';

const ForceUpdateCheckerModal = () => {
	const { appVersion } = useGetAppVersion();

	if (appVersion !== 'outdated') return null;

	const [showModal, setShowModal] = useState(true);
	const handleRedirectToStore = useCallback(async () => {
		await Linking.openURL(
			Platform.OS === 'ios' ? APP_STORE_LINK : GOOGLE_PLAY_STORE_LINK,
		);
	}, [APP_STORE_LINK, GOOGLE_PLAY_STORE_LINK]);

	const questionText = i18nInstance.t('updateText');
	const confirmButtonText = i18nInstance.t('updateNow');
	const cancelButtonText = i18nInstance.t('cancel');

	return (
		<ConfirmModal
			showConfirmModal={showModal}
			setShowConfirmModal={setShowModal}
			questionText={questionText}
			confirmButtonText={confirmButtonText}
			onConfirm={handleRedirectToStore}
			cancelButtonText={cancelButtonText}
			isShowCancelButton={false}
		/>
	);
};

export default ForceUpdateCheckerModal;
