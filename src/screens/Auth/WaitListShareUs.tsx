import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import Header from '@/UI/layouts/Header';
import { AuthNavigationProp } from '@/lib/types/tabScreenParams';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View } from 'react-native';
import WaitListShareUsSteps from '@/UI/organism/waitlist/WaitListShareUsSteps';
import { i18nInstance } from 'config/i18n';

const WaitListShareUs = () => {
	const navigation = useNavigation<AuthNavigationProp>();

	const onPressGoBack = () => {
		navigation.goBack();
	};

	return (
		<View className='flex-1 bg-black p-4 '>
			<Header
				showDefaultHeader={false}
				headerContainerStyles='!bg-transparent mb-16'
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
			<WaitListShareUsSteps />
		</View>
	);
};

export default WaitListShareUs;
