import { View } from 'react-native';
import EmptyDataIcon from '../assets/svg/EmptyDataIcon';
import TextElement from '../atoms/text/TextElement';

interface NoListAvailableProps {
	emptyComponentStyles?: string;
	title?: string;
}

const NoListAvailable = ({
	emptyComponentStyles = '',
	title = 'No list available',
}: NoListAvailableProps) => {
	return (
		<View
			className={` justify-center items-center h-[400px] ${emptyComponentStyles}`}
		>
			<EmptyDataIcon />
			<TextElement textStyles='text-white text-center text-base mt-3'>
				{title}
			</TextElement>
		</View>
	);
};

export default NoListAvailable;
