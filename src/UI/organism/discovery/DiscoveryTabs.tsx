import { Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { RefObject } from 'react';

import { i18nInstance } from 'config/i18n';

import { dataDiscoveryTabs } from '@/lib/data/discoveryData';

import ArrowIcon from '@/UI/assets/svg/Arrow';

interface TypeDiscoveryTabsProps {
	flatListRef: RefObject<FlatList>;
	index: number;
	setIndex: (index: number) => void;
	scrollToItem: (index: number) => void;
}

const widthOfItem = 110;

const DiscoveryTabs = ({
	flatListRef,
	index,
	setIndex,
	scrollToItem,
}: TypeDiscoveryTabsProps) => {
	const handleActiveTabStyles = (
		tabIndex: number,
		elementToStyled: 'button' | 'text',
	) => {
		if (index === tabIndex) {
			if (elementToStyled === 'button') {
				return 'bg-middle-gray';
			}
			if (elementToStyled === 'text') {
				return 'text-white';
			}
		}
		return '';
	};

	const handleUpdateCurrentTab = (index: number) => {
		setIndex(index);
	};

	const scrollToLeft = () => {
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
	};
	const scrollToRight = () => {
		flatListRef.current?.scrollToOffset({
			offset: widthOfItem * dataDiscoveryTabs.length,
			animated: true,
		});
	};

	return (
		<View className='mt-8 relative flex-row items-center '>
			<TouchableOpacity
				activeOpacity={1}
				onPress={scrollToLeft}
				className=' 0 w-8 flex-row '
			>
				<View className='rotate-180'>
					<ArrowIcon />
				</View>
			</TouchableOpacity>

			<FlatList
				ref={flatListRef}
				data={dataDiscoveryTabs}
				keyExtractor={(item) => item.value}
				horizontal
				alwaysBounceHorizontal={false}
				overScrollMode='never'
				contentContainerStyle={{ gap: 15 }}
				getItemLayout={(data, index) => ({
					length: widthOfItem,
					offset: widthOfItem * index,
					index,
				})}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						onPress={() => {
							handleUpdateCurrentTab(index);
							scrollToItem(index);
						}}
						activeOpacity={1}
						className={`py-2   bg-transparent border border-middle-gray rounded-full ${handleActiveTabStyles(index, 'button')}`}
						testID={`discovery-tab-element-${item.value}`}
						style={{
							width: widthOfItem,
						}}
					>
						<Text
							className={`text-social-media-gray text-center text-xs ${handleActiveTabStyles(index, 'text')}`}
						>
							{i18nInstance.t(item.label)}
						</Text>
					</TouchableOpacity>
				)}
				showsHorizontalScrollIndicator={false}
				testID='discovery-tabs-list'
			/>
			<TouchableOpacity
				activeOpacity={1}
				onPress={scrollToRight}
				className=' 0 w-8  '
			>
				<View className='ml-auto'>
					<ArrowIcon />
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default DiscoveryTabs;
