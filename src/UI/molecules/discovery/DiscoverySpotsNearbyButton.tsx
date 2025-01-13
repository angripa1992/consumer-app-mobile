import MapIcon from '@/UI/assets/svg/MapIcon';
import SpotLocationIcon from '@/UI/assets/svg/SpotLocationIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';
import { useAppStore } from '@/lib/store/store';
import * as Location from 'expo-location';
import { useState } from 'react';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import * as Sentry from '@sentry/react-native';
import { i18nInstance } from 'config/i18n';

interface DiscoverySpotsNearbyButtonProps {
	status: Location.LocationPermissionResponse | null;
	requestPermission: () => Promise<Location.LocationPermissionResponse>;
	showButton: boolean;
}

const DiscoverySpotsNearbyButton = ({
	status,
	requestPermission,
	showButton,
}: DiscoverySpotsNearbyButtonProps) => {
	const { setShowLocationMessageError, setLocationMessageError } = useAppStore(
		useShallow((state) => ({
			setShowLocationMessageError: state.setShowLocationMessageError,
			setLocationMessageError: state.setLocationMessageError,
		})),
	);
	const [showGetLocationModal, setShowGetLocationModal] = useState(false);

	const onPressSpotsNearby = () => {
		setShowGetLocationModal(true);
	};

	const handleGetLocation = async () => {
		try {
			const { status } = await requestPermission();
			if (status === 'granted') {
				setShowGetLocationModal(false);
			} else {
				setShowGetLocationModal(false);
				setShowLocationMessageError(true);
				setLocationMessageError(i18nInstance.t('youHaveDeniedLocationAccess'));
			}
		} catch (e) {
			console.error(e);
			Sentry.captureException(e);
		}
	};

	const onCancel = () => {
		setShowGetLocationModal(false);
		setShowLocationMessageError(true);
		setLocationMessageError(
			i18nInstance.t('youMustAllowLocationAccessToDiscoverSpotsNearby'),
		);
	};

	if (status?.status === 'granted') return null;

	if (!showButton) return null;

	return (
		<>
			<View className='flex-row items-center mt-5'>
				<ButtonPrimary
					onPress={onPressSpotsNearby}
					designVariation='ghost'
					buttonStyles='p-0 bg-button-black w-8 h-8 rounded-lg flex items-center justify-center'
					nodeContentStyles='flex items-center justify-center '
					isReactNodeContent
					hitSlop={5}
					testID='discovery-spots-nearby-button'
				>
					<SpotLocationIcon />
				</ButtonPrimary>
				<TextElement textStyles='text-white text-base ml-3'>
					{i18nInstance.t('spotsNearby')}
				</TextElement>
			</View>
			<ConfirmModal
				showConfirmModal={showGetLocationModal}
				questionTextStyles='text-base'
				setShowConfirmModal={setShowGetLocationModal}
				questionText={i18nInstance.t('allowLocationSharing')}
				descriptionText={i18nInstance.t('allowLocationSharingMessage')}
				confirmButtonText={i18nInstance.t('allow')}
				cancelButtonText={i18nInstance.t('deny')}
				onConfirm={handleGetLocation}
				onCustomCancel={onCancel}
				CustomIcon={<MapIcon width={30} height={30} color='#B0B0B0' />}
			/>
		</>
	);
};

export default DiscoverySpotsNearbyButton;
