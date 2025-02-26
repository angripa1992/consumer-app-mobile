import React from "react";
import { Animated, View, PanResponder } from "react-native";
import TextElement from "@/UI/atoms/text/TextElement";
import { useGetSingleSpot } from "@/lib/hooks/UseQuerySpot";
import SpinnerCup from "@/UI/atoms/spinner/SpinnerCup";
import SpotSingleView from "@/UI/organism/spot/SpotSingleView";
import { useNavigation } from "@react-navigation/native";
import { PlayScreenNavigationProp } from "@/lib/types/tabScreenParams";
import LinearGradient from "react-native-linear-gradient";

interface AnimatedTextsProps {
  textAnim1: Animated.Value;
  textAnim2: Animated.Value;
  textAnim3: Animated.Value;
  textAnim4: Animated.Value;
}

const AnimatedTexts = ({
  textAnim1,
  textAnim2,
  textAnim3,
  textAnim4,
}: AnimatedTextsProps) => {
  const navigation = useNavigation<PlayScreenNavigationProp>();
  const { singleSpot, isLoading } = useGetSingleSpot("223");
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderRelease: (_, gestureState) => {
          try {
            if (gestureState.dx > 50) {
              // Add error handling and logging
              console.log('Attempting navigation...');
              navigation.navigate('CollabList' as never);
              console.log('Navigation completed');
            }
          } catch (error) {
            console.error('Navigation error:', error);
          }
        },
      }),
    [navigation]
  );
  return (
    <View {...panResponder.panHandlers}>
      <Animated.View style={{ transform: [{ translateY: textAnim1 }] }}>
        <TextElement
          className="text-white text-base mb-8 text-center text-[20px] top-[380px]"
          fontFamily="pachang"
          designVariation="main-title"
          textStyles="mb-4"
        >
          it's a {"\n"}
        </TextElement>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY: textAnim2 }] }}>
        <TextElement
          className="text-white text-base mb-8 text-center text-[25px] mt-2 top-[330px]"
          fontFamily="pachang"
          designVariation="main-title"
          textStyles="mb-4"
        >
          match
        </TextElement>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateY: textAnim3 }] }}>
        <TextElement
          className="text-white text-[16px] color text-base mb-8 text-center top-[300px] text-gray"
          fontFamily="inter"
          designVariation="main-title"
          textStyles="mb-4"
        >
          We added this Spot to your Collab List. {"\n"}Swipe Right to Continue→
        </TextElement>
      </Animated.View>
      <Animated.View style={{ transform: [{ translateY: textAnim4 }] }}>
        <LinearGradient
          colors={["transparent", "rgba(117, 251, 207, 1);", "#75FBCF"]}
          className="absolute w-[380px] h-[600px] left-[10px] top-[150px] rounded-full"
          style={{
            zIndex: -1,
            opacity: 0.4,
            transform: [{ scaleY: 0.8 }, { scaleX: 1.8 }],  
            shadowOpacity: 0.8,
          }}
          start={{ x: 0.5, y: 0 }}    
          end={{ x: 0.5, y: 1 }}      
          locations={[0, 0.5, 1]}
        />
        <View className="flex-1 p-6 pb-4 w-[350px] h-[550px] bg-[#0D0D0D] top-[280px] rounded-[20px] overflow-hidden border-[1px] border-white mt-8">
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <SpinnerCup />
            </View>
          ) : (
            <SpotSingleView singleSpot={singleSpot} isQueueScreen={false} />
          )}
        </View>
      </Animated.View>
    </View>
  );
};



export default AnimatedTexts;
