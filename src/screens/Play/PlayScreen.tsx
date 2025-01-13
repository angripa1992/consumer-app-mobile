import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';

import { i18nInstance } from 'config/i18n';

import TextElement from '@/UI/atoms/text/TextElement';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';

import PhantomImage from '@/UI/assets/images/play-screen/phantom.png';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';

const PlayScreen = () => {
	const phantomAnimation = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(phantomAnimation, {
					toValue: 1,
					duration: 800,
					useNativeDriver: true,
					easing: Easing.linear,
				}),
				Animated.timing(phantomAnimation, {
					toValue: 0,
					duration: 800,
					useNativeDriver: true,
					easing: Easing.linear,
				}),
			]),
		).start();
	}, []);

	const interpolated = phantomAnimation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -20],
	});

	return (
		<View className='relative w-full h-full'>
			<HeaderFeed />
			<Image
				source={GreenTextureHeader}
				className='absolute z-[-1] w-full top-[-120px] left-0 h-[500px]'
			/>
			<View className='w-[90%] max-w-[480px] mx-auto'>
				<TextElement designVariation='main-title' fontFamily='pachang'>
					{`${i18nInstance.t('play')}`}
				</TextElement>
				<View className='flex justify-start items-center mt-32'>
					<Animated.View style={{ transform: [{ translateY: interpolated }] }}>
						<Image source={PhantomImage} className='w-[240px] h-[240px]' />
					</Animated.View>
					<TextElement className='text-white text-lg font-bold'>{`${i18nInstance.t('comingSoon')}`}</TextElement>
					<TextElement className='text-white text-center mt-6'>{`${i18nInstance.t('comingSoonText')}`}</TextElement>
				</View>
			</View>
		</View>
	);
};

export default PlayScreen;
