import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from './Header';
import BackIcon from '../assets/svg/BackIcon';
import TextElement from '../atoms/text/TextElement';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';

type TypeHeaderGoBackProps = {
	title?: string;
	redirect?: () => void;
	titleStyles?: string;
	designVariation?: 'transparent';
	testID?: string;
};

const HeaderGoBack = ({
	title,
	redirect,
	titleStyles,
	designVariation,
	testID,
}: TypeHeaderGoBackProps) => {
	const navigation = useNavigation<AppStackNavigationProp>();

	let headerStyles = 'bg-dark-gray';

	if (designVariation === 'transparent') {
		headerStyles = '!bg-transparent';
	}

	const handleRedirect = () => {
		if (redirect) {
			redirect();
			return;
		}

		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}

		navigation.navigate('TabScreens');
	};

	return (
		<Header
			showDefaultHeader={false}
			headerContainerStyles={headerStyles}
			headerStyles={headerStyles}
		>
			<View className=' w-full flex-row items-center relative'>
				{title && (
					<TextElement
						textStyles={`w-full text-gray text-center text-base font-semibold ${titleStyles}`}
					>
						{title}
					</TextElement>
				)}
				<TouchableOpacity
					activeOpacity={1}
					onPress={handleRedirect}
					className='absolute  justify-center py-2'
					hitSlop={10}
					testID={testID}
				>
					<BackIcon />
				</TouchableOpacity>
			</View>
		</Header>
	);
};

export default HeaderGoBack;
