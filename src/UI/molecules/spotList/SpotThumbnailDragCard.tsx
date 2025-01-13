import { Image, View } from 'react-native';

import { useAppStore } from '@/lib/store/store';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import DefaultImage from '@/images/default-image.png';
import GripVerticalIcon from '@/svg/GripVerticalIcon';
import SavedIcon from '@/UI/assets/svg/SavedIcon';
import HeartIcon from '@/UI/assets/svg/HeartIcon';
import BeenHereIcon from '@/UI/assets/svg/BeenHereIcon';
import { TypeStatusTagsSchema } from '@/lib/types/spot';
import { useShallow } from 'zustand/react/shallow';

type SpotThumbnailDragCardProps = {
	small_image: string | null;
	name: string;
	isSpotListOwner: boolean;
	owner_status_tags: TypeStatusTagsSchema;
	viewer_status_tags: TypeStatusTagsSchema;
	drag?: () => void;
	disabled?: boolean;
};

const SpotThumbnailDragCard = ({
	small_image,
	name,
	owner_status_tags,
	viewer_status_tags,
	isSpotListOwner,
	drag,
	disabled,
}: SpotThumbnailDragCardProps) => {
	const { isReorderingSpotListActive, isLoading } = useAppStore(
		useShallow((state) => ({
			isReorderingSpotListActive: state.isReorderingSpotListActive,
			isLoading: state.isLoading,
		})),
	);

	const spotImage = small_image ? { uri: small_image } : DefaultImage;

	const activeOnLongPress = isReorderingSpotListActive ? drag : undefined;

	const onClickCardToDrag = !isLoading ? activeOnLongPress : undefined;

	const ownerStatusTagsSorted = owner_status_tags;
	const viewerStatusTagsSorted = viewer_status_tags;

	const statusToShow = isSpotListOwner
		? ownerStatusTagsSorted
		: viewerStatusTagsSorted;

	const hasStatusBeenTo = statusToShow.is_been_to;
	const hasStatusBucked = statusToShow.is_saved;
	const hasStatusFavorite = statusToShow.is_like_spot;

	return (
		<ButtonPrimary
			designVariation='ghost'
			buttonStyles={`  border border-transparent my-2 p-0 ${
				disabled ? 'bg-middle-gray border-gray/50' : ''
			}`}
			isReactNodeContent
			nodeContentStyles='flex flex-row  gap-2  '
			onLongPress={onClickCardToDrag}
			disabled={isLoading}
		>
			<Image
				source={spotImage}
				width={100}
				height={100}
				className='rounded-md '
			/>
			<View
				className='flex flex-row justify-around flex-1'
				style={{
					columnGap: 10,
				}}
			>
				<View className='flex-1 '>
					<TextElement
						numberOfLines={1}
						textStyles='text-gray font-bold mb-1 text-sm'
					>
						{name}
					</TextElement>
					<View className='flex-row items-center mt-2  ' style={{ gap: 5 }}>
						<HeartIcon
							color='#B0B0B0'
							fill={hasStatusFavorite ? '#B0B0B0' : ''}
							width={25}
							height={25}
						/>
						<BeenHereIcon isActive={hasStatusBeenTo} width={25} height={25} />
						<SavedIcon
							color='#B0B0B0'
							fill={hasStatusBucked ? '#B0B0B0' : ''}
							width={25}
							height={25}
						/>
					</View>
				</View>
				{isSpotListOwner && isReorderingSpotListActive && (
					<View className='px-0'>
						<GripVerticalIcon />
					</View>
				)}
			</View>
		</ButtonPrimary>
	);
};

export default SpotThumbnailDragCard;
