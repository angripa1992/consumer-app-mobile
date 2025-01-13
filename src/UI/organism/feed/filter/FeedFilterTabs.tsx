import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import ThreePeopleIcon from '@/UI/assets/svg/ThreePeople';
import TwoPeopleIcon from '@/UI/assets/svg/TwoPeople';
import CreatorIcon from '@/UI/assets/svg/CreatorIcon';
import TextElement from '@/UI/atoms/text/TextElement';

import type { TypeFeedTabFilter } from '@/lib/types/feed';
import React from 'react';

type TypeFeedFilterTabsProps = {
	currentFilter: TypeFeedTabFilter;
	setCurrentFilter: (value: TypeFeedTabFilter) => void;
	hideCreatorTab?: boolean;
};

const FeedFilterTabs = React.memo(
	({
		currentFilter,
		setCurrentFilter,
		hideCreatorTab = true,
	}: TypeFeedFilterTabsProps) => {
		const buttonContentStyles =
			'flex flex-row items-center flex-1 justify-center';
		const buttonStyles = 'rounded-full mr-2 py-3 flex-1';
		const textStyles = 'text-center text-xs text-social-media-gray ml-2';

		const socialMediaGrayColor = '#858585';
		const lightWhiteColor = '#F5F5F5';

		const getActiveStyles = (
			tabValue: TypeFeedTabFilter,
			element: 'button' | 'text',
		) => {
			const isActive = tabValue === currentFilter;
			if (element === 'button') {
				return isActive ? 'bg-middle-gray text-white' : '';
			}
			return isActive ? 'text-white' : '';
		};

		const handleTabPress = (tabValue: TypeFeedTabFilter) => {
			setCurrentFilter(tabValue);
		};

		const renderTab = (
			tabValue: TypeFeedTabFilter,
			IconComponent: React.ElementType,
			testID: string,
		) => (
			<ButtonPrimary
				designVariation='gray'
				buttonStyles={`${buttonStyles} ${getActiveStyles(tabValue, 'button')}`}
				onPress={() => handleTabPress(tabValue)}
				nodeContentStyles={buttonContentStyles}
				isReactNodeContent
				testID={testID}
			>
				<IconComponent
					color={
						currentFilter === tabValue ? lightWhiteColor : socialMediaGrayColor
					}
				/>
				<TextElement
					textStyles={`${textStyles} ${getActiveStyles(tabValue, 'text')}`}
				>
					{i18nInstance.t(tabValue)}
				</TextElement>
			</ButtonPrimary>
		);

		return (
			<View className='mt-5 mb-0 flex flex-row justify-between flex-1'>
				{renderTab('community', ThreePeopleIcon, 'feed-community-tab')}
				{renderTab('following', TwoPeopleIcon, 'feed-following-tab')}
				{!hideCreatorTab &&
					renderTab('creator', CreatorIcon, 'feed-creator-tab')}
			</View>
		);
	},
);

export default FeedFilterTabs;
