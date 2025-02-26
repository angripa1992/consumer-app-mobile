type ImageType = {
    [key: string]: any;
  };
  
  export const IMAGES: ImageType = {
    playScreen: {
      cross: require("@/UI/assets/images/play-screen/cross.png"),
      swap: require("@/UI/assets/images/play-screen/swap.png"),
      matchmaker: require("@/UI/assets/images/play-screen/matchmaker-icon.png"),
    },
    textures: {
      greenTextureHeader: require("@/UI/assets/images/textures/green-texture-header.png"),
    },
    bgMatch: {
      match: require("@/UI/assets/images/play-screen/matchbg.png"),
    },
  };
