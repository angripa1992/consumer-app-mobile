import { View } from 'react-native';
import TextElement from '../text/TextElement';
import { formatNumber } from '@/lib/helpers/formatNumber';

interface ProfileNumberHeaderProps {
	number: number;
	text: string;
	testID?: string;
}

const ProfileNumberHeader = ({
	number = 0,
	text,
	testID,
}: ProfileNumberHeaderProps) => {
	const formatNumberText = formatNumber(Number(number));

	return (
		<View testID={testID}>
			<TextElement textStyles='text-light-white text-center text-base min-[400px]:text-2xl font-medium mb-1'>
				{formatNumberText}
			</TextElement>
			<TextElement
				textStyles='text-gray text-sm min-[400px]:text-sm text-center tracking-[-0.05px]'
				numberOfLines={1}
			>
				{text}
			</TextElement>
		</View>
	);
};

export default ProfileNumberHeader;
