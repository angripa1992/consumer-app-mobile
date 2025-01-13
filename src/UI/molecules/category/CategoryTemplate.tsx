import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { FlatList, FlatListProps, ListRenderItem, View } from 'react-native';
import NoListAvailable from '../NoListAvailable';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import { i18nInstance } from 'config/i18n';

interface CategoryTemplateProps<T> extends FlatListProps<T> {
	title: string;
	onClickViewMore: () => void;
	renderItem: ListRenderItem<T>;
	headerStyles?: string;
	showEmptyComponent?: boolean;
	showIsLoadingComponent?: boolean;
	containerStyles?: string;
	viewMoreTestID?: string;
	noAvailableText?: string;
}

const CategoryTemplate = <T,>({
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
	...restProps
}: CategoryTemplateProps<T>) => {
	const hasData = !!data && data?.length > 0;

	if (!hasData && !showEmptyComponent) return null;

	const hasMoreThanOneItem = !!data && data?.length > 1;

	return (
		<View className={containerStyles}>
			<View
				className={`flex flex-row justify-between items-center mb-1 ${headerStyles}`}
			>
				<TextElement textStyles='text-white text-lg font-bold'>
					{title}
				</TextElement>
				{hasMoreThanOneItem && (
					<ButtonPrimary
						designVariation='ghost'
						buttonStyles='p-0 border-none'
						textStyles='text-white no-underline text-sm'
						onPress={onClickViewMore}
						testID={viewMoreTestID}
					>
						{i18nInstance.t('viewMore')}
					</ButtonPrimary>
				)}
			</View>
			<FlatList
				data={data}
				contentContainerStyle={{ gap: 14 }}
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

export default CategoryTemplate;
