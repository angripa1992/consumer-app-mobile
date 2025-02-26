import TextElement from "@/UI/atoms/text/TextElement";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";
import { View, Image, ImageBackground, Animated } from "react-native";
import GreenTextureHeader from "@/UI/assets/images/textures/green-texture-header.png";
import { IMAGES } from "@/UI/molecules/play/images";
import { useMatchAnimations } from "@/lib/hooks/useMatchAnimation";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { PlayScreenNavigationProp } from "@/lib/types/tabScreenParams";

const CollabListScreen = () => {
  const { slideAnim } = useMatchAnimations();
  const navigation = useNavigation<PlayScreenNavigationProp>();
  return (
    <View>
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

        <View className="items-center mt-20 top-[147px]">
          <View className="flex-row mb-4">
            <Image
              source={require("@/UI/assets/images/play-screen/person_icon.png")}
              className="w-16 h-16 rounded-full "
            />
            <Image
              source={require("@/UI/assets/images/play-screen/person_icon.png")}
              className="w-16 h-16 rounded-full -ml-2"
            />
          </View>

          <TextElement className="text-white text-2xl mb-4 text-[20px]" fontFamily="pachang">
            matches made
          </TextElement>
          <TextElement className="text-white text-5xl font-bold mb-6 text-[40px]" fontFamily="pachang">
            congrats
          </TextElement>

          <TextElement className="text-white">We added</TextElement>
          <TextElement className="text-white text-6xl font-bold my-4 text-[40px]">
            24
          </TextElement>
          <TextElement className="text-white text-center font-inter">
            Spots to a new collaborative list on your account.
          </TextElement>

          <TextElement className="text-white mt-4 font-inter">
            Have fun exploring!
          </TextElement>
          
          <View className="flex-row mt-12 w-full justify-center px-4 gap-x-2">

          <TouchableOpacity className="flex-1 bg-[#7FFFD4] py-4 rounded-full w-[160px]"
                onPress={() => navigation.navigate('PlayAgain')}>
                  <TextElement className="text-center text-black font-semibold">
                    Play Again
                  </TextElement>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 py-4 rounded-full border border-white w-[160px]"
              >
                  <TextElement className="text-center text-white font-semibold">
                    Back to Games
                  </TextElement>
                </TouchableOpacity>
            
          </View>

        </View>
      </Animated.View>
    </View>
  );
};


export default CollabListScreen;
