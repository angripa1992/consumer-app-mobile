import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { View, Animated, Easing, TouchableOpacity } from "react-native";

import { i18nInstance } from "config/i18n";

import TextElement from "@/UI/atoms/text/TextElement";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";

import PhantomImage from "@/UI/assets/images/play-screen/phantom.png";
import GreenTextureHeader from "@/UI/assets/images/textures/green-texture-header.png";
import LinearGradient from "react-native-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { PlayStackParamList } from "@/lib/types/tabScreenParams";
import { useNavigation } from "@react-navigation/native";


type PlayScreenNavigationProp = StackNavigationProp<PlayStackParamList, 'PlayScreen'>;

const MatchMakerScreen = () => {
	const navigation = useNavigation<PlayScreenNavigationProp>();
  return (
    <View className="relative w-full h-full">
      <HeaderFeed />
      <Image
        source={GreenTextureHeader}
        className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]"
      />
      <View className="w-[90%] max-w-[480px] mx-auto">
        <TextElement designVariation="main-title" fontFamily="pachang">
          {`${i18nInstance.t("play")}`}
        </TextElement>

        <View className="box-border absolute w-[355px] h-[499px] left-[15px] top-[120px] rounded-[20px] border-[1px] border-white/20 bg-white/10 z-[-1]">
          <LinearGradient
            colors={["#000000", "#C423AA"]}
            start={{ x: 0, y: 0.54 }}
            end={{ x: 1.5, y: 1.5 }}
            className="flex-1 rounded-[20px]"
          >
            <View className="p-6">
              <TextElement className="text-white text-2xl mb-4 text-center" fontFamily='pachang'>
                match maker
              </TextElement>
              <TextElement className="text-white/80 text-base mb-8 text-center" fontFamily='inter'>
                Invite your friend (or crush) and build lists together in this
                fun dating-app style format. Let's see those matches getting
                made!
              </TextElement>
              <View className="relative h-[200px]">
                <Image
                  source={require("@/UI/assets/images/play-screen/matchmaker-icon.png")}
                  className="w-[61.41px] h-[60.8px] absolute left-[223.14px] top-[-30px] rotate-[-30deg]"

                />
                <Image
                  source={require("@/UI/assets/images/play-screen/matchmaker-icon.png")}
                  className="w-[202px] h-[200px] absolute left-[65px] "
                />
                <Image
                  source={require("@/UI/assets/images/play-screen/matchmaker-icon.png")}
                  className="w-[101.57px] h-[100.56px] absolute left-[-40px] top-[100px] rotate-[23.82deg]"
                />
              </View>
              <View className="flex-row justify-between mt-4 gap-4">
                <TouchableOpacity className="flex-1 bg-[#7FFFD4] py-4 rounded-full"
				onPress={() => navigation.navigate('PlayNowScreen')}
				>
                  <TextElement className="text-center text-black font-semibold">
                    Play Now
                  </TextElement>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-4 rounded-full border border-white">
                  <TextElement className="text-center text-white font-semibold">
                    Back to Games
                  </TextElement>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
};

export default MatchMakerScreen;
