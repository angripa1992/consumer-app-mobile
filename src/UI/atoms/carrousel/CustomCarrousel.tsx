import * as React from 'react';
import { View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import type {
	ICarouselInstance,
	TCarouselProps,
} from 'react-native-reanimated-carousel';

import TextElement from '../text/TextElement';
import LargeArrowIcon from '@/UI/assets/svg/LargeArrowIcon';
import { i18nInstance } from 'config/i18n';

type CustomCarrouselProps<T> = {
	dotColor?: string;
	activeDotColor?: string;
} & TCarouselProps<T>;

const CustomCarrousel = <T,>({
	dotColor,
	data,
	activeDotColor,
	...props
}: CustomCarrouselProps<T>) => {
	const ref = React.useRef<ICarouselInstance>(null);

	return (
		<View className='w-full rounded-lg overflow-hidden relative '>
			<Carousel ref={ref} data={data} {...props} />
			<View className='flex-row items-center w-full bg-black/50 px-4 py-2 absolute bottom-0 justify-between'>
				<View className='flex-row items-center'>
					<TextElement textStyles='text-xs text-white mr-2 font-bold'>
						{i18nInstance.t('scrollForMore')}
					</TextElement>
					<LargeArrowIcon width={16} height={16} />
				</View>
			</View>
		</View>
	);
};

export default CustomCarrousel;
