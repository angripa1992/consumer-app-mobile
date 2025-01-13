import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { AuthNavigationProp } from '@/lib/types/tabScreenParams';
import { useNavigation } from '@react-navigation/native';
import WaitListApprovedLogo from '@/UI/assets/svg/WaitListApprovedLogo';
import GreenTexture from '@/images/textures/waitlist-green-texture.png';
import Header from '@/UI/layouts/Header';
import BackIcon from '@/UI/assets/svg/BackIcon';
import SkipSuccessfullyImage from '@/images/waitlist/skip-successful.png';
import { i18nInstance } from 'config/i18n';

interface WaitListUseCodeFormProps {
	message: React.ReactNode;
	isShowHeader?: boolean;
}

const WaitListUserApproved = ({
	message,
	isShowHeader = true,
}: WaitListUseCodeFormProps) => {
	const navigation = useNavigation<AuthNavigationProp>();

	const onPressLogin = () => {
		navigation.replace('Login');
	};

	const onPressBack = () => {
		navigation.goBack();
	};

	return (
		<View className='justify-center items-center flex w-full h-full'>
			<Image
				source={GreenTexture}
				className='absolute bottom-0 right-0 w-full h-[70%] z-[-1] object-cover'
			/>
			<View className='px-4 w-full h-full'>
				{isShowHeader && (
					<Header
						showDefaultHeader={false}
						headerContainerStyles='!bg-transparent mb-16'
						headerStyles='!bg-transparent pl-0'
					>
						<ButtonPrimary
							onPress={onPressBack}
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
				)}
				<View
					className={`mb-2 justify-center items-center relative ${!isShowHeader && 'mt-[60%]'}`}
				>
					<WaitListApprovedLogo />
					<Image
						className='w-24 h-24 bottom-5'
						source={SkipSuccessfullyImage}
						contentFit='contain'
					/>
				</View>
				<TextElement textStyles='text-center !text-white text-2xl font-bold tracking-[-0.12px]'>
					{i18nInstance.t('skipSuccessfully')}
				</TextElement>
				{message}
				<ButtonPrimary
					buttonStyles={`mt-5 py-3 w-full`}
					textStyles='font-medium text-sm'
					testID='signup-button'
					onPress={onPressLogin}
				>
					{i18nInstance.t('logIn')}
				</ButtonPrimary>
			</View>
		</View>
	);
};

export default WaitListUserApproved;
