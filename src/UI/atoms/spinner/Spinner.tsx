import { useEffect } from 'react';
import { View } from 'react-native';

import SpinnerIcon from '@/svg/SpinnerIcon';
import Animated, {
	cancelAnimation,
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';

type SpinnerProps = {
	width?: number;
	height?: number;
	isFullPage?: boolean;
	isOverlay?: boolean;
	containerStyles?: string;
};

const Spinner = ({
	width = 48,
	height = 48,
	isFullPage = true,
	isOverlay = false,
	containerStyles,
}: SpinnerProps) => {
	const rotation = useSharedValue(0);
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [
				{
					rotateZ: `${rotation.value}deg`,
				},
			],
		};
	}, [rotation.value]);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, {
				duration: 1000,
				easing: Easing.linear,
			}),
			200,
		);
		return () => cancelAnimation(rotation);
	}, []);

	if (!isFullPage) {
		return (
			<Animated.View
				className={`flex items-center justify-center w-full ${
					containerStyles ?? ''
				}`}
				style={[animatedStyles]}
			>
				<SpinnerIcon width={width} height={height} />
			</Animated.View>
		);
	}

	return (
		<View
			className={`absolute left-0 top-0 w-full h-full flex justify-center items-center ${
				containerStyles ?? ''
			} ${isOverlay ? 'bg-black/50' : ''}`}
		>
			<Animated.View style={[animatedStyles]}>
				<SpinnerIcon width={width} height={height} />
			</Animated.View>
		</View>
	);
};

export default Spinner;
