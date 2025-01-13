import { View } from 'react-native';
import { Image } from 'expo-image';

import { useGetSpotImage } from '@/lib/hooks/UseQuerySpot';

import CustomImage from '@/UI/atoms/image/CustomImage';
import DefaultImageForListAndSpot from '@/images/default-color-image-for-spot-and-list.png';

import type { TypeSpotImagesAvailable } from '@/lib/types/spot';

interface SpotListGridImagesProps {
	spotsImages?: TypeSpotImagesAvailable[] | null;
}

const SpotListGridImages = ({ spotsImages }: SpotListGridImagesProps) => {
	const validSmallImages = spotsImages;

	const imageSize = 'small';
	const smallImageOne = validSmallImages?.[0]?.small_image ?? undefined;
	const smallImageTwo = validSmallImages?.[1]?.small_image ?? undefined;
	const smallImageThree = validSmallImages?.[2]?.small_image ?? undefined;
	const smallImageFour = validSmallImages?.[3]?.small_image ?? undefined;

	const tripAdvisorLocationIdOne =
		validSmallImages?.[0]?.tripadvisor_location_id;
	const tripAdvisorLocationIdTwo =
		validSmallImages?.[1]?.tripadvisor_location_id;
	const tripAdvisorLocationIdThree =
		validSmallImages?.[2]?.tripadvisor_location_id;
	const tripAdvisorLocationIdFour =
		validSmallImages?.[3]?.tripadvisor_location_id;

	const spotGooglePlacesIdOne = validSmallImages?.[0]?.google_place_location_id;
	const spotGooglePlacesIdTwo = validSmallImages?.[1]?.google_place_location_id;
	const spotGooglePlacesIdThree =
		validSmallImages?.[2]?.google_place_location_id;
	const spotGooglePlacesIdFour =
		validSmallImages?.[3]?.google_place_location_id;

	const { spotImage: imageOneFromApi } = useGetSpotImage(
		{
			imageSize,
			tripAdvisorLocationId: tripAdvisorLocationIdOne,
			spotGooglePlacesId: spotGooglePlacesIdOne,
		},
		!smallImageOne,
	);
	const { spotImage: imageTwoFromApi } = useGetSpotImage(
		{
			imageSize,
			tripAdvisorLocationId: tripAdvisorLocationIdTwo,
			spotGooglePlacesId: spotGooglePlacesIdTwo,
		},
		!smallImageOne,
	);
	const { spotImage: imageThreeFromApi } = useGetSpotImage(
		{
			imageSize,
			tripAdvisorLocationId: tripAdvisorLocationIdThree,
			spotGooglePlacesId: spotGooglePlacesIdThree,
		},
		!smallImageOne,
	);
	const { spotImage: imageFourFromApi } = useGetSpotImage(
		{
			imageSize,
			tripAdvisorLocationId: tripAdvisorLocationIdFour,
			spotGooglePlacesId: spotGooglePlacesIdFour,
		},
		!smallImageOne,
	);

	const imagesFromApi = [
		imageOneFromApi,
		imageTwoFromApi,
		imageThreeFromApi,
		imageFourFromApi,
	];

	const imagesFromDB = [
		smallImageOne,
		smallImageTwo,
		smallImageThree,
		smallImageFour,
	];

	const validImagesFromApi = imagesFromApi.filter((image) => image !== null);
	const validImagesFromApiLength = validImagesFromApi.length;

	const validImagesFromDB = imagesFromDB.filter((image) => image !== null);
	const validImagesFromDBLength = validImagesFromDB.length;

	const imageOne = validImagesFromApi[0] ?? validImagesFromDB[0] ?? null;
	const imageTwo = validImagesFromApi[1] ?? validImagesFromDB[1] ?? null;
	const imageThree = validImagesFromApi[2] ?? validImagesFromDB[2] ?? null;
	const imageFour = validImagesFromApi[3] ?? validImagesFromDB[3] ?? null;

	const classNameImagesContainer = () => {
		if (validImagesFromApiLength > 2 || validImagesFromDBLength > 2)
			return 'flex-col';

		return 'flex-row';
	};

	return (
		<View
			className='overflow-hidden rounded-lg flex-row h-[150px]'
			style={{ gap: 4 }}
		>
			{!imageOne && (
				<Image
					source={DefaultImageForListAndSpot}
					transition={150}
					className={'flex-1 w-full'}
				/>
			)}
			{imageOne && (
				<>
					<View
						className={`flex-1 ${classNameImagesContainer()} `}
						style={{ gap: 4 }}
					>
						<CustomImage
							imageSrc={imageOne}
							width={130}
							height={130}
							className={'flex-1 w-full'}
							typeDefaultImage='list'
							cachePolicy={'memory'}
							placeholder={{
								width: 50,
								height: 50,
								uri: smallImageOne,
							}}
						/>
						{imageFour && (
							<CustomImage
								imageSrc={imageFour}
								width={130}
								height={130}
								className='flex-[0.5_1_0] w-full'
								typeDefaultImage='list'
								cachePolicy={'memory'}
								placeholder={{
									width: 50,
									height: 50,
									uri: smallImageFour,
								}}
							/>
						)}
					</View>
					{imageTwo && (
						<View className='flex flex-col flex-1  ' style={{ gap: 4 }}>
							<CustomImage
								imageSrc={imageTwo}
								width={130}
								height={130}
								className={'flex-1 w-full'}
								typeDefaultImage='list'
								cachePolicy={'memory'}
								priority={'low'}
								placeholder={{
									width: 50,
									height: 50,
									uri: smallImageTwo,
								}}
							/>
							{imageThree && (
								<CustomImage
									imageSrc={imageThree}
									width={130}
									height={130}
									className='flex-1 w-full'
									typeDefaultImage='list'
									cachePolicy={'memory'}
									placeholder={{
										width: 50,
										height: 50,
										uri: smallImageThree,
									}}
								/>
							)}
						</View>
					)}
				</>
			)}
		</View>
	);
};

export default SpotListGridImages;
