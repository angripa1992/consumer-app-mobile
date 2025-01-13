import TextElement from '@/UI/atoms/text/TextElement';
import { i18nInstance } from 'config/i18n';
import { View } from 'react-native';

interface SpotCuisineProps {
	cuisine: string[] | null;
}

const SpotCuisine = ({ cuisine }: SpotCuisineProps) => {
	const textStyles = 'text-gray-label text-sm';
	return (
		<View className=' flex-row flex-wrap gap-2 mt-1'>
			{cuisine && cuisine.length > 0 ? (
				cuisine.map((cuisineItem, index) => (
					<View key={index} className='bg-dark-gray/70 rounded-full px-2 py-1 '>
						<TextElement textStyles={textStyles}>{cuisineItem}</TextElement>
					</View>
				))
			) : (
				<TextElement textStyles={textStyles}>
					{i18nInstance.t('thereNoTagsToShow')}
				</TextElement>
			)}
		</View>
	);
};

export default SpotCuisine;
