import { View } from 'react-native';
import { FlashList, FlashListProps, ListRenderItem } from '@shopify/flash-list';

import { i18nInstance } from 'config/i18n';
import { APP_WIDTH } from '@/lib/utils/constants';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import NoListAvailable from '../NoListAvailable';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';

interface CategoryTemplateFlashListProps<T> extends FlashListProps<T> {
	title: string;
	onClickViewMore: () => void;
	renderItem: ListRenderItem<T>;
	headerStyles?: string;
	showEmptyComponent?: boolean;
	showIsLoadingComponent?: boolean;
	containerStyles?: string;
	viewMoreTestID?: string;
	noAvailableText?: string;
	height?: number;
}

const CategoryTemplateFlashList = <T,>({
	title,
	onClickViewMore,
	renderItem,
	data,
	headerStyles = '',
	showEmptyComponent = false,
	showIsLoadingComponent = false,
	containerStyles = '',
	viewMoreTestID,
	noAvailableText = 'noItemsAvailable',
	height = 150,
	...restProps
}: CategoryTemplateFlashListProps<T>) => {
	const hasData = !!data && data?.length > 0;

	if (!hasData && !showEmptyComponent) return null;

	const hasMoreThanOneItem = !!data && data?.length > 1;

	return (
		<View className={containerStyles}>
			<View
				className={`flex  flex-row justify-between items-center mb-1 ${headerStyles}`}
			>
				<TextElement textStyles='text-white text-lg font-bold'>
					{title}
				</TextElement>
				<ButtonPrimary
					designVariation='ghost'
					buttonStyles='p-0 border-none'
					textStyles='text-white no-underline text-sm'
					onPress={onClickViewMore}
					testID={viewMoreTestID}
				>
					{i18nInstance.t('viewMore')}
				</ButtonPrimary>
			</View>
			<FlashList
				data={data}
				renderItem={renderItem}
				horizontal
				showsHorizontalScrollIndicator={false}
				overScrollMode='never'
				alwaysBounceHorizontal={false}
				scrollEnabled={hasMoreThanOneItem}
				{...restProps}
			/>
			{showIsLoadingComponent && (
				<View className='flex items-center justify-center h-[240px]'>
					<SpinnerCup isFullPage={false} />
				</View>
			)}
			{!hasData && !showIsLoadingComponent && (
				<NoListAvailable
					emptyComponentStyles='h-[160px]'
					title={i18nInstance.t(noAvailableText)}
				/>
			)}
		</View>
	);
};

export default CategoryTemplateFlashList;
