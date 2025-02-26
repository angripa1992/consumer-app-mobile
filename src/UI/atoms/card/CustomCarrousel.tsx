import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TextElement from '../text/TextElement';

const CustomCarrousel = () => {
  return (
    <View className='mt-2'>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Pressable className='w-[321px] h-[117px] mx-2 border-[0.75px] border-white rounded-[20px] overflow-hidden'>
          <LinearGradient
            colors={['#000000', '#B0140A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1, padding: 16, borderRadius: 20 }}
          >
            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <TextElement className='text-white text-2xl text-[16px] ' fontFamily='pachang'>
                  daily deals
                </TextElement>
                <TextElement className='text-white mt-2' >
                  Get 'em while they're hot!{'\n'}
                  Browse the latest deals for you.
                </TextElement>
              </View>
              <Image
                source={require('@/UI/assets/images/play-screen/flame.png')}
                className='absolute w-[183px] h-[183px] left-[165px]'
                style={{
                  transform: [{ rotate: '-16.5deg' }],
                }}
              />
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable className='w-[321px] h-[117px] mx-2 border-[0.75px] border-white rounded-[20px] overflow-hidden'>
          <LinearGradient
            colors={['#000000', '#BE009F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1, padding: 16, borderRadius: 20 }}
          >
            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <TextElement className='text-white text-2xl text-[16px] ' fontFamily='pachang'>
                  nearby tiktoks
                </TextElement>
                <TextElement className='text-white mt-2'>
                  Check out amazing videos{'\n'}
                  featuring places near you now.
                </TextElement>
              </View>
              <Image
                source={require('@/UI/assets/images/play-screen/tiktok-icon.png')}
                className='absolute w-[147px] h-[160px] left-[190px] top-[-25px]'
              />
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable className='w-[321px] h-[117px] mx-2 border-[0.75px] border-white rounded-[20px] overflow-hidden'>
          <LinearGradient
            colors={['#000000', '#0A0D58']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{ flex: 1, padding: 16, borderRadius: 20 }}
          >
            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <TextElement className='text-white text-2xl text-[16px] ' fontFamily='pachang'>
                  meet andy
                </TextElement>
                <TextElement className='text-white mt-2'>
                  Enak gila! Andy Garcia is one of{'\n'}
                  the top ID foodies. Check him out!
                </TextElement>
              </View>
              <Image
                source={require('@/UI/assets/images/play-screen/andy.png')}
                className='absolute w-[170px] h-[231px] left-[171px] top-[-31px]'
              />
            </View>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default CustomCarrousel;