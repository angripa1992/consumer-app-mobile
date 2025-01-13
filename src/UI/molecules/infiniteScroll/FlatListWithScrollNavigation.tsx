import { useRef } from 'react';
import {
	FlatList,
	TouchableOpacity,
	type FlatListProps,
	View,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import TextElement from '@/UI/atoms/text/TextElement';
import LargeArrowIcon from '@/UI/assets/svg/LargeArrowIcon';

interface FlatListWithScrollNavigationProps<T> extends FlatListProps<T> {
	hasNewData?: boolean;
	refetch?: () => Promise<any>;
}

const AnimatedTouchableOpacity =
	Animated.createAnimatedComponent(TouchableOpacity);

const FlatListWithScrollNavigation = <T,>({
	hasNewData,
	refetch,
	...restProps
}: FlatListWithScrollNavigationProps<T>) => {
	const ref = useRef<FlatList<T>>(null);

	useScrollToTop(ref);

	const handleScrollToTop = async () => {
		ref.current?.scrollToOffset({ offset: 0, animated: true });
		await refetch?.();
	};

	return (
		<View className='relative'>
			<FlatList ref={ref} {...restProps} />
			{hasNewData && (
				<View
					className='absolute top-3'
					style={{
						transform: [{ translateX: -50 }],
						left: '50%',
					}}
				>
					<AnimatedTouchableOpacity
						className='bg-admin-gray flex-row justify-center  items-center rounded-2xl px-3 py-2 '
						onPress={handleScrollToTop}
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(200)}
						activeOpacity={1}
					>
						<View className='-rotate-90 mr-1'>
							<LargeArrowIcon />
						</View>
						<TextElement className='text-light-white'>New Posts</TextElement>
					</AnimatedTouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default FlatListWithScrollNavigation;
