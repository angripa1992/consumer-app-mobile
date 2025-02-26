import TextElement from "@/UI/atoms/text/TextElement";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";
// import MainLayout from "@/UI/layouts/MainLayout";
import { IMAGES } from "@/UI/molecules/play/images";
import React, { useEffect } from "react";
import { View, Text, ImageBackground, Image, Animated } from "react-native";
import GreenTextureHeader from "@/UI/assets/images/textures/green-texture-header.png";
import AnimatedTexts from "@/UI/molecules/play/animatedText";
import { useMatchAnimations } from "@/lib/hooks/useMatchAnimation";

// import { SpotCard } from '@/components/SpotCard';

const MatchScreen = () => {
  // const { spotData } = route.params;
  
  const { slideAnim, textAnim1, textAnim2, textAnim3, textAnim4 } = useMatchAnimations();

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 1,
      bounciness: 5,
    }).start();
  }, []);
  return (
    <View className="relative w-full h-full">
      <HeaderFeed />
      <Image
        source={GreenTextureHeader}
        className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]"
      />
      <Animated.View
        className="absolute w-full left-0"
        style={{
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ImageBackground
          source={IMAGES.bgMatch.match}
          className="absolute top-[80px] left-0 w-full h-[195px] opacity-25"
          resizeMode="cover"
        ></ImageBackground>
      </Animated.View>
      <View className="flex-1 items-center justify-center text-center top-[-70px] ">
        <AnimatedTexts
          textAnim1={textAnim1}
          textAnim2={textAnim2}
          textAnim3={textAnim3}
          textAnim4={textAnim4}
        />
      </View>
    </View>
  );
};

export default MatchScreen;
