import TextElement from "@/UI/atoms/text/TextElement";
import { View, Image, TouchableOpacity, Share } from "react-native";
import HeaderFeed from "@/UI/layouts/feed/HeaderFeed";
import GreenTextureHeader from "@/UI/assets/images/textures/green-texture-header.png";
// import { i18nInstance } from "config/i18n";
// import * as Clipboard from 'expo-clipboard';

const InviteFriendsScreen = () => {
  const inviteCode = "KLIKITAPJJY"; // This should come from your backend/props

  // const copyToClipboard = async () => {
  //   await Clipboard.setStringAsync(inviteCode);
  //   // Optional: Show some feedback that code was copied
  // };

  const shareToSocial = async (
    platform: "tiktok" | "instagram" | "facebook"
  ) => {
    const message = `Join me on our app! Use my invite code: ${inviteCode}`;
    try {
      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <HeaderFeed />
      <Image
        source={GreenTextureHeader}
        className="absolute z-[-1] w-full top-[-220px] left-0 h-[500px]"
      />
      <View className="w-[90%] max-w-[480px] mx-auto mt-10">
        <TextElement designVariation="main-title" fontFamily="pachang">
          invite{"\n"}friends
        </TextElement>

        <View className="mt-8">
          <View className="bg-[#1A1A1A] p-4 rounded-[12px]">
            <TextElement className="text-[#B0B0B0]">{inviteCode}</TextElement>
          </View>
          <TouchableOpacity
            // onPress={copyToClipboard}
            className="bg-[#75FBCF] py-4 rounded-[100px] mt-4"
          >
            <TextElement className="text-center text-black">
              Copy Code
            </TextElement>
          </TouchableOpacity>
          <View
            className="mt-8 bg-[#222F2B80] border-2 border-dashed rounded-2xl border-[#214F41] p-4 w-full"
          >
            <TextElement
              className="text-white text-[28px]"
              fontFamily="pachang"
            >
              share your code
            </TextElement>
            <TextElement className="text-[#BFBFBF] mb-4 font-inter mt-2 text-[14px]">
              Click below to share to socials.
            </TextElement>
            <View className="mt-4">
              <TouchableOpacity
                onPress={() => shareToSocial("tiktok")}
                className="bg-[#243c34] p-4 rounded-[10px] mb-3 h-[48px] justify-center"
              >
                <TextElement className="text-white text-center">
                  Share on TikTok
                </TextElement>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => shareToSocial("instagram")}
                className="bg-[#243c34] p-4 rounded-[10px] mb-3 h-[48px] justify-center"
              >
                <TextElement className="text-white text-center">
                  Share on Instagram
                </TextElement>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => shareToSocial("facebook")}
                className="bg-[#243c34] p-4 rounded-[10px] h-[48px] justify-center"
              >
                <TextElement className="text-white text-center">
                  Share on Facebook
                </TextElement>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InviteFriendsScreen;
