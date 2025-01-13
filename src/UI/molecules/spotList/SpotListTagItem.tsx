import { View } from 'react-native';

import TextElement from '@/UI/atoms/text/TextElement';

interface SpotListTagItemProps {
	text: string;
}

const SpotListTagItem = ({ text }: SpotListTagItemProps) => {
	return (
		<View className='bg-purple-lilac/[15%] rounded-full py-1 px-3'>
			<TextElement textStyles='text-white'>{text}</TextElement>
		</View>
	);
};

export default SpotListTagItem;
