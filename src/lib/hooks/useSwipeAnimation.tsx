import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { StackNavigationProp } from "@react-navigation/stack";
import { Alert, Dimensions } from "react-native";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = 120;
const ROTATION_FACTOR = 0.3;

type SwipeAnimationProps = {
  translateX: Animated.SharedValue<number>;
  cardRotate: Animated.SharedValue<number>;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  refetchSpots?: () => void;
};

export const useSwipeAnimation = ({
  translateX,
  cardRotate,
  onSwipeLeft,
  onSwipeRight,
}: SwipeAnimationProps) => {
  const [noMoreSpots, setNoMoreSpots] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const handleNoMoreSpots = () => {
    setNoMoreSpots(true);
    Alert.alert(
      "No More Spots",
      "You've seen all available spots in this area!",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("SelectCityScreen");
          },
        },
      ]
    );
  };
  
  const handleSwipeLeft = () => {
    handleNoMoreSpots();
    if (onSwipeLeft) onSwipeLeft();
  };

  const handleSwipeRight = () => {
    navigation.navigate("Match");
    if (onSwipeRight) onSwipeRight();
  };
  const panGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      cardRotate.value = (translateX.value / width) * ROTATION_FACTOR;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(
          Math.sign(event.translationX) * width * 1.5
        );
        if (event.translationX > 0) {
          runOnJS(handleSwipeRight)();
        } else {
          runOnJS(handleSwipeLeft)();
        }
      } else {
        translateX.value = withSpring(0);
        cardRotate.value = withSpring(0);
      }
    },
  });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width * 1.5, 0, width * 1.5],
      [-30, 0, 30]
    );

    return {
      transform: [{ translateX: translateX.value }, { rotate: `${rotate}deg` }],
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      translateX.value,
      [-width * 0.5, 0, width * 0.5],
      [
        "rgba(255, 40, 246, 0.3)",
        "rgba(0, 0, 0, 0)",
        "rgba(117, 251, 207, 0.3)",
      ]
    );

    return {
      position: "absolute",
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   bottom: 0,
      zIndex: 1,
      backgroundColor,
    };
  });

  return {
    panGestureEvent,
    cardStyle,
    overlayStyle,
  };
};
