import { View } from 'react-native';
import { i18nInstance } from 'config/i18n';

import { usePostPlayPeople } from '@/lib/hooks/useQueryPlay';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

import UsersIcon from '@/UI/assets/svg/UsersIcon';
import TextElement from '@/UI/atoms/text/TextElement';

import type { TypePlayPersonCard } from '@/lib/types/play';
import { useCallback, useMemo } from 'react';

type PlayPeopleProps = {
	renderPersonCard: (values: TypePlayPersonCard) => JSX.Element;
	searchQuery: string;
};
const PlayPeopleList = ({
	renderPersonCard,
	searchQuery,
}: PlayPeopleProps) => {
	const {
		playPeople,
		hasNextPagePlayPeople,
		fetchNextPagePlayPeople,
		isLoadingPlayPeople,
		isFetchingNextPagePlayPeople,
		refetchPlayPeople,
	} = usePostPlayPeople({
		search_content: searchQuery,
	});

	useRefetchOnFocus(refetchPlayPeople);

	const emptyPlayPeople = useMemo(
		() => (
			<View className='flex flex-col flex-1 justify-center items-center h-[250px]'>
				<UsersIcon />
				<TextElement textStyles='text-white text-center text-base mt-3'>
					{i18nInstance.t('noPeopleFound')}
				</TextElement>
			</View>
		),
		[],
	);

	const renderItem = useCallback(
		({
			item,
			index,
		}: {
			item: TypePlayPersonCard['item'];
			index: number;
		}) =>
			renderPersonCard({
				item,
				index,
				categoryName: 'people',
				queryMutateDestination: 'peoplePlay',
				isSmallVariant: true,
			}),
		[renderPersonCard],
	);

	const keyExtractor = useCallback(
		(item: TypePlayPersonCard['item'], index: number) => {
			if ('empty' in item && item.empty) {
				return `empty-${index}`;
			}
			return item.id.toString() + index;
		},
		[],
	);

	return (
		<InfiniteScrollFlashList
			contentContainerStyle={{ paddingTop: 25 }}
			dataToRender={playPeople}
			renderItem={renderItem}
			hasNextPage={hasNextPagePlayPeople}
			fetchNextPage={fetchNextPagePlayPeople}
			isLoading={isLoadingPlayPeople}
			isFetchingNextPage={isFetchingNextPagePlayPeople}
			customEmptyComponent={emptyPlayPeople}
			keyExtractor={keyExtractor}
			isOneColumn
		/>
	);
};

export default PlayPeopleList;
