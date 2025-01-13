import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { PressableProps, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '@/lib/store/store';
import { useUpdateFollowSpotListQuery } from '@/lib/hooks/useQueryFollow';
import { formatBigNumbers } from '@/lib/helpers/numbers/formatBigNumbers';

import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import SpotListGridImages from '@/UI/molecules/spotList/SpotListGridImages';
import EyeIcon from '@/svg/EyeIcon';
import LocationMarkerIcon from '@/svg/LocationMarkerIcon';
import ListSaveButton from '@/UI/atoms/list/ListSaveButton';

import type { TypeSpotImagesAvailable } from '@/lib/types/spot';
import type { TypeFollow } from '@/lib/types/follows';
import type { TypeSpotListDataEvent } from '@/lib/types/spotList';
import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type {
	DiscoveryScreenNavigationProp,
	ListNavigationRouteParams,
	ProfileNavigationRouteParams,
} from '@/lib/types/tabScreenParams';

type TypeSpotListThumbnailProps = {
	title: string;
	queryMutateDestination: TypeQueriesMutateDestination;
	creator: string;
	viewsCount: number;
	likesCount: number;
	locationCount: number;
	spotListId: number;
	userId?: number;
	cardContainerStyles?: string;
	spotsImages?: TypeSpotImagesAvailable[] | null;
	categoryName?: string;
	spotId?: number;
	isFollowing?: boolean;
	searchQuery?: string;
	currentCity?: string;
	currentUserId?: number;
	customOnPressCard?: () => void;
	disabledFollowList?: boolean;
	testID?: string;
	customContainerButtonsStyles?: string;
};

const SpotListThumbnail = ({
	title,
	queryMutateDestination,
	creator,
	viewsCount,
	likesCount,
	locationCount,
	spotListId,
	userId,
	cardContainerStyles = 'flex-1',
	spotsImages,
	categoryName,
	spotId,
	isFollowing,
	searchQuery,
	currentCity,
	currentUserId,
	customOnPressCard,
	disabledFollowList,
	customContainerButtonsStyles = 'flex-[0_2]',
	testID,
}: TypeSpotListThumbnailProps) => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const isSpotListOwner = user?.id === userId;
	const navigation = useNavigation<
		ListNavigationRouteParams &
			DiscoveryScreenNavigationProp &
			ProfileNavigationRouteParams
	>();

	const dataListEvent: TypeSpotListDataEvent = {
		list_id: spotListId,
		list_name: title,
		list_creator: creator,
	};

	const { mutateAsync: followSpotList } = useUpdateFollowSpotListQuery({
		queryMutateDestination,
		dataListEvent,
		spotListId,
		spotId,
		categoryName,
		searchQuery,
		currentCity,
		currentUserId,
	});

	const onClickUsername: PressableProps['onPress'] = (e) => {
		e.stopPropagation();

		if (!userId) return;

		navigation.push('ProfileScreen', { userId });
	};

	const onFollowList: PressableProps['onPress'] = (e) => {
		if (disabledFollowList) return;
		e.stopPropagation();

		if (isSpotListOwner) return;

		const followObject: TypeFollow = {
			following_spot_list_id: spotListId,
		};

		followSpotList(followObject);
	};

	const onPressCard = () => {
		if (customOnPressCard) {
			customOnPressCard();
			return;
		}

		navigation.push('SingleList', { spotListId });
	};

	return (
		<TouchableOpacity
			activeOpacity={1}
			className={`mx-0 my-2 flex ${cardContainerStyles}`}
			onPress={onPressCard}
			testID={testID}
		>
			<TextElement
				textStyles='text-white text-sm mb-2 flex-1 font-medium'
				numberOfLines={2}
				testID='spot-list-title'
			>
				{title}
			</TextElement>
			<SpotListGridImages spotsImages={spotsImages} />
			<View
				className={` ${customContainerButtonsStyles} mt-1  flex flex-row justify-between w-full items-end`}
				style={{ gap: 5 }}
			>
				<ListSaveButton
					onPressSaveList={onFollowList}
					isSavedList={!!isFollowing}
					buttonTestID='list-thumbnail-heart-button'
					listSavesCounter={likesCount}
					disableButton={isSpotListOwner}
				/>
				<View
					className='flex flex-row items-center'
					testID='list-thumbnail-spot-counter'
				>
					<View className='mt-[1px]'>
						<LocationMarkerIcon width={22} height={22} />
					</View>
					<TextElement
						textStyles='text-gray ml-1 text-xs'
						testID='spot-list-location-count'
					>
						{locationCount}
					</TextElement>
				</View>
				<View
					className='flex flex-row items-center'
					testID='list-thumbnail-views-counter'
				>
					<EyeIcon width={22} height={22} />
					<TextElement
						textStyles='text-gray ml-1 text-xs'
						testID='spot-list-view-count'
					>
						{formatBigNumbers(viewsCount)}
					</TextElement>
				</View>
			</View>
			<ButtonPrimary
				designVariation='ghost'
				buttonStyles='p-0 mt-1'
				isReactNodeContent
				onPress={onClickUsername}
				testID='list-thumbnail-creator'
			>
				<TextElement textStyles='text-gray ' numberOfLines={1}>
					{creator}
				</TextElement>
			</ButtonPrimary>
		</TouchableOpacity>
	);
};

export default memo(SpotListThumbnail);
