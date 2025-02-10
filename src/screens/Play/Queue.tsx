import React from "react";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";
import { View, Image, Text, TouchableOpacity, Dimensions } from "react-native";
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';
import TextElement from "@/UI/atoms/text/TextElement";

import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolateColor,
    interpolate,
    runOnJS
} from 'react-native-reanimated';
import { PanGestureHandler } from "react-native-gesture-handler";
import DiscoveryScreen from "../Discovery";
import SingleSpotScreen from "../Spots";




const SWIPE_THRESHOLD = 120;
const { width } = Dimensions.get('window');

const QueuePlayScreen = () => {


    const translateX = useSharedValue(0);
    const cardRotate = useSharedValue(0);

    const handleSwipeLeft = () => {
        console.log('Swiped Left - Dislike');
    };

    const handleSwipeRight = () => {
        console.log('Swiped Right - Like');
    };

    const panGestureEvent = useAnimatedGestureHandler({
        onStart: (_, context: any) => {
            context.startX = translateX.value;
        },
        onActive: (event, context) => {
            translateX.value = context.startX + event.translationX;
            cardRotate.value = translateX.value / width * 0.3;
        },
        onEnd: (event) => {
            if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
                translateX.value = withSpring(Math.sign(event.translationX) * width * 1.5);
                if (event.translationX > 0) {
                    runOnJS(handleSwipeRight)();
                } else {
                    runOnJS(handleSwipeLeft)();
                }
            } else {
                translateX.value = withSpring(0);
                cardRotate.value = withSpring(0);
            }
        },
    });
    const cardStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            translateX.value,
            [-width * 1.5, 0, width * 1.5],
            [-30, 0, 30]
        );
        const backgroundColor = interpolateColor(
            translateX.value,
            [-width * 0.5, 0, width * 0.5],
            ['rgba(255, 40, 246, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(117, 251, 207, 0.3)']
        );
        return {
            transform: [
                { translateX: translateX.value },
                { rotate: `${rotate}deg` }
            ],
            backgroundColor,
        };
    });

    return (
        <View className="relative w-full h-full bg-black">
            <HeaderFeed />
            <Image
                source={GreenTextureHeader}
                className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]"
            />
            <View className='w-[90%] max-w-[480px] mx-auto'>
                <TextElement designVariation='main-title' fontFamily='pachang' className='text-[24px]'>
                    Manila
                </TextElement>
            </View>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View
                    style={[cardStyle]}
                    className="mx-4 bg-[#0D0D0D] rounded-[20px] overflow-hidden border-[1px] border-white w-[350px] h-[460px] top-[90px] left-[15px]"
                >

                    {/* spots here*/}

                </Animated.View>
            </PanGestureHandler>
            <View className="absolute bottom-8 left-0 right-0 flex-row justify-center items-center space-x-8">
                <TouchableOpacity
                    onPress={() => {
                        translateX.value = withSpring(-width * 1.5);
                        runOnJS(handleSwipeLeft)();
                    }}
                    className="w-[80px] h-[80px] rounded-full bg-black items-center justify-center border-[1px] border-white shadow-lg"
                >
                    <Image
                        source={require('@/UI/assets/images/play-screen/cross.png')}
                        className="w-[61px] h-[61px]"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-[54px] h-[54px] rounded-full bg-black items-center justify-center border-[1px] border-white shadow-lg"
                >
                    <Image
                        source={require('@/UI/assets/images/play-screen/swap.png')}
                        className="w-[35px] h-[35px]"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        translateX.value = withSpring(width * 1.5);
                        runOnJS(handleSwipeRight)();
                    }}
                    className="w-[80px] h-[80px] rounded-full bg-black items-center justify-center border-[1px] border-white shadow-lg"
                >
                    <Image
                        source={require('@/UI/assets/images/play-screen/matchmaker-icon.png')}
                        className="w-[60.6px] h-[60px] rotate-[8deg]"
                    />

                </TouchableOpacity>
            </View>
        </View>
    );
};

export default QueuePlayScreen;
