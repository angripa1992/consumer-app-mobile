import { FlatList, FlatListProps, RefreshControl, View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';

import { formatFlatListData } from '@/lib/helpers/formatFlatlistData';

import NoListAvailable from '../NoListAvailable';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import FlatListWithScrollNavigation from './FlatListWithScrollNavigation';
import { useQueryRefresh } from '@/lib/hooks/useQueryRefresh';

interface InfiniteScrollFlatListProps<T>
	extends Omit<FlatListProps<T>, 'data'> {
	fetchNextPage: () => void;
	hasNextPage: boolean | undefined;
	isLoading: boolean;
	textForNoItemsAvailable?: string;
	isFetchingNextPage: boolean;
	customEmptyComponent?: React.ReactNode;
	dataToRender: T[] | undefined;
	isOneColumn?: boolean;
	isBottomSheetFlatList?: boolean;
	isUseScrollToTop?: boolean;
	hideEmptyComponent?: boolean;
	hasNewData?: boolean;
	isError?: boolean;
	refetch?: () => Promise<any>;
}

const InfiniteScrollFlatList = <T,>({
	renderItem,
	fetchNextPage,
	hasNextPage,
	isLoading,
	textForNoItemsAvailable = 'No items available',
	isFetchingNextPage,
	dataToRender,
	customEmptyComponent,
	refetch,
	isOneColumn = false,
	isBottomSheetFlatList = false,
	hideEmptyComponent = false,
	isError = false,
	isUseScrollToTop = false,
	hasNewData = false,
	...restProps
}: InfiniteScrollFlatListProps<T>) => {
	const { handleRefresh, refreshing } = useQueryRefresh(refetch);
	const numColumns = isOneColumn ? 1 : 2;
	const data = isOneColumn ? dataToRender : formatFlatListData(dataToRender, 2);
	const gap = 14;
	const columnWrapperStyle = !isOneColumn ? { gap } : null;
	const contentContainerStyle = { gap };
	const showsVerticalScrollIndicator = false;
	const onEndReachedThreshold = 1;

	const CustomRefreshControl = (
		<RefreshControl
			refreshing={refreshing}
			onRefresh={handleRefresh}
			tintColor={'#fff'}
		/>
	);

	const renderListEmptyComponent = () => {
		if (isLoading || isError || hideEmptyComponent) return null;

		if (customEmptyComponent) return customEmptyComponent;

		return (
			<NoListAvailable
				emptyComponentStyles='h-[250px]'
				title={textForNoItemsAvailable}
			/>
		);
	};

	const renderListFooterComponent = () => {
		if (isError)
			return (
				<View>
					<TextElement className='text-white text-center mb-5'>
						Something went wrong
					</TextElement>
					<ButtonPrimary onPress={refetch}>Try again</ButtonPrimary>
				</View>
			);

		if (isLoading || isFetchingNextPage)
			return (
				<View className='flex justify-center items-center h-[240px] w-full'>
					<SpinnerCup isFullPage={false} />
				</View>
			);
	};

	const onEndReached = () => {
		if (isError) return;

		if (hasNextPage) fetchNextPage();
	};

	if (isBottomSheetFlatList) {
		return (
			<BottomSheetFlatList
				columnWrapperStyle={columnWrapperStyle}
				renderItem={renderItem}
				showsVerticalScrollIndicator={showsVerticalScrollIndicator}
				onEndReachedThreshold={onEndReachedThreshold}
				ListEmptyComponent={renderListEmptyComponent}
				ListFooterComponent={renderListFooterComponent}
				onEndReached={onEndReached}
				data={data}
				{...restProps}
			/>
		);
	}

	if (isUseScrollToTop) {
		return (
			<FlatListWithScrollNavigation
				contentContainerStyle={contentContainerStyle}
				renderItem={renderItem}
				numColumns={numColumns}
				columnWrapperStyle={columnWrapperStyle}
				showsVerticalScrollIndicator={showsVerticalScrollIndicator}
				onEndReachedThreshold={onEndReachedThreshold}
				ListEmptyComponent={renderListEmptyComponent}
				ListFooterComponent={renderListFooterComponent}
				onEndReached={onEndReached}
				data={data}
				refreshControl={CustomRefreshControl}
				hasNewData={hasNewData}
				refetch={refetch}
				{...restProps}
			/>
		);
	}

	return (
		<FlatList
			contentContainerStyle={contentContainerStyle}
			renderItem={renderItem}
			numColumns={numColumns}
			columnWrapperStyle={columnWrapperStyle}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
			onEndReachedThreshold={onEndReachedThreshold}
			ListEmptyComponent={renderListEmptyComponent}
			ListFooterComponent={renderListFooterComponent}
			onEndReached={onEndReached}
			data={data}
			{...restProps}
		/>
	);
};

export default InfiniteScrollFlatList;
