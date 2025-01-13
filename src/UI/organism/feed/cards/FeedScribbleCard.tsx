import { useCallback, useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

import { i18nInstance } from 'config/i18n';
import { useRenderScribbleImages } from '@/lib/hooks/scribble/renderScribbleImages';

import TextElement from '@/UI/atoms/text/TextElement';
import LikeThumbIcon from '@/UI/assets/svg/LikeThumbIcon';
import DotSeparator from '@/UI/assets/svg/DotSeparator';
import EmojiPickerButton from '../../feed/cards/EmojiPickerButton';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import { TypeFeedTabFilter } from '@/lib/types/feed';
import TarotProfileImage from '../../profile/tarot/TarotProfileImage';
import { handleVisitDateFormat } from '@/lib/helpers/dates/visitedDateFormat';

import type { TypeEmojiFromEvent } from '@/lib/types/emojis';
import { memo } from 'react';
import type { TypeScribbleFeed } from '@/lib/types/scribbles';
import FeedScribbleModal from '../../scribble/FeedScribbleModal';

type TypeScribblesForSpotCardProps = {
	creatorName: string;
	eventId: number;
	spotId: number;
	scribbleId: number;
	username: string;
	reviewDescription: string | null;
	spotName: string;
	isPositive: boolean;
	emojis: TypeEmojiFromEvent[];
	visitedDate: string | null;
	feedFilterValue: TypeFeedTabFilter;
	profilePictureUrl: string | null;
	handleRedirectProfile: (userId: number) => void;
	handleRedirectSpot: (spotId: number) => void;
	creatorId: number;
	testID?: string;
	tarotColors: string[];
	scribbleImages?: string[];
};

const FeedScribbleCard = ({
	creatorName,
	eventId,
	username,
	emojis,
	reviewDescription,
	visitedDate,
	feedFilterValue,
	profilePictureUrl,
	isPositive,
	spotName,
	spotId,
	scribbleId,
	handleRedirectProfile,
	handleRedirectSpot,
	creatorId,
	testID,
	tarotColors,
	scribbleImages,
}: TypeScribblesForSpotCardProps) => {
	const scribbleModalRef = useRef<BottomSheetModal>(null);

	const visitedDateFormatted = handleVisitDateFormat(visitedDate);
	const { scribbleImagesToRender, modalToRender, onPressImage } =
		useRenderScribbleImages(scribbleImages);

	const queryMutateDestination = () => {
		if (feedFilterValue === 'community') return 'feed';
		if (feedFilterValue === 'following') return 'followingFeed';
		return 'creatorFeed';
	};

	const hasScribblesImages =
		scribbleImages &&
		Array.isArray(scribbleImages) &&
		scribbleImages.length > 0;

	const onPressScribbleCard = useCallback(() => {
		scribbleModalRef.current?.present();
	}, []);

	return (
		<>
			<FeedScribbleModal
				spotId={spotId}
				eventId={eventId}
				scribbleEmojis={emojis}
				reviewDescription={reviewDescription}
				spotName={spotName}
				creatorImage={profilePictureUrl}
				creatorName={creatorName}
				creatorUsername={username}
				isPositive={isPositive}
				scribbleImages={scribbleImages}
				visitDate={visitedDate}
				scribbleModalRef={scribbleModalRef}
				queryMutateDestination={queryMutateDestination()}
				onPressImage={onPressImage}
			/>
			{modalToRender()}
			<TouchableOpacity
				activeOpacity={1}
				className='border-b border-b-filter-border/20 flex flex-row py-8'
				onPress={onPressScribbleCard}
				style={{
					gap: 20,
				}}
				testID={testID}
			>
				<ButtonPrimary
					onPress={() => {
						handleRedirectProfile(creatorId);
					}}
					buttonStyles='w-[25px] h-[25px] !p-0'
					designVariation='custom'
					isReactNodeContent
				>
					<TarotProfileImage
						imageUrl={profilePictureUrl}
						width={100}
						height={100}
						customContainerStyles='m-0'
						testID={`image-${testID}`}
						imageSize='xs'
						contentFit='cover'
						contentPosition={'center'}
						tarotColors={tarotColors}
					/>
				</ButtonPrimary>
				<View className='flex-1'>
					<View className='flex flex-row justify-start items-center flex-wrap'>
						<TextElement
							textStyles={`text-sm text-white font-semibold mr-[4px]`}
						>
							{username}
						</TextElement>
						<TextElement textStyles={`text-sm text-white font-semibold`}>
							<LikeThumbIcon isPositive={isPositive} />{' '}
							{i18nInstance.t('scribbledOn')}
						</TextElement>
						<ButtonPrimary
							designVariation='custom'
							buttonStyles='!p-0'
							textStyles='text-sm text-white font-semibold'
							onPress={() => handleRedirectSpot(spotId)}
							hitSlop={15}
						>{` ${spotName}`}</ButtonPrimary>
					</View>
					<TextElement
						textStyles={`text-sm text-white mt-2 text-gray`}
						testID={`name-${testID}`}
					>
						{reviewDescription}
					</TextElement>
					{hasScribblesImages && <View>{scribbleImagesToRender()}</View>}
					<View
						className='flex-row items-center flex-wrap mt-1'
						style={{ gap: 8 }}
					>
						<EmojiPickerButton
							emojis={emojis}
							eventId={eventId}
							queryMutateDestination={queryMutateDestination()}
							spotId={spotId}
						/>
						{visitedDateFormatted && (
							<>
								<View>
									<DotSeparator />
								</View>
								<TextElement textStyles={`text-xs text-white`}>
									{visitedDateFormatted}
								</TextElement>
							</>
						)}
					</View>
				</View>
			</TouchableOpacity>
		</>
	);
};

export default memo(FeedScribbleCard);
