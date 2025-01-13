import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';

import ErrorTemplate from '@/UI/organism/error/ErrorTemplate';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';

type TypeErrorScreenProps = {
	typeError?: 'general' | 'notFound';
};

const ErrorScreen = ({ typeError = 'general' }: TypeErrorScreenProps) => {
	const navigation = useNavigation<AppStackNavigationProp>();
	const { setIsErrorScreen, setIsNotFoundScreen } = useAppStore(
		useShallow((state) => ({
			setIsErrorScreen: state.setIsErrorScreen,
			setIsNotFoundScreen: state.setIsNotFoundScreen,
		})),
	);

	const handleBackToHomePage = () => {
		setIsErrorScreen(false);
		setIsNotFoundScreen(false);
		if (navigation.canGoBack()) {
			navigation.goBack();
		}
	};

	return (
		<ErrorTemplate onClickButton={handleBackToHomePage} typeError={typeError} />
	);
};

export default ErrorScreen;
