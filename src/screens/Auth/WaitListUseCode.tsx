import { useState } from 'react';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Image } from 'expo-image';

import { i18nInstance } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';
import { useNavigation } from '@react-navigation/native';

import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import Header from '@/UI/layouts/Header';
import WaitListUserApproved from '@/UI/layouts/waitlist/WaitListUserApproved';
import WaitListUseCodeForm from '@/UI/organism/waitlist/WaitListUseCodeForm';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';

import type { AuthNavigationProp } from '@/lib/types/tabScreenParams';

const WaitListUseCode = () => {
	const [showApprovedMessage, setShowApprovedMessage] = useState(false);
	const { waitlistUserNumber } = useAppStore(
		useShallow((state) => ({
			waitlistUserNumber: state.waitlistUserNumber,
		})),
	);
	const navigation = useNavigation<AuthNavigationProp>();

	const onPressGoBack = () => {
		navigation.goBack();
	};

	const approvedMessage = () => {
		return (
			<>
				<TextElement textStyles='mb-3 mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
					{i18nInstance.t('thanksToYourFriendReferralLink', {
						number: waitlistUserNumber,
					})}
				</TextElement>
				<TextElement textStyles='mt-4 text-center !text-white text-base font-normal tracking-[-0.70px] mb-10'>
					{i18nInstance.t('weCantWaitToSeeYouInside')}
				</TextElement>
			</>
		);
	};

	return (
		<>
			{!showApprovedMessage ? (
				<>
					<Image
						source={GreenTextureHeader}
						className='absolute  w-full top-[-210px] left-0 h-[500px] -z-10'
					/>
					<KeyboardAwareScrollView
						className='h-full relative z-[2]'
						showsVerticalScrollIndicator={false}
					>
						<View className='p-4 flex-1'>
							<Header
								showDefaultHeader={false}
								headerContainerStyles='!bg-transparent '
								headerStyles='!bg-transparent pl-0'
							>
								<ButtonPrimary
									onPress={onPressGoBack}
									designVariation='ghost'
									buttonStyles='px-3 py-2'
								>
									<View className='flex flex-row items-center justify-center'>
										<BackIcon color='white' height='15' width='10' />
										<TextElement textStyles='ml-2 mb-[2px] text-white text-base font-bold'>
											{i18nInstance.t('back')}
										</TextElement>
									</View>
								</ButtonPrimary>
							</Header>
							<WaitListUseCodeForm
								setShowApprovedMessage={setShowApprovedMessage}
								showApprovedMessage={showApprovedMessage}
							/>
						</View>
					</KeyboardAwareScrollView>
				</>
			) : (
				<WaitListUserApproved message={approvedMessage()} />
			)}
		</>
	);
};

export default WaitListUseCode;
