import React from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import { useSwipeAnimation } from "@/hooks/useSwipeAnimation";
import Animated, {
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { QueueScreenRouteParams } from "@/lib/types/tabScreenParams";
import { useAppStore } from "@/lib/store/store";
import { useGetSingleSpot } from "@/lib/hooks/UseQuerySpot";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";
import GreenTextureHeader from "@/UI/assets/images/textures/green-texture-header.png";
import TextElement from "@/UI/atoms/text/TextElement";
import SpinnerCup from "@/UI/atoms/spinner/SpinnerCup";
import SpotSingleView from "@/UI/organism/spot/SpotSingleView";
import { IMAGES } from "@/UI/molecules/play/images";

const { width } = Dimensions.get("window");

const QueuePlayScreen = ({ route }: QueueScreenRouteParams) => {
  const SpotIdValue = "303";
  // const { spotId = SpotIdValue } = route?.params || {};
  const {
    singleSpot,
    isLoading,
    refetch: refetchSingleSpot,
  } = useGetSingleSpot(SpotIdValue); 

  const isLoadingSpot = isLoading || !singleSpot;
  const isShowSpot = !isLoading && singleSpot;

  const renderSpotView = () => {
    return (
      <View className="flex-1">
        {isLoadingSpot && (
          <View className="flex-1 justify-center items-center">
            <SpinnerCup />
          </View>
        )}
        {isShowSpot && (
          <View className="flex-1">
            <SpotSingleView
              refetchSingleSpot={refetchSingleSpot}
              singleSpot={singleSpot}
              isQueueScreen={true}
            />
          </View>
        )}
      </View>
    );
  };

  const translateX = useSharedValue(0);
  const cardRotate = useSharedValue(0);
  const handleSwipeLeft = () => {
    console.log("Swiped Left - Dislike");
  };
  const handleSwipeRight = () => {
    console.log("Swiped Right - Like");
  };
  const { panGestureEvent, cardStyle, overlayStyle } = useSwipeAnimation({
    translateX,
    cardRotate,
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
  });

  return (
    <View className="relative w-full h-full bg-black">
      <HeaderFeed />
      <Image
        source={GreenTextureHeader}
        className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]"
      />
      <View className="w-[90%] max-w-[480px] mx-auto">
        <TextElement
          designVariation="main-title"
          fontFamily="pachang"
          className="text-[24px]"
        >
          Manila
        </TextElement>
      </View>

      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View
          style={[cardStyle]}
          className="mx-3 bg-[#0D0D0D] rounded-[20px] overflow-hidden border-[1px] border-white w-[-350px] h-[550px] top-[10px] mt-4"
        >
          {/* Spots here */}
          <View className="flex-1 p-6 pb-4">{renderSpotView()}</View>
          <Animated.View style={overlayStyle} />
        </Animated.View>
      </PanGestureHandler>

      <View className="absolute bottom-0 left-0 right-0 flex-row justify-center items-center space-x-8">
        <TouchableOpacity
          onPress={() => {
            translateX.value = withSpring(-width * 1.5);
            runOnJS(handleSwipeLeft)();
          }}
          className="w-[80px] h-[80px] rounded-full bg-black items-center justify-center border-[1px] border-white shadow-lg"
        >
          <Image
            source={IMAGES.playScreen.cross} 
            className="w-[61px] h-[61px]"
          />
        </TouchableOpacity>

        <TouchableOpacity className="w-[54px] h-[54px] rounded-full bg-black items-center justify-center border-[1px] border-white shadow-lg">
          <Image
            source={IMAGES.playScreen.swap}
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
            source={IMAGES.playScreen.matchmaker} 
            className="w-[60.6px] h-[60px] rotate-[8deg]"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QueuePlayScreen;
