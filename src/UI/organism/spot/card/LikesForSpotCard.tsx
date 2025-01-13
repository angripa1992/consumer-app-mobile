import { memo } from 'react';
import { View } from 'react-native';

import TextElement from '@/UI/atoms/text/TextElement';
import HeartIcon from '@/UI/assets/svg/HeartIcon';
import CustomImage from '@/UI/atoms/image/CustomImage';
import DotSeparator from '@/UI/assets/svg/DotSeparator';
import EmojiPickerButton from '../../feed/cards/EmojiPickerButton';

import type { TypeEmojiFromEvent } from '@/lib/types/emojis';
import { type TypeQueriesMutateDestination } from '@/lib/types/queries';
import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';

type TypeLikesForSpotCardProps = {
	queryMutateDestination: TypeQueriesMutateDestination;
	spotId?: number | string;
	eventId: number;
	username: string;
	emojis: TypeEmojiFromEvent[];
	dataCreated: string;
	profilePictureUrl?: string | null;
	userId: number;
};

const LikesForSpotCard = ({
	queryMutateDestination,
	spotId,
	eventId,
	username,
	emojis,
	dataCreated = '',
	profilePictureUrl,
	userId,
}: TypeLikesForSpotCardProps) => {
	const { appUserId } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			appUserId: state.user?.id,
		})),
	);

	const isAuthenticateUser = appUserId === userId;
	const userNameToShow = isAuthenticateUser ? 'You' : username;
	const visitedDateAsDate = new Date(dataCreated);
	const visitedDateFormatted = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: '2-digit',
	}).format(visitedDateAsDate);

	return (
		<View className='flex flex-row justify-start border-b border-b-filter-border/20 pb-6 mt-6'>
			<CustomImage
				testID='profile-image'
				className={`object-contain rounded-full w-[30px] h-[30px] mr-4`}
				imageSrc={profilePictureUrl}
				width={20}
				height={20}
				typeDefaultImage='profile'
			/>
			<View>
				<View className='flex flex-row justify-start'>
					<TextElement textStyles={`text-sm text-white mr-1`}>
						{userNameToShow}
					</TextElement>
					<HeartIcon color='#B0B0B0' width={20} height={20} />
					<TextElement textStyles={`text-sm text-white ml-1`}>
						liked the spot
					</TextElement>
				</View>
				<View
					className='flex-row items-center mt-3 flex-wrap'
					style={{ gap: 8 }}
				>
					<EmojiPickerButton
						emojis={emojis}
						eventId={eventId}
						queryMutateDestination={queryMutateDestination}
						spotId={spotId}
					/>
					<View>
						<DotSeparator />
					</View>
					<TextElement textStyles={`text-xs text-white`}>
						{visitedDateFormatted}
					</TextElement>
				</View>
			</View>
		</View>
	);
};

export default memo(LikesForSpotCard);
