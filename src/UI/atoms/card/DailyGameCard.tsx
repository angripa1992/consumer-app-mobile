import React from 'react';
import { View, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TextElement from '../text/TextElement';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlayStackParamList } from '@/lib/types/tabScreenParams';

type PlayScreenNavigationProp = StackNavigationProp<PlayStackParamList, 'PlayScreen'>;

const DailyGameCard = () => {
    const navigation = useNavigation<PlayScreenNavigationProp>();

    return (
        <View>
            <TextElement className='text-white text-xl mb-4'>Daily Games</TextElement><Pressable className='bg-black rounded-[20px] p-4 mb-4 border-[1px] border-white/20 flex-row justify-between items-center'
                onPress={() => navigation.navigate('MatchMakerScreen')}
            >
                <View className='flex-row justify-between items-center'>
                    <View className='flex-1'>
                        <TextElement className='text-white text-xl'>
                            <TextElement designVariation='main-title' fontFamily='pachang' className='text-[16px]'>
                                match maker
                            </TextElement>
                        </TextElement>
                        <TextElement className='text-white mt-2'>
                            Build collaborative lists with a {'\n'} friend with a dating-app twist.
                        </TextElement>
                    </View>
                    <Image
                        source={require('@/UI/assets/images/play-screen/matchmaker-icon.png')}
                        className='absolute w-[157.04px] h-[157.04px] left-[240px]'
                        style={{
                            transform: [{ rotate: '-25.04deg' }],
                        }} />
                </View>
            </Pressable>
            <Pressable className='bg-black rounded-[20px] p-4 mb-4 border-[2px] border-white/20 flex-row justify-between items-center'>
                <View className='flex-row justify-between items-center'>
                    <View className='flex-1'>
                        <TextElement className='text-white text-xl'>
                            <TextElement designVariation='main-title' fontFamily='pachang' className='text-[16px]'>
                                poll dancing
                            </TextElement>
                        </TextElement>
                        <TextElement className='text-white mt-2'>
                            Answer questions about your {'\n'} city and top the leaderboard.
                        </TextElement>
                    </View>
                    <Image
                        source={require('@/UI/assets/images/play-screen/poll-icon.png')}
                        className='absolute w-[157.04px] h-[157.04px] left-[240px]'
                        style={{
                            transform: [{ rotate: '-25.04deg' }],
                        }} />
                </View>
            </Pressable><Pressable className='bg-black rounded-[20px] p-4 mb-4 border-[1px] border-white/20 flex-row justify-between items-center'>
                <View className='flex-row justify-between items-center'>
                    <View className='flex-1'>
                        <TextElement designVariation='main-title' fontFamily='pachang' className='text-[16px]'>
                            this or that
                        </TextElement>
                        <TextElement className='text-white mt-2'>
                            Choose your favourites and see {'\n'} how other people picked.
                        </TextElement>
                    </View>
                    <Image
                        source={require('@/UI/assets/images/play-screen/spin-icon.png')}
                        className='absolute w-[170px] h-[170px] left-[240px] top-[-26px]' />

                </View>
            </Pressable><Pressable className='bg-black rounded-[20px] p-4 mb-4 border-[1px] border-white/20 flex-row justify-between items-center'>
                <View className='flex-row justify-between items-center'>
                    <View className='flex-1'>
                        <TextElement designVariation='main-title' fontFamily='pachang' className='text-[16px]'>
                            brainwave
                        </TextElement>
                        <TextElement className='text-white mt-2'>
                            See if you’re on the same {'\n'} wavelength as the crowd.
                        </TextElement>
                    </View>
                    <Image
                        source={require('@/UI/assets/images/play-screen/brain-icon.png')}
                        className='absolute w-[157.04px] h-[157.04px] left-[240px]'
                        style={{
                            transform: [{ rotate: '-25.04deg' }],
                        }} />
                </View>
            </Pressable><Pressable className='bg-black rounded-[20px] p-4 mb-4 border-[1px] border-white/20 flex-row justify-between items-center'>
                <View className='flex-row justify-between items-center'>
                    <View className='flex-1'>
                        <TextElement designVariation='main-title' fontFamily='pachang' className='text-[16px]'>
                            lucky spin
                        </TextElement>
                        <TextElement className='text-white mt-2'>
                            Play minigames at no cost and {'\n'} grab some klikit points.
                        </TextElement>
                    </View>
                    <Image
                        source={require('@/UI/assets/images/play-screen/lucky-icon.png')}
                        className='absolute w-[170px] h-[170px] left-[240px] top-[-35px]' />
                </View>
            </Pressable>
        </View>
    );
};

export default DailyGameCard;

