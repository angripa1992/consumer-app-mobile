import { View } from 'react-native';
import { i18nInstance } from 'config/i18n';

import { usePostDiscoveryPeople } from '@/lib/hooks/useQueryDiscovery';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';

import UsersIcon from '@/UI/assets/svg/UsersIcon';
import TextElement from '@/UI/atoms/text/TextElement';

import type { TypeDiscoveryPersonCard } from '@/lib/types/discovery';
import { useCallback, useMemo } from 'react';

type DiscoveryPeopleProps = {
	renderPersonCard: (values: TypeDiscoveryPersonCard) => JSX.Element;
	searchQuery: string;
};
const DiscoveryPeople = ({
	renderPersonCard,
	searchQuery,
}: DiscoveryPeopleProps) => {
	const {
		discoveryPeople,
		hasNextPageDiscoveryPeople,
		fetchNextPageDiscoveryPeople,
		isLoadingDiscoveryPeople,
		isFetchingNextPageDiscoveryPeople,
		refetchDiscoveryPeople,
	} = usePostDiscoveryPeople({
		search_content: searchQuery,
	});

	useRefetchOnFocus(refetchDiscoveryPeople);

	const emptyDiscoveryPeople = useMemo(
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
			item: TypeDiscoveryPersonCard['item'];
			index: number;
		}) =>
			renderPersonCard({
				item,
				index,
				categoryName: 'people',
				queryMutateDestination: 'peopleDiscovery',
				isSmallVariant: true,
			}),
		[renderPersonCard],
	);

	const keyExtractor = useCallback(
		(item: TypeDiscoveryPersonCard['item'], index: number) => {
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
			dataToRender={discoveryPeople}
			renderItem={renderItem}
			hasNextPage={hasNextPageDiscoveryPeople}
			fetchNextPage={fetchNextPageDiscoveryPeople}
			isLoading={isLoadingDiscoveryPeople}
			isFetchingNextPage={isFetchingNextPageDiscoveryPeople}
			customEmptyComponent={emptyDiscoveryPeople}
			keyExtractor={keyExtractor}
			isOneColumn
		/>
	);
};

export default DiscoveryPeople;
