import {
	interpolate,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureType } from 'react-native-gesture-handler';
import { Extrapolate } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Image } from 'expo-image';

import { TAROT_CARD_WIDTH } from '@/lib/utils/constants';

import CircleIcon from '@/UI/assets/svg/shapes/CircleIcon';
import AsteriskIcon from '@/UI/assets/svg/shapes/AsteriskIcon';
import HeartFilledIcon from '@/UI/assets/svg/shapes/HeartFilledIcon';
import StainIcon from '@/UI/assets/svg/shapes/StainIcon';
import SingleDiamondIcon from '@/UI/assets/svg/shapes/SingleDiamondIcon';

import type { TypeTarotShape } from '../types/tarot';

const INITIAL_ROTATE_X = 0;
const INITIAL_ROTATE_Y = 0;

const duration = 500;

interface TypeUseTarotQRGradientProps {
	userImage?: string | null;
	userShape: TypeTarotShape;
	scrollViewRef: React.RefObject<GestureType>;
	tarotImage: string;
	direction: 'x' | 'y';
}

const useTarotQRGradient = ({
	scrollViewRef,
	userShape,
	userImage,
	tarotImage,
	direction = 'y',
}: TypeUseTarotQRGradientProps) => {
	const isDirectionX = direction === 'x';
	const isFlipped = useSharedValue(false);

	const regularCardAnimatedStyle = useAnimatedStyle(() => {
		const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
		const rotateValue = withTiming(`${spinValue}deg`, { duration });

		return {
			transform: [
				isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
			],
		};
	});

	const flippedCardAnimatedStyle = useAnimatedStyle(() => {
		const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
		const rotateValue = withTiming(`${spinValue}deg`, { duration });

		return {
			transform: [
				isDirectionX ? { rotateX: rotateValue } : { rotateY: rotateValue },
			],
		};
	});

	const handleCardPress = () => {
		isFlipped.value = !isFlipped.value;
	};

	useEffect(() => {
		Image.prefetch(tarotImage).catch((error) =>
			console.error('Error prefetching image', error),
		);
	}, [tarotImage]);

	useEffect(() => {
		if (userImage) {
			Image.prefetch(userImage).catch((error) =>
				console.error('Error prefetching image', error),
			);
		}
	}, [userImage]);

	const renderShape = () => {
		if (userShape === 'Diamond') {
			return <SingleDiamondIcon />;
		}
		if (userShape === 'Asterisk') {
			return <AsteriskIcon />;
		}
		if (userShape === 'Circle') {
			return <CircleIcon />;
		}
		if (userShape === 'Love Heart') {
			return <HeartFilledIcon />;
		}
		if (userShape === 'Splatter') {
			return <StainIcon />;
		}
	};
	return {
		isFlipped,
		regularCardAnimatedStyle,
		flippedCardAnimatedStyle,
		handleCardPress,
		renderShape,
	};
};

export default useTarotQRGradient;
