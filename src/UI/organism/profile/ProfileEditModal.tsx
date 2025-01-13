import { useRef } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import { i18nInstance } from 'config/i18n';
import { AppStackNavigationProp } from '@/lib/types/tabScreenParams';

import AlertIcon from '@/svg/AlertIcon';
import ReportUserIcon from '@/svg/ReportUserIcon';
import EditIcon from '@/svg/EditIcon';
import LogoutIcon from '@/svg/LogoutIcon';
import TranslateIcon from '@/svg/TranslateIcon';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import LanguageOptionsModal from '../feed/modal/LanguageOptionsModal';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ProfileEditModalProps {
	name?: string;
	profileEditModalRef: React.RefObject<BottomSheetModalMethods>;
	isAuthenticateUser: boolean;
	onPressReport: () => void;
	onPressBlock: () => void;
	isBlock?: boolean;
}

const ProfileEditModal = ({
	name,
	profileEditModalRef,
	isAuthenticateUser,
	onPressReport,
	onPressBlock,
	isBlock,
}: ProfileEditModalProps) => {
	const { setShowProfileLogoutModal } = useAppStore(
		useShallow((state) => ({
			setShowProfileLogoutModal: state.setShowProfileLogoutModal,
		})),
	);
	const navigation = useNavigation<AppStackNavigationProp>();
	const languageModalRef = useRef<BottomSheetModal>(null);
	const languageOptionsModalRef = useRef<BottomSheetModal>(null);
	const languageCode = i18nInstance.locale;
	const snapPoints = isAuthenticateUser ? ['32%'] : ['25%'];

	const onPressLogout = () => {
		setShowProfileLogoutModal(true);
		profileEditModalRef.current?.close();
	};

	const redirectToProfileEdit = () => {
		profileEditModalRef.current?.close();
		setShowProfileLogoutModal(false);
		navigation.navigate('ProfileForm');
	};

	const onPressLanguage = () => {
		languageModalRef.current?.close();
		languageOptionsModalRef.current?.present();
	};

	return (
		<>
			<CustomBottomSheetModal
				snapPoints={snapPoints}
				bottomSheetModalRef={profileEditModalRef}
			>
				<TextElement textStyles='text-white mb-4 !text-xl'>
					{isAuthenticateUser ? i18nInstance.t('profileSettings') : name}
				</TextElement>
				{isAuthenticateUser ? (
					<>
						<ButtonPrimary
							buttonStyles='!px-0'
							designVariation='ghost'
							nodeContentStyles='flex text-start flex-row items-center'
							isReactNodeContent={true}
							onPress={redirectToProfileEdit}
						>
							<EditIcon />
							<TextElement textStyles='text-white !text-base ml-1'>
								{i18nInstance.t('editProfile')}
							</TextElement>
						</ButtonPrimary>
						<ButtonPrimary
							buttonStyles='!px-0'
							designVariation='ghost'
							nodeContentStyles='flex text-start flex-row items-center'
							isReactNodeContent={true}
							onPress={onPressLanguage}
						>
							<TranslateIcon />
							<View className='flex flex-row'>
								<TextElement textStyles='text-white !text-base ml-1'>
									{i18nInstance.t('language')}
								</TextElement>
								<TextElement textStyles='text-gray !text-base ml-1'>
									-{' '}
									{i18nInstance.t(
										languageCode === 'id' ? 'indonesian' : 'english',
									)}
								</TextElement>
							</View>
						</ButtonPrimary>
						<ButtonPrimary
							buttonStyles='!px-0'
							onPress={onPressLogout}
							designVariation='ghost'
							nodeContentStyles='flex text-start flex-row items-center'
							isReactNodeContent={true}
						>
							<LogoutIcon />
							<TextElement textStyles='text-white !text-base ml-1'>
								{i18nInstance.t('logout')}
							</TextElement>
						</ButtonPrimary>
					</>
				) : (
					<>
						<ButtonPrimary
							buttonStyles='!px-0'
							onPress={onPressBlock}
							designVariation='ghost'
							nodeContentStyles='flex text-start flex-row items-center'
							isReactNodeContent={true}
						>
							<ReportUserIcon />
							<TextElement textStyles='text-light-white !text-base ml-1'>
								{i18nInstance.t(isBlock ? 'unblock' : 'block')}
							</TextElement>
						</ButtonPrimary>
						<ButtonPrimary
							buttonStyles='!px-0'
							onPress={onPressReport}
							designVariation='ghost'
							nodeContentStyles='flex text-start flex-row items-center'
							isReactNodeContent={true}
						>
							<AlertIcon />
							<TextElement textStyles='text-error !text-base ml-1'>
								{i18nInstance.t('report')}
							</TextElement>
						</ButtonPrimary>
					</>
				)}
			</CustomBottomSheetModal>
			<LanguageOptionsModal languageOptionsModalRef={languageOptionsModalRef} />
		</>
	);
};

export default ProfileEditModal;
