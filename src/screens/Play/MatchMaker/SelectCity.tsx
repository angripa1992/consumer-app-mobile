import React, { useState } from 'react';
import { View, ScrollView, Image, Text } from 'react-native';
import { useForm } from 'react-hook-form';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';
import TextElement from '@/UI/atoms/text/TextElement';
import SearchInput from '@/UI/molecules/input/FriendSearchInput';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from "@react-navigation/stack";
import { PlayStackParamList } from "@/lib/types/tabScreenParams";
import { useNavigation } from "@react-navigation/native";


type PlayScreenNavigationProp = StackNavigationProp<PlayStackParamList, 'PlayScreen'>;

const PlayNowScreen = () => {
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const { control } = useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);


  const cityDummy = [
    {
      cityname: 'Manila',
    },
    {
      cityname: 'Jakarta',
    },
    {
      cityname: 'Singapura',
    },
    {
      cityname: 'Taipei',
    },
    {
      cityname: 'Tokyo',
    },
    {
      cityname: 'Tren-on-stoke',
    },
  ];

  const FriendItem = ({ city, onPress }: { city: any, onPress: () => void }) => (
    <View className="flex-row items-center justify-between mb-4">
      <TouchableOpacity
        className="flex-row items-center"
        onPress={() => {
          setSelectedCity(city.cityname);
          navigation.navigate('HoldOnScreen'); 
        }}
      >
        <View>
          <TextElement className="text-white font-medium text-base">
            {city.cityname}
          </TextElement>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="px-4 py-2 rounded-full"
        onPress={() => {
          setSelectedCity(city.cityname);
          navigation.navigate('HoldOnScreen');
        }}
      >
        <View className="flex-row items-center">
          <View
            className={`
              w-[22px] h-[22px]
              rounded-full border-2
              justify-center items-center
              absolute left-[303px] top-[70px]
              z-[1] order-1 flex-none
              ${selectedCity === city.cityname ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}
            `}
          >
            {selectedCity === city.cityname && (
              <Text className="text-white">✔️</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );


  return (
    <>
      <View className="relative w-full h-full">
        <HeaderFeed />
        <Image
          source={GreenTextureHeader}
          className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]" />
        <View className="flex-1 px-4 pt-12">
          <TextElement className="text-white font-bold text-base leading-[130%] font-['Inter'] mb-2">
            Step 2 - Chose your City
          </TextElement>
          <TextElement className="text-[#575757] text-sm leading-[140%] font-['Inter'] font-normal tracking-[-0.1px] mb-4">
            Pick the city you want to ecplore togerther
          </TextElement>

          <View className="flex-row items-center">
            <SearchInput
              searchQueryValue={searchQuery}
              control={control}
              name="name"
              clearInput={() => setSearchQuery('')}
              showCustomError={false}
              customErrorText=""
              testID="playnow-search-input"
              containerStyles='flex-1 mr-3' />
          </View>

          <ScrollView className="flex-1 mt-3">
            <View className="mb-b mt-4">
              {cityDummy.map((city) => (
                <FriendItem
                  city={city}
                  onPress={() => {
                    console.log(`Selected ${city.cityname}`);
                  }}
                />
              ))}
            </View>
          </ScrollView>


        </View>

      </View>
    </>

  );
};

export default PlayNowScreen;