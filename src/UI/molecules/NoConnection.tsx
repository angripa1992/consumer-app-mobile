import { View } from 'react-native';
import NoConnectionIcon from '../assets/svg/NoConnectionIcon';
import TextElement from '../atoms/text/TextElement';
import ButtonPrimary from '../atoms/button/ButtonPrimary';

interface NoConnectionProps {
	containerStyles?: string;
	message?: string;
	refetch: () => void;
}

const defaultMessage =
	'Oops! It seems like there was a hiccup in the app. Our team is working diligently to fix the issue and ensure a smooth experience for you.';

const NoConnection = ({
	containerStyles = 'flex-1  justify-center',
	message = defaultMessage,
	refetch,
}: NoConnectionProps) => {
	return (
		<View className={containerStyles}>
			<View className='mx-auto mb-5'>
				<NoConnectionIcon />
			</View>
			<TextElement textStyles='text-base text-center text-white font-bold mb-5'>
				{message}
			</TextElement>
			<ButtonPrimary designVariation='white' onPress={refetch}>
				Try again
			</ButtonPrimary>
		</View>
	);
};

export default NoConnection;
