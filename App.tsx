import React, { Fragment, useEffect, useMemo } from 'react';
import * as Sentry from '@sentry/react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { ToastProvider } from 'react-native-toast-notifications';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import { StatusBar } from 'expo-status-bar';
import { i18nInstance } from 'config/i18n';
import {
	useFonts,
	Inter_100Thin,
	Inter_400Regular,
	Inter_900Black,
} from '@expo-google-fonts/inter';

import usePushNotifications from '@/lib/hooks/usePushNotifications';
import linking from '@/lib/helpers/linking';
import onFetchUpdate from '@/lib/helpers/onFetchUpdate';
import { useAppStore } from '@/lib/store/store';

import MainNavigator from '@/navigation/MainNavigator';
import ErrorLayout from '@/UI/layouts/ErrorLayout';
import CustomToast from '@/UI/atoms/toast/CustomToast';
import CheckIcon from '@/UI/assets/svg/CheckIcon';
import Spinner from '@/UI/atoms/spinner/Spinner';
import { View } from 'react-native';

if (!__DEV__) {
	Sentry.init({
		environment: process.env.EXPO_PUBLIC_BUILD_TYPE || 'development',
		dsn: process.env.EXPO_PUBLIC_SENTRY_DNS,
		tracesSampleRate: 1.0,
		debug: false,
	});
}

const MemoizedNavigationContainer = React.memo(NavigationContainer);

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

const App = () => {
	usePushNotifications();
	const { language, setLanguage } = useAppStore(
		useShallow((state) => ({
			language: state.language,
			setLanguage: state.setLanguage,
		})),
	);

	const [fontsLoaded] = useFonts({
		interThin: Inter_100Thin,
		interRegular: Inter_400Regular,
		interBlack: Inter_900Black,
		pachangSemibold: require('./src/UI/assets/fonts/Pachang/Panchang-Semibold.otf'),
	});

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: 2,
			},
		},
	});

	useEffect(() => {
		if (!__DEV__) {
			onFetchUpdate();
		}
	}, []);

	useEffect(() => {
		i18nInstance.locale = language;
	});

	const navigationTheme = useMemo(
		() => ({
			colors: {
				background: '#000000',
				card: '#000000',
				border: '#000000',
				primary: '#000000',
				text: '#EBEBEB',
				notification: '#000000',
			},
			dark: true,
		}),
		[],
	);

	if (!fontsLoaded) {
		return (
			<View className='flex-1 bg-dark-black'>
				<Spinner />
			</View>
		);
	}

	return (
		<>
			<StatusBar backgroundColor={'#161616'} style={'light'} />
			<ErrorBoundary FallbackComponent={ErrorLayout}>
				<QueryClientProvider client={queryClient}>
					<GestureHandlerRootView style={{ flex: 1 }}>
						<MemoizedNavigationContainer
							theme={navigationTheme}
							linking={linking}
						>
							<Fragment key={language}>
								<ToastProvider
									offsetTop={120}
									offsetBottom={40}
									swipeEnabled={true}
									animationDuration={250}
									placement='top'
									duration={5000}
									successIcon={<CheckIcon />}
									renderToast={(options) => <CustomToast options={options} />}
								>
									<BottomSheetModalProvider>
										<MainNavigator />
									</BottomSheetModalProvider>
								</ToastProvider>
							</Fragment>
						</MemoizedNavigationContainer>
					</GestureHandlerRootView>
				</QueryClientProvider>
			</ErrorBoundary>
		</>
	);
};

export default Sentry.wrap(App);
