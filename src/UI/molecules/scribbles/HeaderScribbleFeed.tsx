import { Image } from 'expo-image';
import { View } from 'react-native';

import { handleVisitDateFormat } from '@/lib/helpers/dates/visitedDateFormat';

import TextElement from '@/UI/atoms/text/TextElement';

import LikeScribbleImage from '@/UI/assets/images/scribbles/like-scribble.png';
import UnlikeScribbleImage from '@/UI/assets/images/scribbles/unlike-scribble.png';
import CustomImage from '@/UI/atoms/image/CustomImage';

type TypeHeaderScribbleFeedProps = {
	visitDate: string | null;
	creatorImage: string | null;
	creatorName: string;
	creatorUsername: string;
	isPositive: boolean;
};

const HeaderScribbleFeed = ({
	creatorImage,
	visitDate,
	creatorName,
	creatorUsername,
	isPositive,
}: TypeHeaderScribbleFeedProps) => {
	const visitedDateFormatted = handleVisitDateFormat(visitDate);

	return (
		<View className='flex flex-row justify-between items-center pb-5 mb-5 border-b border-b-[#1B1B1B]'>
			<View className='flex flex-row'>
				<CustomImage
					className='w-[45px] h-[45px] rounded-full'
					width={45}
					height={45}
					imageSrc={creatorImage}
					contentFit='cover'
					typeDefaultImage='profile'
				/>
				<View className='flex ml-5'>
					<View className='flex flex-row items-center' style={{ rowGap: 5 }}>
						<TextElement className={`text-white text-lg font-bold`}>
							{`${creatorName} •`}
						</TextElement>
						<TextElement className={`text-md text-[#757575] mt-[3px] ml-[4px]`}>
							{visitedDateFormatted}
						</TextElement>
					</View>
					<TextElement className={`text-[#757575] text-base mt-[-2px]`}>
						{creatorUsername}
					</TextElement>
				</View>
			</View>
			{isPositive ? (
				<Image className='w-[65px] h-[65px]' source={LikeScribbleImage} />
			) : (
				<Image className='w-[65px] h-[65px]' source={UnlikeScribbleImage} />
			)}
		</View>
	);
};

export default HeaderScribbleFeed;
