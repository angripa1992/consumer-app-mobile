import { View } from 'react-native';

import TextElement from '@/UI/atoms/text/TextElement';

type TypeTarotTitleProps = {
	title: string;
	containerStyles?: string;
};

const TarotTitle = ({ title, containerStyles }: TypeTarotTitleProps) => {
	return (
		<View
			testID='tarot-title-container'
			className={`bg-black px-7 py-1 rounded-full border-2 border-white  ${containerStyles ?? ''}`}
			shouldRasterizeIOS={true}
		>
			<TextElement textStyles='text-white text-lg font-extrabold'>
				{title}
			</TextElement>
		</View>
	);
};

export default TarotTitle;
