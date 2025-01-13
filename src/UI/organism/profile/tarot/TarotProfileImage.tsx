import { View } from 'react-native';
import { ImageProps } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import CrossBgIcon from '@/UI/assets/svg/CrossBgIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CustomImage from '@/UI/atoms/image/CustomImage';
import TextElement from '@/UI/atoms/text/TextElement';

import type { TarotProfileImageSize } from '@/lib/types/tarot';

interface TypeTarotProfileImageProps
	extends Omit<ImageProps, 'source' | 'placeholder'> {
	imageUrl: string | null | undefined;
	tarotColors: string[] | null;
	showPickImageButton?: boolean;
	customContainerStyles?: string;
	imageSize?: TarotProfileImageSize;
	tarotCode?: string | null;
	testID?: string;
	width?: number;
	height?: number;
	onPressPickImage?: () => Promise<void>;
}

const TarotProfileImage = ({
	tarotCode,
	imageUrl,
	tarotColors,
	onPressPickImage,
	showPickImageButton = false,
	imageSize = 'lg',
	width = 200,
	height = 200,
	customContainerStyles = '',
	...props
}: TypeTarotProfileImageProps) => {
	let imageContainerStyle = '';
	let imageSizeStyle = '';
	let tarotCodeStyles = '';
	let tarotContainerStyles = '';
	let tarotSubContainerStyles = '';
	let addPhotoButtonStyles = 'right-0 bottom-0';

	if (imageSize === 'xs') {
		imageContainerStyle = 'w-[30px] h-[30px]';
		imageSizeStyle = 'w-[25px] h-[25px]';
		tarotCodeStyles = 'text-xs';
		tarotContainerStyles = 'bottom-[-10px]';
		tarotSubContainerStyles = 'border-2 px-3';
	}

	if (imageSize === 'md') {
		imageContainerStyle = 'w-[65px] h-[65px]';
		imageSizeStyle = 'w-[60px] h-[60px]';
		tarotCodeStyles = 'text-sm';
		tarotContainerStyles = 'bottom-[-16px]';
		tarotSubContainerStyles = 'border-3 px-3';
	}

	if (imageSize === 'sm') {
		imageContainerStyle = 'w-[85px] h-[85px]';
		imageSizeStyle = 'w-[80px] h-[80px]';
		tarotCodeStyles = 'text-xs';
		tarotContainerStyles = 'bottom-[-14px]';
		tarotSubContainerStyles = 'border-2 px-3';
	}
	if (imageSize === 'lg') {
		imageContainerStyle = 'w-[215px] h-[215px]';
		imageSizeStyle = 'w-[200px] h-[200px]';
		tarotCodeStyles = 'text-xl';
		tarotContainerStyles = 'bottom-[-20px]';
		tarotSubContainerStyles = 'border-4 px-4';
	}
	if (imageSize === 'medium') {
		imageContainerStyle = 'w-[145px] h-[145px]';
		imageSizeStyle = 'w-[130px] h-[130px]';
		tarotCodeStyles = 'text-xl';
		tarotContainerStyles = 'bottom-[-20px]';
		tarotSubContainerStyles = 'border-2 px-4';
		addPhotoButtonStyles = 'right-[-10px] bottom-[-10px]';
	}

	return (
		<View
			className={`flex flex-row justify-center items-center mt-4 mb-6 relative ${imageContainerStyle} ${customContainerStyles}`}
			testID='tarot-profile-image'
		>
			{tarotColors && tarotColors.length >= 2 && (
				<LinearGradient
					colors={tarotColors}
					className='absolute top-0 left-0 right-0 bottom-0 rounded-full w-full h-full'
					testID='gradient-background'
				/>
			)}
			<CustomImage
				testID='profile-image'
				className={`object-contain rounded-full ${imageSizeStyle}`}
				imageSrc={imageUrl}
				width={width}
				height={height}
				typeDefaultImage='profile'
				{...props}
			/>
			{showPickImageButton && (
				<ButtonPrimary
					buttonStyles={`absolute z-10 ${addPhotoButtonStyles}`}
					designVariation='ghost'
					onPress={onPressPickImage}
					testID='pick-image-button'
				>
					<CrossBgIcon borderColor='#000' />
				</ButtonPrimary>
			)}
			{tarotCode && (
				<View
					className={`absolute left-0 right-0 flex flex-row justify-center ${tarotContainerStyles}`}
				>
					<View
						className={`bg-white border-black rounded-full ${tarotSubContainerStyles}`}
					>
						<TextElement
							textStyles={`text-black font-bold ${tarotCodeStyles}`}
							testID='profile-tarot-code'
						>
							{tarotCode}
						</TextElement>
					</View>
				</View>
			)}
		</View>
	);
};

export default TarotProfileImage;
