import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import Spinner from '@/UI/atoms/spinner/Spinner';
import TextElement from '@/UI/atoms/text/TextElement';

const LoadingOnBoarding = () => {
	return (
		<>
			<View className='relative flex justify-start h-14  mb-20 flex-row'>
				<Spinner containerStyles='!relative' />
			</View>
			<TextElement textStyles='text-white text-4xl mb-16 font-semibold'>
				{i18nInstance.t('findingTheBestLists')}
			</TextElement>
		</>
	);
};

export default LoadingOnBoarding;
