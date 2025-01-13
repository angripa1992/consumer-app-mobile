import { View, Image, BackHandler } from 'react-native';
import { useEffect } from 'react';

import { i18nInstance } from 'config/i18n';

import TextElement from '@/UI/atoms/text/TextElement';
import LogoLogin from '@/images/klikit-new-logo-icon.png';
import KlikitLogoNameWhite from '@/images/klikit-logo-name-white.png';
import Header from '@/UI/layouts/Header';
import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type { TypeWaitListFormView } from '@/lib/types/login';

type TypeWaitListSentProps = {
	setTypeView: (values: TypeWaitListFormView) => void;
};

const WaitListSent = ({ setTypeView }: TypeWaitListSentProps) => {
	const onBackPress = () => {
		setTypeView('form');
	};
	useEffect(() => {
		const backAction = () => {
			setTypeView('form');
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, []);

	return (
		<View className='h-full w-full relative z-10'>
			<Header
				showDefaultHeader={false}
				headerContainerStyles='!bg-transparent'
				headerStyles='!bg-transparent !mt-4'
			>
				<ButtonPrimary
					onPress={onBackPress}
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
			<View className='pt-5 flex flex-col items-center justify-center'>
				<Image
					className='w-[160px] h-[160px] aspect-square'
					source={LogoLogin}
				/>
				<View className='pt-4 px-5 pb-7 overflow-hidden relative flex flex-col justify-center w-full'>
					<View className='space-y-5 z-[5]'>
						<Image
							className='mx-auto mb-3 object-cover'
							source={KlikitLogoNameWhite}
						/>
						<View>
							<TextElement textStyles='text-center !text-white text-3xl font-bold tracking-[-0.12px]'>
								Thanks for signing up
							</TextElement>
							<TextElement textStyles='mb-3 text-center !text-white text-base font-bold tracking-[-0.70px]'>
								We will let you know when the app is ready to be used
							</TextElement>
						</View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default WaitListSent;
