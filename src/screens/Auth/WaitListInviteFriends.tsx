import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { Image } from 'expo-image';

import { i18nInstance } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';
import { useNavigation } from '@react-navigation/native';
import { usePostGetGuestUsers } from '@/lib/hooks/useQueryWaitList';

import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import Header from '@/UI/layouts/Header';
import WaitListUserApproved from '@/UI/layouts/waitlist/WaitListUserApproved';
import WaitListInviteFriendsForm from '@/UI/organism/waitlist/WaitListInviteFriendsForm';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';

import type { AuthNavigationProp } from '@/lib/types/tabScreenParams';

const WaitListInviteFriends = () => {
	const navigation = useNavigation<AuthNavigationProp>();
	const { waitlistUserNumber } = useAppStore(
		useShallow((state) => ({
			waitlistUserNumber: state.waitlistUserNumber,
		})),
	);
	const { guestUserCounter } = usePostGetGuestUsers();

	const onPressGoBack = () => {
		navigation.goBack();
	};

	const approvedMessage = () => {
		return (
			<>
				<TextElement textStyles='mb-3 mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
					{i18nInstance.t('thanksForSharingKlikitWithYourFriends', {
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
			{guestUserCounter === 0 ? (
				<WaitListUserApproved message={approvedMessage()} />
			) : (
				<View className='flex-1 bg-black'>
					<Image
						source={GreenTextureHeader}
						className='absolute  w-full top-[-210px] left-0 h-[500px] -z-10'
					/>
					<View className='p-4'>
						<Header
							showDefaultHeader={false}
							headerContainerStyles='!bg-transparent'
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
						<WaitListInviteFriendsForm />
					</View>
				</View>
			)}
		</>
	);
};

export default WaitListInviteFriends;
