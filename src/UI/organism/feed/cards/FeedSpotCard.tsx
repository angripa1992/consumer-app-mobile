import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useUpdateStatusTagsInSingleSpot } from '@/lib/hooks/useQueryStatusTags';
import { getStatusToUpdate } from '@/lib/helpers/statusTagsHelpers';
import { useAppStore } from '@/lib/store/store';
import { useGetSpotImage } from '@/lib/hooks/UseQuerySpot';

import CustomImage from '@/UI/atoms/image/CustomImage';
import TextElement from '@/UI/atoms/text/TextElement';
import SpotHeartButton from '@/UI/atoms/spot/SpotHeartButton';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import EmojiPickerButton from '@/UI/organism/feed/cards/EmojiPickerButton';
import TarotProfileImage from '../../profile/tarot/TarotProfileImage';

import type { TypeFeedTabFilter } from '@/lib/types/feed';
import type {
	TypeAddStatusTagsToSpot,
	TypeSpotStatusTagsEnum,
} from '@/lib/types/spot';
import type { TypeEmojiFromEvent } from '@/lib/types/emojis';

type TypeFeedSpotCardProps = {
	spotId: number;
	spotName: string;
	eventId: number;
	emojis: TypeEmojiFromEvent[];
	userCreatorId: number;
	googlePlaceLocationId: string | null;
	tripAdvisorLocationId: number | null;
	feedFilterValue: TypeFeedTabFilter;
	handleRedirectProfile: (userId: number) => void;
	handleRedirectSpot: (spotId: number) => void;
	tarotColors: string[];
	userImageUrl: string | null;
	spotImageUrl: string | null;
	smallImageUrl: string | null;
	eventMessage?: string;
	location?: string;
	spotLikeCounter?: number;
	isLikeSpot?: boolean;
	isSavedSpot?: boolean;
	testID?: string;
	isFirstItem: boolean;
};

const FeedSpotCard = ({
	spotId,
	spotName,
	eventId,
	emojis,
	userCreatorId,
	feedFilterValue,
	handleRedirectProfile,
	handleRedirectSpot,
	userImageUrl,
	spotImageUrl,
	googlePlaceLocationId,
	tripAdvisorLocationId,
	smallImageUrl,
	eventMessage,
	location,
	spotLikeCounter,
	isLikeSpot,
	isSavedSpot,
	testID,
	tarotColors,
	isFirstItem,
}: TypeFeedSpotCardProps) => {
	const { user: appUser } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const textStyles = '';
	const spotSmallImage = smallImageUrl || undefined;
	const { spotImage } = useGetSpotImage(
		{
			imageSize: 'medium',
			spotGooglePlacesId: googlePlaceLocationId,
			tripAdvisorLocationId,
		},
		!spotSmallImage || !spotImageUrl,
	);

	const spotImageToShow = useMemo(() => {
		if (spotImageUrl) {
			return spotImageUrl;
		}
		if (spotImage) {
			return spotImage;
		}
		if (spotSmallImage) {
			return spotSmallImage;
		}
		return null;
	}, [spotSmallImage, spotImage, spotImageUrl]);

	const queryMutateDestination = () => {
		if (feedFilterValue === 'community') return 'feed';
		if (feedFilterValue === 'following') return 'followingFeed';
		return 'creatorFeed';
	};

	const { mutateAsync: updateStatusTags } = useUpdateStatusTagsInSingleSpot({
		queryMutateDestination: queryMutateDestination(),
		spotId,
		userId: appUser?.id,
	});

	const onPressUpdateStatusTag = async (statusTag: TypeSpotStatusTagsEnum) => {
		const statusTagToUpdate = getStatusToUpdate({
			statusTag,
			hasStatusFavorite: isLikeSpot,
			hasStatusSaved: isSavedSpot,
		});
		const dataToSend: TypeAddStatusTagsToSpot = {
			spot_id: spotId,
			google_place_location_id: null,
			spotType: 'db',
			...statusTagToUpdate,
		};
		const dataStatusTagsEvent = {
			spot_id: spotId,
			spot_name: spotName,
			status_tag: statusTag,
		};

		await updateStatusTags({ values: dataToSend, dataStatusTagsEvent });
	};

	return (
		<>
			<TouchableOpacity
				activeOpacity={1}
				className='border-b border-b-filter-border/20 flex flex-row py-8'
				onPress={() => {
					handleRedirectSpot(spotId);
				}}
				style={{
					gap: 20,
				}}
				testID={testID}
			>
				<ButtonPrimary
					onPress={() => {
						handleRedirectProfile(userCreatorId);
					}}
					buttonStyles='w-[25px] h-[25px] !p-0'
					designVariation='custom'
					isReactNodeContent
				>
					<TarotProfileImage
						imageUrl={userImageUrl}
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
					<TextElement
						textStyles={`text-white text-sm font-bold ${textStyles}`}
						testID={`event-${testID}`}
					>
						{eventMessage}
					</TextElement>
					<TextElement
						textStyles={`text-white text-sm my-1 ${textStyles}`}
						testID={`name-${testID}`}
					>
						{spotName}
					</TextElement>
					<TextElement textStyles={`text-gray ${textStyles}`}>
						{location}
					</TextElement>
					<CustomImage
						imageSrc={spotImageToShow}
						className='h-[320px] mt-4 rounded-xl w-[96%]'
						contentFit='cover'
						contentPosition={'center'}
						width={500}
						height={500}
						priority={isFirstItem ? 'high' : 'normal'}
					/>
					<View
						className='flex-row items-center mt-3 flex-wrap'
						style={{ gap: 8 }}
					>
						<EmojiPickerButton
							emojis={emojis}
							eventId={eventId}
							queryMutateDestination={queryMutateDestination()}
						/>
						<SpotHeartButton
							onClickFavorite={() => {
								onPressUpdateStatusTag('Favorites');
							}}
							hasStatusFavorite={!!isLikeSpot}
							spotLikeCounter={spotLikeCounter}
						/>
					</View>
				</View>
			</TouchableOpacity>
		</>
	);
};

export default memo(FeedSpotCard);
