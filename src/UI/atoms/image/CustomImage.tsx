import { Image, ImageProps, ImageSource } from 'expo-image';

import DefaultImageForListAndSpot from '@/images/default-color-image-for-spot-and-list.png';
import ProfileImageDefault from '@/images/Profile-default.png';
const BlurHashDefaultImage = 'LSP|_SF|xAS7_OQATws*^q-3M,Tb';
const BlurHashDefaultImageForSpotAndList = 'LXDvic}@U}M~.ix;VZV^EyJPobs.';

interface CustomImageProps extends Omit<ImageProps, 'source'> {
	typeDefaultImage?: 'profile' | 'spot' | 'list';
	width?: number;
	height?: number;
	imageSrc?: string | null;
	testID?: string;
	priority?: ImageProps['priority'];
}

const CustomImage = ({
	typeDefaultImage = 'spot',
	width = 50,
	height = 50,
	imageSrc,
	testID,
	priority = 'normal',
	...props
}: CustomImageProps) => {
	const defaultImage =
		typeDefaultImage === 'profile'
			? ProfileImageDefault
			: DefaultImageForListAndSpot;
	const defaultImagePlaceholder =
		typeDefaultImage === 'profile'
			? BlurHashDefaultImage
			: BlurHashDefaultImageForSpotAndList;

	const sourceUri: ImageSource | string = imageSrc
		? {
				uri: imageSrc,
				width,
				height,
			}
		: defaultImage;

	return (
		<Image
			source={sourceUri}
			placeholderContentFit='cover'
			transition={150}
			testID={testID}
			placeholder={defaultImagePlaceholder}
			cachePolicy='disk'
			priority={priority}
			{...props}
		/>
	);
};

export default CustomImage;
