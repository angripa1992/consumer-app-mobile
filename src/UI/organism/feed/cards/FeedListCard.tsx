import { memo, useMemo } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useUpdateFollowSpotListQuery } from '@/lib/hooks/useQueryFollow';
import { useAppStore } from '@/lib/store/store';
import { convertStringToLowerCaseWithoutSpaces } from '@/lib/helpers/translations/convertStringToLowerCaseWithoutSpaces';
import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import SpotListTagItem from '@/UI/molecules/spotList/SpotListTagItem';
import EmojiPickerButton from '@/UI/organism/feed/cards/EmojiPickerButton';
import TarotProfileImage from '../../profile/tarot/TarotProfileImage';
import ListSaveButton from '@/UI/atoms/list/ListSaveButton';

import type { TypeFollow } from '@/lib/types/follows';
import type { TypeFeedTabFilter } from '@/lib/types/feed';

import type { TypeEmojiFromEvent } from '@/lib/types/emojis';
import SavedIcon from '@/UI/assets/svg/SavedIcon';

type TypeFeedListCardProps = {
	userImageUrl: string | null;
	eventMessage?: string;
	userCreatorId: number;
	emojis: TypeEmojiFromEvent[];
	eventId: number;
	handleRedirectProfile: (userId: number) => void;
	tags: string[] | null;
	listName: string;
	isLikeList?: boolean;
	listId: number;
	listLikeCounter?: number;
	listCreator: string;
	listCreatorId: number;
	handleRedirectList: (listId: number) => void;
	testID?: string;
	feedFilterValue: TypeFeedTabFilter;
	tarotColors: string[];
};

const FeedListCard = ({
	eventId,
	userImageUrl,
	eventMessage,
	tags,
	userCreatorId,
	handleRedirectProfile,
	listName,
	emojis,
	isLikeList,
	listId,
	listLikeCounter,
	listCreator,
	listCreatorId,
	handleRedirectList,
	testID,
	feedFilterValue,
	tarotColors,
}: TypeFeedListCardProps) => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const isSpotListOwner = user?.id === listCreatorId;
	const analyticsListData = {
		list_id: listId,
		list_name: listName,
		list_creator: listCreator,
	};

	const queryMutateDestination = () => {
		if (feedFilterValue === 'community') return 'feed';
		if (feedFilterValue === 'following') return 'followingFeed';
		return 'creatorFeed';
	};

	const { mutateAsync: followSpotList } = useUpdateFollowSpotListQuery({
		queryMutateDestination: queryMutateDestination(),
		dataListEvent: analyticsListData,
		spotListId: listId,
		currentUserId: user?.id,
	});

	const onClickFavorite = async () => {
		if (isSpotListOwner) return;

		const followObject: TypeFollow = {
			following_spot_list_id: listId,
		};

		await followSpotList(followObject);
	};

	const tagsToShow = useMemo(() => {
		if (tags && tags?.length > 2) {
			let tagsRender: string[] = [];
			for (let i = 0; i < 2; i++) {
				tagsRender[i] = i18nInstance.t(
					convertStringToLowerCaseWithoutSpaces(tags[i]),
				);
			}
			tagsRender[2] = `+${tags.length - 2} ${i18nInstance.t('more')}`;
			return tagsRender;
		}
		return (
			tags?.map((tag) =>
				i18nInstance.t(convertStringToLowerCaseWithoutSpaces(tag)),
			) ?? []
		);
	}, [tags]);

	return (
		<TouchableOpacity
			onPress={() => {
				handleRedirectList(listId);
			}}
			activeOpacity={1}
			className='border-b border-b-filter-border/20  flex-row py-8'
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
			<View className='flex-1 '>
				<TextElement
					textStyles={`text-white text-sm font-bold `}
					testID={`event-${testID}`}
				>
					{eventMessage}
				</TextElement>
				<TextElement
					textStyles={`text-sm text-white my-3`}
					testID={`name-${testID}`}
				>
					{listName}
				</TextElement>
				<FlatList
					data={tagsToShow}
					renderItem={({ item }) => <SpotListTagItem text={item} />}
					keyExtractor={(_, index) => index.toString()}
					horizontal
					contentContainerStyle={{
						flex: 1,
						display: 'flex',
						gap: 15,
					}}
				/>
				<View
					className={`flex-row items-center flex-wrap ${tagsToShow.length > 0 ? 'mt-3' : ''}`}
					style={{ gap: 10 }}
				>
					<EmojiPickerButton
						emojis={emojis}
						eventId={eventId}
						queryMutateDestination={queryMutateDestination()}
					/>
					{isSpotListOwner ? (
						<>
							<View className='opacity-50 flex-row items-center'>
								<SavedIcon color={'#575757'} width={22} height={22} />
								<TextElement textStyles='text-xs ml-1 text-white'>
									{listLikeCounter ? listLikeCounter : 0}
								</TextElement>
							</View>
						</>
					) : (
						<ListSaveButton
							onPressSaveList={onClickFavorite}
							isSavedList={!!isLikeList}
							listSavesCounter={listLikeCounter}
							buttonTestID={`saved-${testID}`}
							designVariation='feed'
						/>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default memo(FeedListCard);
