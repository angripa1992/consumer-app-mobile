import { useRef } from 'react';
import { View } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import type { ICarouselInstance } from 'react-native-reanimated-carousel';
import CustomImage from '../../../atoms/image/CustomImage';
import { APP_WIDTH } from '@/lib/utils/constants';
import TextElement from '@/UI/atoms/text/TextElement';
import { i18nInstance } from 'config/i18n';
import LargeArrowIcon from '@/UI/assets/svg/LargeArrowIcon';

type TypeCustomSliderImages = {
	imagesUrlToRender: string[];
};

const SliderScribbleImages = ({
	imagesUrlToRender,
}: TypeCustomSliderImages) => {
	const ref = useRef<ICarouselInstance>(null);

	const hasOnlyOneImage = imagesUrlToRender && imagesUrlToRender.length === 1;

	return (
		<View className='rounded-xl overflow-hidden relative mb-4 mt-4'>
			<Carousel
				ref={ref}
				data={imagesUrlToRender}
				loop={false}
				renderItem={({ item, index }) => (
					<CustomImage
						imageSrc={item}
						className={`h-[320px] rounded-xl w-full`}
						width={400}
						height={400}
						testID={`spot-screen-image-slider-${index}`}
						cachePolicy={'memory'}
						placeholder={{
							width: 50,
							height: 50,
						}}
						contentFit='cover'
					/>
				)}
				width={APP_WIDTH - 95}
				height={320}
				style={{
					borderRadius: 12,
				}}
				panGestureHandlerProps={{
					activeOffsetX: [-10, 10],
				}}
			/>
			{!hasOnlyOneImage && (
				<View
					style={{ width: APP_WIDTH - 95 }}
					className='flex-row items-center z-0 bg-black/50 px-4 py-2 absolute bottom-0 justify-between'
				>
					<View className='flex-row items-center'>
						<TextElement textStyles='text-xs text-white mr-2 font-bold'>
							{i18nInstance.t('scrollForMore')}
						</TextElement>
						<LargeArrowIcon width={16} height={16} />
					</View>
				</View>
			)}
		</View>
	);
};

export default SliderScribbleImages;
