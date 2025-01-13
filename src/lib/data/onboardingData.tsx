import ScribblesTexture from '@/images/textures/scribbles-onboarding-textures.png';
import LikesTexture from '@/images/textures/likes-onboarding-texture.png';
import ListsTexture from '@/images/textures/lists-onboarding-textures.png';
import SpotsTexture from '@/images/textures/spots-onboarding-textures.png';

import HeartIcon from '@/UI/assets/svg/HeartIcon';
import LocationMarkerIcon from '@/UI/assets/svg/LocationMarkerIcon';
import SavedIcon from '@/UI/assets/svg/SavedIcon';
import ScribbleIcon from '@/UI/assets/svg/ScribbleIcon';

export const howItWorksOnBoardingItems = [
	{
		title: 'likes',
		description: 'howItWorksLikes',
		icon: <HeartIcon width={35.1} height={30} color='#fff' />,
		image: LikesTexture,
	},
	{
		title: 'scribbles',
		description: 'howItWorksScribbles',
		icon: <ScribbleIcon width={27} height={29.25} color='#fff' />,
		image: ScribblesTexture,
	},
	{
		title: 'lists',
		description: 'howItWorksLists',
		icon: <SavedIcon isBig width={25.25} height={25.5} color='#fff' />,
		image: ListsTexture,
	},
	{
		title: 'spots',
		description: 'howItWorksSpots',
		icon: <LocationMarkerIcon width={29} height={28.97} color='#fff' />,
		image: SpotsTexture,
	},
];
