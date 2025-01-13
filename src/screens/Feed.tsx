import { View } from 'react-native';
import { useCallback, useState } from 'react';

import { i18nInstance } from 'config/i18n';

import MainLayout from '@/UI/layouts/MainLayout';
import FeedFilterTabs from '@/UI/organism/feed/filter/FeedFilterTabs';
import FeedCardsRender from '@/UI/organism/feed/FeedCardsRender';
import TextElement from '@/UI/atoms/text/TextElement';

import type { TypeFeedTabFilter } from '@/lib/types/feed';

const FeedScreen = () => {
	const [feedFilterValue, setFeedFilterValue] =
		useState<TypeFeedTabFilter>('community');

	const handleSetFeedFilter = useCallback((value: TypeFeedTabFilter) => {
		setFeedFilterValue(value);
	}, []);

	return (
		<MainLayout
			isDismissKeyboardActive={false}
			isKeyAvoidingView={false}
			hasBgTexture={true}
		>
			<TextElement fontFamily='pachang' designVariation='main-title'>
				{i18nInstance.t('feed')}
			</TextElement>
			<View className='h-[60px] mb-3'>
				<FeedFilterTabs
					currentFilter={feedFilterValue}
					setCurrentFilter={handleSetFeedFilter}
					hideCreatorTab={false}
				/>
			</View>
			<FeedCardsRender feedFilterValue={feedFilterValue} />
		</MainLayout>
	);
};

export default FeedScreen;
