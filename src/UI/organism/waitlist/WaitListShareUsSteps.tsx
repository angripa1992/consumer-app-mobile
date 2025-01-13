import WaitListUseCodeLogo from '@/UI/assets/svg/WaitListUseCodeLogo';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import React from 'react';
import { View } from 'react-native';
import KlikitCinema from '@/images/klikit-cinema.png';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { i18nInstance } from 'config/i18n';

const WaitListShareUsSteps = () => {
	const onPressUseTemplate = async () => {
		await Linking.openURL('https://vm.tiktok.com/ZGegfCqdT/');
	};

	return (
		<View className='justify-center items-center'>
			<View className='mb-2 justify-center items-center relative'>
				<WaitListUseCodeLogo />
				<Image
					className='w-28 h-28 bottom-7'
					source={KlikitCinema}
					contentFit='contain'
				/>
			</View>
			<TextElement textStyles='text-center !text-white text-2xl font-bold tracking-[-0.12px]'>
				{i18nInstance.t('shareToSkip')}
			</TextElement>
			<TextElement textStyles='mb-3 mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
				{i18nInstance.t('wantToAccessNow')}
			</TextElement>
			<TextElement textStyles='mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
				(1) Create a fun video using our fun filter by tapping the button below
			</TextElement>
			<TextElement textStyles='mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
				(2) Post it on TikTok/IG and use #klikitAsks
			</TextElement>
			<TextElement textStyles='mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
				(3) Tag us (@klikit.io) in your post and we’ll approve you!
			</TextElement>
			<ButtonPrimary
				buttonStyles={`mt-10 py-3 w-full`}
				textStyles='font-medium text-sm'
				onPress={onPressUseTemplate}
			>
				Use Template
			</ButtonPrimary>
		</View>
	);
};

export default WaitListShareUsSteps;
