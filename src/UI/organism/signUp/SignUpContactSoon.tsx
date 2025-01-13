import { View, BackHandler, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useEffect } from 'react';
import { i18nInstance } from 'config/i18n';

import Header from '@/UI/layouts/Header';
import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';
import { AuthNavigationProp } from '@/lib/types/tabScreenParams';
import { usePostGetGuestUsers } from '@/lib/hooks/useQueryWaitList';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';
import TasteTestIcon from '@/UI/assets/svg/TasteTestIcon';
import MailIcon from '@/UI/assets/svg/MailIcon';
import FivePointStart from '@/UI/assets/svg/FivePointStart';

type TypeSignUpContactSoonProps = {
	onBackPress: () => void;
};

const SignUpContactSoon = ({ onBackPress }: TypeSignUpContactSoonProps) => {
	const navigation = useNavigation<AuthNavigationProp>();
	const { guestUserCounter, isLoading } = usePostGetGuestUsers();
	const { waitlistUserNumber } = useAppStore(
		useShallow((state) => {
			return {
				waitlistUserNumber: state.waitlistUserNumber,
			};
		}),
	);

	const inviteFriendsButtonText = () => {
		if (isLoading) {
			return `${i18nInstance.t('loading')}...`;
		}
		if (guestUserCounter === 0) {
			return i18nInstance.t('invitationsCompleted');
		}

		return i18nInstance.t('InviteNumberFriends', {
			numberFriends: guestUserCounter ?? '',
		});
	};

	const onPressInviteFriends = () => {
		navigation.navigate('WaitListInviteFriends');
	};

	const onPressTasteTarotQuiz = () => {
		navigation.navigate('WaitListTarotQuiz');
	};

	const onPressUseCode = () => {
		navigation.navigate('WaitListUseCode');
	};

	useEffect(() => {
		const backAction = () => {
			onBackPress();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, []);

	return (
		<View className='h-screen w-screen relative '>
			<View className='w-screen h-screen bg-black opacity-80 absolute bottom-0 left-0 z-[2]' />
			<Image
				source={GreenTextureHeader}
				className='absolute z-10 w-full top-[-210px] left-0 h-[500px]'
			/>
			<Header
				showDefaultHeader={false}
				headerContainerStyles='!bg-transparent flex w-full'
				headerStyles='bg-transparent mt-4 mb-5 !py-0 px-5 flex justify-between'
			>
				<ButtonPrimary
					onPress={onBackPress}
					designVariation='ghost'
					buttonStyles='px-0 py-2 w-[100px]'
				>
					<View className='flex flex-row items-center justify-start'>
						<BackIcon color='white' height='15' width='10' />
						<TextElement textStyles='ml-2 mb-[2px] text-white text-base font-bold'>
							{i18nInstance.t('signUp')}
						</TextElement>
					</View>
				</ButtonPrimary>
				<ChangeLanguageButton />
			</Header>
			<View className='z-10 px-5 flex justify-start flex-1 mb-20'>
				<TextElement fontFamily='pachang' designVariation='main-title'>
					{i18nInstance.t('wantToSkip')}
				</TextElement>

				<View className='flex flex-col bg-[#214F41]/40 rounded-xl relative items-center py-8 mt-12 justify-center border border-[#214f41]'>
					<View className='overflow-hidden relative flex flex-col  px-4  justify-center w-full'>
						<View className='space-y-5'>
							<View className='flex items-start'>
								<TextElement
									fontFamily='pachang'
									textStyles='!text-xl text-white'
								>
									{i18nInstance.t('getYourCode')}
								</TextElement>
								<TextElement textStyles='mt-4 text-center !text-gray-label text-lg font-normal tracking-[-0.70px]'>
									{i18nInstance.t('completeTaskToGetCode')}
								</TextElement>
							</View>
							<View>
								<ButtonPrimary
									buttonStyles='mt-5 p-0 rounded-xl bg-[#214F41]'
									textStyles='font-medium text-sm text-white'
									testID='signup-button'
									onPress={onPressInviteFriends}
									designVariation='custom'
									nodeContentStyles='relative  flex flex-row justify-between items-center'
									isReactNodeContent
								>
									<View className='flex flex-row justify-start items-center relative px-4 py-3'>
										<TasteTestIcon />
										<TextElement className='text-white ml-6 text-base'>
											{inviteFriendsButtonText()}
										</TextElement>
									</View>
									<View className='rotate-[180deg] h-[15px] mr-4'>
										<BackIcon color='white' height='15' width='15' />
									</View>
								</ButtonPrimary>
								<ButtonPrimary
									buttonStyles='mt-5 p-0 rounded-xl bg-[#214F41]'
									textStyles='font-medium text-sm text-white'
									testID='signup-button'
									onPress={onPressTasteTarotQuiz}
									designVariation='custom'
									nodeContentStyles='relative flex flex-row justify-between items-center'
									isReactNodeContent
								>
									<View className='flex flex-row justify-start items-center  px-4 py-3'>
										<MailIcon />
										<TextElement className='text-white ml-6 text-base'>
											{i18nInstance.t('completeTasteTestQuiz')}
										</TextElement>
									</View>
									<View className='rotate-[180deg] h-[15px] mr-4'>
										<BackIcon color='white' height='15' width='15' />
									</View>
								</ButtonPrimary>
								<ButtonPrimary
									buttonStyles='mt-5 p-0 rounded-xl bg-[#214F41]'
									textStyles='font-medium text-sm text-white'
									testID='signup-button'
									onPress={onPressUseCode}
									designVariation='custom'
									nodeContentStyles='flex flex-row justify-between items-center'
									isReactNodeContent
								>
									<View className='flex flex-row justify-start items-center px-4 py-3'>
										<FivePointStart color='white' />
										<TextElement className='text-white ml-6 text-base'>
											{i18nInstance.t('useFoundingfoodieCode')}
										</TextElement>
									</View>
									<View className='rotate-[180deg] h-[15px] mr-4'>
										<BackIcon color='white' height='15' width='15' />
									</View>
								</ButtonPrimary>
							</View>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default SignUpContactSoon;
