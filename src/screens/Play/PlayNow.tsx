import React, { useState } from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import HeaderFeed from '@/UI/layouts/feed/HeaderFeed';
import TextElement from '@/UI/atoms/text/TextElement';
import SearchInput from '@/UI/molecules/input/FriendSearchInput';
import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';
import useDiscoveryScreen from '@/lib/hooks/useDiscoveryScreen';
import MainLayout from '@/UI/layouts/MainLayout';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import PlayResult from '@/UI/organism/play/PlayResults';
import { StackNavigationProp } from "@react-navigation/stack";
import { PlayStackParamList } from "@/lib/types/tabScreenParams";
import { useNavigation } from "@react-navigation/native";

type PlayScreenNavigationProp = StackNavigationProp<PlayStackParamList, 'PlayScreen'>;

const PlayNowScreen = () => {
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const { control } = useForm();
  const [searchQuery, setSearchQuery] = useState('');

  const dummyFriends = [
    {
      id: '1',
      username: 'Abeautifullion765',
      location: 'Canberra, Australia',
      avatar: require('@/UI/assets/images/play-screen/person_icon.png'),
    },
    {
      id: '2',
      username: 'silverduck204',
      location: 'Canberra, Australia',
      avatar: require('@/UI/assets/images/play-screen/person_icon.png'),
    },
    {
      id: '3',
      username: 'crazyelephant681',
      location: 'Canberra, Australia',
      avatar: require('@/UI/assets/images/play-screen/person_icon.png'),
    },
    {
      id: '4',
      username: 'whitefish664',
      location: 'Canberra, Australia',
      avatar: require('@/UI/assets/images/play-screen/person_icon.png'),
    },
    {
      id: '5',
      username: 'whitegoose497',
      location: 'Canberra, Australia',
      avatar: require('@/UI/assets/images/play-screen/person_icon.png'),
    },
    {
      id: '6',
      username: 'bluebear234',
      location: 'Canberra, Australia',
      avatar: require('@/UI/assets/images/play-screen/person_icon.png'),
    },
  ];

  const FriendItem = ({ friend, onPress }: { friend: any, onPress: () => void }) => (
    <View className="flex-row items-center justify-between mb-4">
      <View className="flex-row items-center">
        <Image
          source={friend.avatar}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View>
          <TextElement className="text-white font-medium text-base">
            {friend.username}
          </TextElement>
          <TextElement className="text-[#575757] text-sm">
            {friend.location}
          </TextElement>
        </View>
      </View>
      <TouchableOpacity
        className="bg-[#2C2C2E] px-4 py-2 rounded-full right-3"
        onPress={() => {
          console.log(`Selected ${friend.username}`);
          navigation.navigate('SelectCityScreen');
        }}
      >
        <TextElement className="text-white">Select</TextElement>
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
            Step 1 - Choose your Friend
          </TextElement>
          <TextElement className="text-[#575757] text-sm leading-[140%] font-['Inter'] font-normal tracking-[-0.1px] mb-4">
            Find your friend to play with below.
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
              {dummyFriends.map((friend) => (
                <FriendItem
                  key={friend.id}
                  friend={friend}
                  onPress={() => {
                    console.log(`Selected ${friend.username}`);

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