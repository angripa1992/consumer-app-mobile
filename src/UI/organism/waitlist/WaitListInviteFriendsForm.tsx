import { ScrollView, TextInput, View } from 'react-native';

import { usePostGetCodeToInvite } from '@/lib/hooks/useQueryWaitList';
import { useClipboard } from '@/lib/hooks/useClipboard';
import { appDeepLink, skipWaitListCodeMessage } from '@/lib/utils/constants';
import {
	onShare,
	onShareFacebook,
	onShareInstagram,
} from '@/lib/helpers/socialMediaHelpers';
import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import BackIcon from '@/UI/assets/svg/BackIcon';

const WaitListInviteFriendsForm = () => {
	const { codeToInvite, isLoading, isError } = usePostGetCodeToInvite();

	const renderCodeToInvite = () => {
		if (isError) {
			return 'Error while getting link';
		}

		if (isLoading) {
			return 'Loading...';
		}

		return `${appDeepLink}?referralCode=${codeToInvite || ''}`;
	};

	const { onCopyToClipBoard, hasCopied } = useClipboard(renderCodeToInvite());
	const messageToShare = skipWaitListCodeMessage(renderCodeToInvite());
	const { onCopyToClipBoard: onCopyToClipBoardForFacebook } =
		useClipboard(messageToShare);

	const onPressCommonShare = () => onShare(messageToShare);
	const onPressInstagram = () => onShareInstagram(messageToShare);
	const onPressFacebook = () => onShareFacebook(onCopyToClipBoardForFacebook);

	return (
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
				{i18nInstance.t('skipTheWaitlistBySharingYour')}
			</TextElement>
			<View className='w-full mt-10'>
				<TextInput
					readOnly
					value={renderCodeToInvite()}
					className='py-3 w-full g-dark-gray  border-admin-gray h-11 rounded-lg px-[16px] text-light-white border  bg-dark-gray'
				/>
			</View>
			<ButtonPrimary
				buttonStyles='mt-5 py-3 w-full'
				textStyles={`font-medium text-sm ${hasCopied ? 'text-black/50' : ''}`}
				disabled={isLoading}
				designVariation='green'
				onPress={onCopyToClipBoard}
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
	);
};

export default WaitListInviteFriendsForm;
