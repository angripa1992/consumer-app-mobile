import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import TextElement from '@/UI/atoms/text/TextElement';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayStackParamList } from '@/lib/types/tabScreenParams';
import { useNavigation } from '@react-navigation/native';


type PlayScreenNavigationProp = StackNavigationProp<PlayStackParamList, 'PlayScreen'>;

const LoadingScreen = () => {
        const navigation = useNavigation<PlayScreenNavigationProp>();
    
    const [loadingSteps, setLoadingSteps] = useState([
        { text: 'Analyzing Spots...', completed: false },
        { text: 'Building your Match Queue...', completed: false },
        { text: 'Compiling for maximum fun...', completed: false },
    ]);

    useEffect(() => {
        loadingSteps.forEach((step, index) => {
          setTimeout(() => {
            setLoadingSteps(prev =>
              prev.map((s, i) =>
                i === index ? { ...s, completed: true } : s
              )
            );
            if (index === loadingSteps.length - 1) {
              setTimeout(() => {
                navigation.navigate('QueuePlayScreen');
              }, 500); 
            }
          }, (index + 1) * 1000);
        });
      }, []);

    return (
        <>
            <View className="relative w-full h-full">
                <HeaderFeed />
                <Image
                    source={GreenTextureHeader}
                    className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]" />
                <View className="absolute w-full h-full">
                    <Image
                        source={require('@/UI/assets/images/play-screen/matchmaker-icon.png')}
                        className='absolute w-[202px] h-[200px] top-[150px] left-[-35.86px] rotate-[14.67deg]'
                    />
                    <Image
                        source={require('@/UI/assets/images/play-screen/matchmaker-icon.png')}
                        className='absolute w-[82.66px] h-[81.84px] top-[150px] left-[241.37px] rotate-[14.36deg]'
                    />

                    <Image
                        source={require('@/UI/assets/images/play-screen/matchmaker-icon.png')}
                        className='absolute w-[162.11px] h-[160.5px] top-[311.74px] left-[250px] rotate-[30deg]'
                    />
                </View>
                <View className="width-[328px] h-[120px] gap-[16px] mt-[400px] left-[40px]">
                    <TextElement designVariation='main-title' fontFamily='pachang' className='text-[40px]'>
                        {'hang\ntight...'}
                    </TextElement>
                    <View className="space-y-4">
                        {loadingSteps.map((step, index) => (
                            <View key={index} className="flex-row items-center">
                                {step.completed && (
                                    <View className="w-[16.67px] h-[16.67px] mr-3 rounded-full bg-neutral-500 items-center justify-center">
                                        <TextElement className="text-black">✓</TextElement>
                                    </View>
                                )}
                                <TextElement
                                    className={`text-white ${step.completed ? 'opacity-100' : 'opacity-50'}`}
                                >
                                    {step.text}
                                </TextElement>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </>
    );
};

export default LoadingScreen;