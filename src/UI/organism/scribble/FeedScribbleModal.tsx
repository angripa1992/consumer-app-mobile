import { RefObject } from 'react';
import { View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { i18nInstance } from 'config/i18n';
import { capitalizeFirstLetter } from '@/lib/helpers/strings/capitalizeFirstLetter';

import EmojiPickerButton from '../feed/cards/EmojiPickerButton';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import HeaderScribbleFeed from '@/UI/molecules/scribbles/HeaderScribbleFeed';
import TextElement from '@/UI/atoms/text/TextElement';

import Carousel from 'react-native-reanimated-carousel';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomImage from '@/UI/atoms/image/CustomImage';
import { APP_WIDTH } from '@/lib/utils/constants';
import { TypeEmojiFromEvent } from '@/lib/types/emojis';
import { TypeQueriesMutateDestination } from '@/lib/types/queries';

type TypeScribbleModal = {
	spotId: number;
	eventId: number;
	scribbleImages: string[] | undefined;
	spotName: string;
	reviewDescription: string | null;
	scribbleEmojis: TypeEmojiFromEvent[];
	scribbleModalRef: RefObject<BottomSheetModal>;
	queryMutateDestination: TypeQueriesMutateDestination;
	visitDate: string | null;
	creatorImage: string | null;
	creatorName: string;
	creatorUsername: string;
	isPositive: boolean;
	onPressImage: (index: number) => void;
};

const FeedScribbleModal = ({
	spotId,
	eventId,
	scribbleEmojis,
	reviewDescription,
	spotName,
	scribbleImages = [],
	scribbleModalRef,
	queryMutateDestination,
	visitDate,
	creatorImage,
	creatorName,
	creatorUsername,
	isPositive,
	onPressImage,
}: TypeScribbleModal) => {
	const snapPoints = ['64%'];

	return (
		<CustomBottomSheetModal
			snapPoints={snapPoints}
			bottomSheetModalRef={scribbleModalRef}
		>
			<HeaderScribbleFeed
				creatorImage={creatorImage}
				creatorName={creatorName}
				creatorUsername={creatorUsername}
				isPositive={isPositive}
				visitDate={visitDate}
			/>
			<TextElement className={`text-white text-lg font-bold`}>
				{`${capitalizeFirstLetter(i18nInstance.t('scribbledOn'))} ${spotName}`}
			</TextElement>
			<TextElement className={`text-md text-[#8A8A8A] mt-3`}>
				{reviewDescription}
			</TextElement>
			{Array.isArray(scribbleImages) && scribbleImages.length > 0 && (
				<View className='mt-4'>
					<Carousel
						data={scribbleImages}
						loop={false}
						pagingEnabled={true}
						renderItem={({ item, index }) => (
							<TouchableOpacity
								className={`w-[90%] h-[190px] rounded-xl`}
								onPress={() => onPressImage(index)}
							>
								<CustomImage
									imageSrc={item}
									className={`h-full rounded-xl w-full`}
									width={400}
									height={400}
									testID={`spot-screen-image-slider-${index}`}
									cachePolicy={'memory'}
									placeholder={{
										width: 50,
										height: 50,
									}}
									contentFit='cover'
								/>
							</TouchableOpacity>
						)}
						width={APP_WIDTH - 120}
						height={190}
						style={{
							borderRadius: 12,
							overflow: 'visible',
						}}
					/>
				</View>
			)}
			<View className='flex-row items-center flex-wrap mt-6' style={{ gap: 8 }}>
				<EmojiPickerButton
					emojis={scribbleEmojis}
					eventId={eventId}
					queryMutateDestination={queryMutateDestination}
					spotId={spotId}
				/>
			</View>
		</CustomBottomSheetModal>
	);
};

export default FeedScribbleModal;
