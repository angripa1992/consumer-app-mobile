import { useMemo } from 'react';
import { View } from 'react-native';

import { useGetSpotImage } from '@/lib/hooks/UseQuerySpot';
import { APP_WIDTH } from '@/lib/utils/constants';

import CustomCarrousel from '@/UI/atoms/carrousel/CustomCarrousel';
import CustomImage from '@/UI/atoms/image/CustomImage';

interface SpotImagesProps {
	spotLikeCounter: number;
	smallImage: string | null;
	tripAdvisorLocationId: number | null;
	googlePlaceLocationId: string | null;
	spotImages: string[];
}

const SpotImages = ({
	spotLikeCounter,
	smallImage,
	tripAdvisorLocationId,
	googlePlaceLocationId,
	spotImages,
}: SpotImagesProps) => {
	const spotSmallImage = smallImage || undefined;
	const [spotDefaultImage, ...restImages] = spotImages;
	const { spotImage: spotImageFromTripadvisor } = useGetSpotImage(
		{
			tripAdvisorLocationId,
			spotGooglePlacesId: googlePlaceLocationId,
			imageSize: 'medium',
		},
		!spotDefaultImage,
	);
	const spotImageToShow = useMemo(
		() => spotDefaultImage ?? spotImageFromTripadvisor,
		[spotDefaultImage, spotImageFromTripadvisor],
	);

	const spotImagesToShow = [spotImageToShow, ...restImages];

	return (
		<View
			className={`mt-4  ${spotLikeCounter === 0 ? 'mb-4' : ''} flex flex-row justify-center`}
		>
			{spotImagesToShow.length > 1 ? (
				<View
					style={{
						flex: 1,
					}}
				>
					<CustomCarrousel
						data={spotImagesToShow}
						renderItem={({ item, index }) => (
							<View
								key={index}
								style={{
									flex: 1,
								}}
							>
								<CustomImage
									imageSrc={item}
									style={{
										flex: 1,
									}}
									width={500}
									height={500}
									testID={`spot-screen-image-slider-${index}`}
									cachePolicy={'memory'}
									placeholder={{
										width: 50,
										height: 50,
										uri: index === 0 ? spotSmallImage : undefined,
									}}
								/>
							</View>
						)}
						width={APP_WIDTH}
						height={320}
						dotColor='#B0B0B0'
						activeDotColor='#ffffff'
						autoPlay={true}
						autoPlayInterval={5000}
						panGestureHandlerProps={{
							activeOffsetX: [-10, 10],
						}}
					/>
				</View>
			) : (
				<CustomImage
					imageSrc={spotImageToShow}
					className={`w-full h-[320px] rounded-lg`}
					width={500}
					height={500}
					testID='spot-screen-image'
					cachePolicy={'memory'}
					contentFit='cover'
					placeholder={{
						width: 50,
						height: 50,
						uri: spotSmallImage,
					}}
				/>
			)}
		</View>
	);
};

export default SpotImages;
