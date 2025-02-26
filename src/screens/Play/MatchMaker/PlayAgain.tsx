import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { View, Animated, Easing, TouchableOpacity } from "react-native";

import { i18nInstance } from "config/i18n";

import TextElement from "@/UI/atoms/text/TextElement";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";
import GreenTextureHeader from "@/UI/assets/images/textures/green-texture-header.png";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { PlayScreenNavigationProp } from "@/lib/types/tabScreenParams";

const PlayAgainScreen = () => {
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

        <View className="box-border absolute w-[355px] h-[510px] mt-2 left-[15px] top-[80px] rounded-[20px] border-[1px] border-white/20 bg-white/10 z-[-1]">
          <LinearGradient
            colors={["#000000", "#C423AA"]}
            start={{ x: 0, y: 0.54 }}
            end={{ x: 1.5, y: 1.5 }}
            className="flex-1 rounded-[20px]"
          >
            <View className="p-6">
              <TextElement
                className="text-white text-2xl mb-4 text-center"
                fontFamily="pachang"
              >
                match maker
              </TextElement>
              <TextElement
                className="text-white/80 text-base mb-8 text-center"
                fontFamily="inter"
              >
                We noticed you recently played a game of Match Maker - please
                opt for one of the following.
              </TextElement> 
              <View className="relative h-[200px]">
                <Image
                  source={require("@/UI/assets/images/play-screen/gmbk.png")}
                  className="w-[141px] h-[141px] absolute left-[65px] "
                />
              </View>
              <TextElement
                className="text-white/80 text-base mb-8 text-center top-[-30px]"
                fontFamily="inter"
              >
                New Match Maker Available - 23:59
              </TextElement>
              <TextElement
                className="text-white/80 text-base mb-8 text-center top-[-60px]"
                fontFamily="pachang"
              >
                Or
              </TextElement>
              <TextElement
                className="text-white/80 text-base mb-8 text-center top-[-90px]"
                fontFamily="inter"
              >
                Skip the Wait? Bring a new friend to klikit.
              </TextElement>
              <View className="flex-row justify-between gap-4 top-[-110px]">
                <TouchableOpacity className="flex-1 bg-[#7FFFD4] py-4 rounded-full"
                onPress={() => navigation.navigate('InviteFriends')}>
                  <TextElement className="text-center text-black font-semibold">
                    Invite Friends
                  </TextElement>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-4 rounded-full border border-white"
                onPress={() => navigation.navigate('PlayScreen')}>
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

export default PlayAgainScreen;
