import { useEffect, type ReactNode } from 'react';
import {
	Keyboard,
	Platform,
	SafeAreaView,
	TouchableWithoutFeedback,
	View,
	KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';

import ErrorScreen from '@/screens/ErrorScreen';

import GreenTextureHeader from '@/UI/assets/images/textures/green-texture-header.png';

type TypeMainLayoutProps = {
	children: ReactNode;
	mainLayoutStyles?: string;
	subContainerStyles?: string;
	isDismissKeyboardActive?: boolean;
	isKeyAvoidingView?: boolean;
	customSubContainerElement?: ReactNode;
	hasBgTexture?: boolean;
};

const MainLayout = ({
	children,
	mainLayoutStyles,
	subContainerStyles,
	isDismissKeyboardActive = true,
	isKeyAvoidingView = true,
	customSubContainerElement,
	hasBgTexture,
}: TypeMainLayoutProps) => {
	const router = useRoute();

	const { isErrorScreen, isNotFoundScreen, setCurrentRoute } = useAppStore(
		useShallow((state) => ({
			isErrorScreen: state.isErrorScreen,
			isNotFoundScreen: state.isNotFoundScreen,
			setCurrentRoute: state.setCurrentRoute,
		})),
	);

	const mainContent = (
		<SafeAreaView
			className={`h-full w-full flex-1 bg-black relative ${mainLayoutStyles ?? ''}`}
		>
			{hasBgTexture && (
				<Image
					source={GreenTextureHeader}
					className='absolute z-[-1] w-full top-[-295px] left-0 h-[500px]'
				/>
			)}
			{customSubContainerElement && customSubContainerElement}
			<View
				className={`w-[90%] pt-4 relative  max-w-[480px] h-full mx-auto ${
					subContainerStyles ?? ''
				}`}
			>
				{children}
			</View>
		</SafeAreaView>
	);

	useEffect(() => {
		const routeObject = {
			name: router.name,
			params: router.params as Record<string, string>,
		};
		setCurrentRoute(routeObject);
	}, [router]);

	if (isErrorScreen || isNotFoundScreen) {
		return <ErrorScreen typeError={isErrorScreen ? 'general' : 'notFound'} />;
	}

	if (!isKeyAvoidingView) {
		return mainContent;
	}

	return (
		<>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className='bg-black flex-1'
			>
				{isDismissKeyboardActive ? (
					<TouchableWithoutFeedback
						touchSoundDisabled
						onPress={Keyboard.dismiss}
					>
						{mainContent}
					</TouchableWithoutFeedback>
				) : (
					mainContent
				)}
			</KeyboardAvoidingView>
		</>
	);
};

export default MainLayout;
