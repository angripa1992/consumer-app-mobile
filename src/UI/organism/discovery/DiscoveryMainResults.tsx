import { useCallback } from 'react';
import { View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { i18nInstance } from 'config/i18n';

import CategoryTemplateFlashList from '@/UI/molecules/category/CategoryFlashListTemplate';

import type { ViewMoreScreenNavigationProp } from '@/lib/types/tabScreenParams';
import type {
	TypeDiscoveryPersonCard,
	TypeDiscoveryResults,
	TypePopularSpotCard,
	TypeSpotFromDiscovery,
	TypeSpotFromDiscoveryCard,
	TypeSpotListFromDiscoveryCard,
} from '@/lib/types/discovery';

interface DiscoveryMainResultsProps {
	discoverySpots: TypeSpotFromDiscovery[] | undefined;
	refetchDiscoverySpots: () => void;
	discoveryResults: TypeDiscoveryResults;
	renderPopularSpotCard: (values: TypePopularSpotCard) => React.JSX.Element;
	renderCandidateSpotCard: (values: TypeSpotFromDiscoveryCard) => JSX.Element;
	renderSpotListCard: (
		values: TypeSpotListFromDiscoveryCard,
	) => React.JSX.Element;
	renderPersonCard: (values: TypeDiscoveryPersonCard) => React.JSX.Element;
	currentCity: string;
	currentArea: string[];
	debounceSearchQuery: string;
}

const DiscoveryMainResults = ({
	discoverySpots,
	refetchDiscoverySpots,
	discoveryResults,
	renderSpotListCard,
	renderPopularSpotCard,
	renderCandidateSpotCard,
	renderPersonCard,
	currentCity,
	currentArea,
	debounceSearchQuery,
}: DiscoveryMainResultsProps) => {
	const navigation = useNavigation<ViewMoreScreenNavigationProp>();

	useRefetchOnFocus(refetchDiscoverySpots);

	const onViewMoreNavigation = useCallback(
		(title: string, type: any) => {
			navigation.navigate('ViewMore', {
				city: currentCity,
				type,
				title,
				querySearch: debounceSearchQuery,
				area: currentArea.join(','),
			});
		},
		[navigation, currentCity, debounceSearchQuery, currentArea],
	);

	const popularLists = discoveryResults.popular_lists;
	const popularSpots = discoveryResults.popular_spots;
	const popularPeople = discoveryResults.popular_people;

	const renderCandidateSpotItem = useCallback(
		({ item, index }: { item: TypeSpotFromDiscovery; index: number }) =>
			renderCandidateSpotCard({
				item,
				index,
				containerStyles: 'w-[150px]',
				queryMutateDestination: 'spotDiscovery',
				isFlashList: false,
			}),
		[renderCandidateSpotCard],
	);

	const renderSpotListItem = useCallback(
		({
			item,
			index,
		}: {
			item: TypeSpotListFromDiscoveryCard['item'];
			index: number;
		}) =>
			renderSpotListCard({
				item,
				index,
				containerStyles: 'w-[150px]',
				categoryName: 'popularLists',
				queryMutateDestination: 'popularSpotListDiscovery',
				isHorizontal: true,
			}),
		[renderSpotListCard],
	);

	const renderPopularSpotItem = useCallback(
		({ item, index }: { item: TypePopularSpotCard['item']; index: number }) =>
			renderPopularSpotCard({ item, index, containerStyles: 'w-[150px]' }),
		[renderPopularSpotCard],
	);

	const renderPersonItem = useCallback(
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
				categoryName: 'popularPeople',
				containerStyles: 'w-[150px]',
				queryMutateDestination: 'popularPeopleDiscovery',
			}),
		[renderPersonCard],
	);

	return (
		<>
			<CategoryTemplateFlashList<TypeSpotFromDiscovery>
				title={i18nInstance.t('spotsResults')}
				data={discoverySpots}
				keyExtractor={(_: unknown, index: number) => index.toString()}
				renderItem={renderCandidateSpotItem}
				estimatedItemSize={150}
				onClickViewMore={() =>
					onViewMoreNavigation(`spotsResults`, 'searchSpots')
				}
				ItemSeparatorComponent={() => <View className='w-[20px]' />}
			/>
			<CategoryTemplateFlashList<TypeSpotListFromDiscoveryCard['item']>
				title={i18nInstance.t('popularLists')}
				data={popularLists}
				keyExtractor={(_: unknown, index: number) => index.toString()}
				renderItem={renderSpotListItem}
				estimatedItemSize={150}
				onClickViewMore={() =>
					onViewMoreNavigation('popularLists', 'popularLists')
				}
				ItemSeparatorComponent={() => <View className='w-[20px]' />}
			/>
			<CategoryTemplateFlashList<TypePopularSpotCard['item']>
				title={i18nInstance.t('popularSpots')}
				data={popularSpots}
				keyExtractor={(_: unknown, index: number) => index.toString()}
				renderItem={renderPopularSpotItem}
				estimatedItemSize={150}
				onClickViewMore={() =>
					onViewMoreNavigation('popularSpots', 'popularSpots')
				}
				ItemSeparatorComponent={() => <View className='w-[20px]' />}
			/>
			<CategoryTemplateFlashList<TypeDiscoveryPersonCard['item']>
				title={i18nInstance.t('popularPeople')}
				data={popularPeople}
				keyExtractor={(_: unknown, index: number) => index.toString()}
				renderItem={renderPersonItem}
				estimatedItemSize={150}
				onClickViewMore={() =>
					onViewMoreNavigation('popularPeople', 'popularPeople')
				}
				ItemSeparatorComponent={() => <View className='w-[20px]' />}
			/>
		</>
	);
};

export default DiscoveryMainResults;
