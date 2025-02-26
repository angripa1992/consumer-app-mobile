import { useEffect } from "react";
import { Animated } from "react-native";

export const useMatchAnimations = () => {
  const slideAnim = new Animated.Value(-500);
  const textAnim1 = new Animated.Value(500);
  const textAnim2 = new Animated.Value(500);
  const textAnim3 = new Animated.Value(500);
  const textAnim4 = new Animated.Value(500);
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      speed: 1,
      bounciness: 5,
    }).start();

    Animated.stagger(200, [
      Animated.spring(textAnim1, {
        toValue: 0,
        useNativeDriver: true,
        speed: 1,
        bounciness: 5,
      }),
      Animated.spring(textAnim2, {
        toValue: 0,
        useNativeDriver: true,
        speed: 1,
        bounciness: 5,
      }),
      Animated.spring(textAnim3, {
        toValue: 0,
        useNativeDriver: true,
        speed: 3,
        bounciness: 5,
      }),
      Animated.spring(textAnim4, {
        toValue: 0,
        useNativeDriver: true,
        speed: 3,
        bounciness: 5,
      }),
    ]).start();
  }, []);

  return { slideAnim, textAnim1, textAnim2, textAnim3, textAnim4 };
};