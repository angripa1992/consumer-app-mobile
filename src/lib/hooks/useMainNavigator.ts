import { useEffect } from 'react';
import { useURL } from 'expo-linking';
import { useShallow } from 'zustand/react/shallow';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../config/firebase';

import { useAppStore } from '@/lib/store/store';

const useMainNavigator = () => {
	const url = useURL();
	const {
		appUser,
		userAuth,
		setUserAuth,
		isLoadingAuth,
		setIsLoadingAuth,
		globalCityFilterValue,
		setGlobalCityFilterValue,
		waitlistUserEmail,
		setShowWaitlistContactSoonScreen,
		setWaitlistReferralLink,
		isOutdateAppError,
		setIsOutdateAppError,
		showStagingWarningModal,
		setShowStagingWarningModal,
		isAuthenticating,
	} = useAppStore(
		useShallow((state) => {
			return {
				appUser: state.user,
				isAuthenticating: state.isAuthenticating,
				setIsAuthenticating: state.setIsAuthenticating,
				waitlistUserEmail: state.waitlistUserEmail,
				userAuth: state.userAuth,
				setUserAuth: state.setUserAuth,
				isLoadingAuth: state.isLoadingAuth,
				setIsLoadingAuth: state.setIsLoadingAuth,
				globalCityFilterValue: state.globalCityFilterValue,
				setGlobalCityFilterValue: state.setGlobalCityFilterValue,
				setShowWaitlistContactSoonScreen:
					state.setShowWaitlistContactSoonScreen,
				setWaitlistReferralLink: state.setWaitlistReferralLink,
				isOutdateAppError: state.isOutdateAppError,
				setIsOutdateAppError: state.setIsOutdateAppError,
				showStagingWarningModal: state.showStagingWarningModal,
				setShowStagingWarningModal: state.setShowStagingWarningModal,
			};
		}),
	);

	useEffect(() => {
		if (url && url.includes('referralCode')) {
			setWaitlistReferralLink(url);
		}
	}, [url]);

	useEffect(() => {
		if (waitlistUserEmail) {
			setShowWaitlistContactSoonScreen('contactSoon');
		}
	}, [waitlistUserEmail]);

	useEffect(() => {
		const unsubscribeAuth = onAuthStateChanged(
			auth,
			async (authenticatedUser) => {
				if (authenticatedUser) {
					setUserAuth(authenticatedUser);
				} else {
					setUserAuth(null);
				}

				if (appUser && authenticatedUser && !isAuthenticating) {
					setIsLoadingAuth(false);
				}
			},
		);

		return unsubscribeAuth;
	}, [isAuthenticating]);

	useEffect(() => {
		if (!appUser) {
			setIsLoadingAuth(false);
		}
	}, [appUser]);

	return {
		isLoadingAuth,
		userAuth,
		appUser,
		isOutdateAppError,
		setIsOutdateAppError,
		showStagingWarningModal,
		setShowStagingWarningModal,
		isAuthenticating,
	};
};

export default useMainNavigator;
