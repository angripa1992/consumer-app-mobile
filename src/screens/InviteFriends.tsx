import { ScrollView, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

import { usePostAuthReferralCode } from '@/lib/hooks/useQueryWaitList';
import { useClipboard } from '@/lib/hooks/useClipboard';
import { skipWaitListCodeMessage } from '@/lib/utils/constants';
import {
	onShare,
	onShareFacebook,
	onShareInstagram,
} from '@/lib/helpers/socialMediaHelpers';
import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import Header from '@/UI/layouts/Header';
import BackIcon from '@/UI/assets/svg/BackIcon';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';

const InviteFriends = () => {
	const navigation = useNavigation<AppStackNavigationProp>();
	const { referralCode, isLoading, isError } = usePostAuthReferralCode();
	const referralCodeToShare = referralCode || '';
	const { onCopyToClipBoard, hasCopied } = useClipboard(referralCodeToShare);

	const messageToShare = skipWaitListCodeMessage(referralCodeToShare);
	const { onCopyToClipBoard: onCopyToClipBoardForFacebook } =
		useClipboard(messageToShare);

	const onPressCommonShare = () => onShare(messageToShare);
	const onPressInstagram = () => onShareInstagram(messageToShare);
	const onPressFacebook = () => onShareFacebook(onCopyToClipBoardForFacebook);

	const onPressGoBack = () => {
		navigation.goBack();
	};

	const renderReferralCode = () => {
		if (isError) {
			return 'Error while getting referral code';
		}

		if (isLoading) {
			return 'Loading...';
		}

		return referralCodeToShare;
	};

	return (
		<View className='flex-1 bg-black relative'>
			<Image
				source={GreenTextureHeader}
				className='absolute  w-full top-[-210px] left-0 h-[500px] -z-10'
			/>
			<View className='p-4'>
				<Header
					showDefaultHeader={false}
					headerContainerStyles='!bg-transparent'
					headerStyles='!bg-transparent px-0'
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
				<ScrollView>
					<TextElement fontFamily='pachang' designVariation='main-title'>
						{i18nInstance.t('inviteFriends').split(' ')[0]}
					</TextElement>
					<TextElement
						className='-mt-1'
						fontFamily='pachang'
						designVariation='main-title'
					>
						{i18nInstance.t('inviteFriends').split(' ')[1]}
					</TextElement>
					<TextElement textStyles='my-8 text-sm text-white'>
						{i18nInstance.t('inviteFriendsMessage')}
					</TextElement>
					<View>
						<TextInput
							readOnly
							value={renderReferralCode()}
							className='py-3 w-full g-dark-gray  border-admin-gray h-11 rounded-lg px-[16px] text-light-white border  bg-dark-gray'
						/>
					</View>
					<ButtonPrimary
						buttonStyles='mt-5 py-3 w-full'
						textStyles={`font-bold text-sm ${hasCopied ? 'text-black/50' : ''}`}
						disabled={isLoading}
						onPress={onCopyToClipBoard}
						designVariation='green'
					>
						{i18nInstance.t(hasCopied ? 'copiedLink' : 'copyToClipboard')}
					</ButtonPrimary>
					<View className='flex flex-col bg-[#214F41]/40 rounded-xl relative items-center py-8 mt-12 justify-center border border-[#214f41]'>
						<View className='overflow-hidden relative flex flex-col  px-4  justify-center w-full'>
							<View className='space-y-5'>
								<View className='flex items-start'>
									<TextElement
										fontFamily='pachang'
										textStyles='!text-xl text-white lowercase'
									>
										{i18nInstance.t('shareYourCode')}
									</TextElement>
									<TextElement textStyles='mt-4 text-center !text-gray-label text-lg font-normal tracking-[-0.70px]'>
										{i18nInstance.t('clickBelowToShareToSocials')}
									</TextElement>
								</View>
								<ButtonPrimary
									disabled={isLoading || isError}
									buttonStyles='mt-5 p-0 rounded-xl bg-[#214F41]'
									textStyles='font-medium text-sm text-white'
									designVariation='custom'
									nodeContentStyles='relative flex flex-row justify-between items-center'
									isReactNodeContent
									onPress={onPressCommonShare}
								>
									<View className='flex flex-row justify-start items-center  px-4 py-3'>
										<TextElement className='text-white text-base'>
											{i18nInstance.t('shareOnSocialMedia')}
										</TextElement>
									</View>
									<View className='rotate-[180deg] h-[15px] mr-4'>
										<BackIcon color='white' height='15' width='15' />
									</View>
								</ButtonPrimary>
								<ButtonPrimary
									disabled={isLoading || isError}
									buttonStyles='mt-5 p-0 rounded-xl bg-[#214F41]'
									textStyles='font-medium text-sm text-white'
									designVariation='custom'
									nodeContentStyles='relative flex flex-row justify-between items-center'
									isReactNodeContent
									onPress={onPressInstagram}
								>
									<View className='flex flex-row justify-start items-center  px-4 py-3'>
										<TextElement className='text-white text-base'>
											{i18nInstance.t('shareOnInstagram')}
										</TextElement>
									</View>
									<View className='rotate-[180deg] h-[15px] mr-4'>
										<BackIcon color='white' height='15' width='15' />
									</View>
								</ButtonPrimary>
								<ButtonPrimary
									disabled={isLoading || isError}
									buttonStyles='mt-5 p-0 rounded-xl bg-[#214F41]'
									textStyles='font-medium text-sm text-white'
									designVariation='custom'
									nodeContentStyles='relative flex flex-row justify-between items-center'
									isReactNodeContent
									onPress={onPressFacebook}
								>
									<View className='flex flex-row justify-start items-center  px-4 py-3'>
										<TextElement className='text-white text-base'>
											{i18nInstance.t('shareOnFacebook')}
										</TextElement>
									</View>
									<View className='rotate-[180deg] h-[15px] mr-4'>
										<BackIcon color='white' height='15' width='15' />
									</View>
								</ButtonPrimary>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		</View>
	);
};

export default InviteFriends;
