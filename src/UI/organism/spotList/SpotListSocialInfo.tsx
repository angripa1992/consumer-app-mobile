import { FlatList, View } from 'react-native';

import { formatNumber } from '@/lib/helpers/formatNumber';
import { i18nInstance } from 'config/i18n';
import { convertStringToLowerCaseWithoutSpaces } from '@/lib/helpers/translations/convertStringToLowerCaseWithoutSpaces';

import TextElement from '@/UI/atoms/text/TextElement';
import SpotListTagItem from '@/UI/molecules/spotList/SpotListTagItem';

interface SpotListSocialInfoProps {
	spotCounter: number;
	followersCounter: number;
	viewCounter: number;
	tags: string[] | null;
	description: string | null;
}

const SpotListSocialInfo = ({
	spotCounter,
	followersCounter,
	viewCounter,
	tags,
	description,
}: SpotListSocialInfoProps) => {
	const hasTags = tags && tags?.length > 0;
	const hasDescription = !!description;

	return (
		<View className='mt-4 mb-6'>
			<View className='flex-row items-center gap-x-10'>
				<View className='justify-center items-center '>
					<TextElement
						textStyles='text-light-white text-xl '
						testID='list-spot-counter'
					>
						{formatNumber(spotCounter, 2)}
					</TextElement>
					<TextElement textStyles='text-gray'>
						{i18nInstance.t('spots')}
					</TextElement>
				</View>
				<View className='justify-center items-center'>
					<TextElement
						textStyles='text-light-white text-xl '
						testID='list-follows-counter'
					>
						{formatNumber(followersCounter, 2)}
					</TextElement>
					<TextElement textStyles='text-gray'>
						{i18nInstance.t('follows')}
					</TextElement>
				</View>
				<View className='justify-center items-center'>
					<TextElement
						textStyles='text-light-white text-xl'
						testID='list-view-counter'
					>
						{formatNumber(viewCounter, 2)}
					</TextElement>
					<TextElement textStyles='text-gray'>
						{i18nInstance.t('views')}
					</TextElement>
				</View>
			</View>
			{hasDescription && (
				<TextElement textStyles='text-gray mt-4' testID='list-description'>
					{description}
				</TextElement>
			)}
			{hasTags && (
				<FlatList
					className='mt-4'
					data={tags}
					horizontal
					renderItem={({ item }) => (
						<SpotListTagItem
							text={i18nInstance.t(convertStringToLowerCaseWithoutSpaces(item))}
						/>
					)}
					keyExtractor={(_, index) => index.toString()}
					contentContainerStyle={{ gap: 10 }}
					showsHorizontalScrollIndicator={false}
				/>
			)}
		</View>
	);
};

export default SpotListSocialInfo;
