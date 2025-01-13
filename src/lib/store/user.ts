import { StateCreator } from 'zustand';
import { TypeUser } from '../types/user';

import { randomNumber } from '../helpers/numbers/randomNumber';

import type { TypeSignUpScreens, TypeCurrentRoute } from '../types/user';
import type { TypeLanguageCodes } from '../types/app';

export interface TypeAppUserSlice {
	user: TypeUser | null;
	isAuthenticating: boolean;
	waitlistReferralLink: string | null;
	setWaitlistReferralLink: (referralLink: string | null) => void;
	waitlistUserNumber: number;
	waitlistUserEmail: string | null;
	setWaitlistUserEmail: (newEmail: string | null) => void;
	regenerateWaitlistNumber: () => void;
	setUser: (user: TypeUser | null) => void;
	userAuth: any;
	setUserAuth: (userAuth: any) => void;
	isLoading: boolean;
	setIsLoading: (isLoading: boolean) => void;
	isLoadingAuth: boolean;
	setIsLoadingAuth: (isLoading: boolean) => void;
	isErrorScreen: boolean;
	setIsErrorScreen: (isErrorScreen: boolean) => void;
	isNotFoundScreen: boolean;
	setIsNotFoundScreen: (isNotFoundScreen: boolean) => void;
	showWaitlistContactSoonScreen: TypeSignUpScreens;
	setShowWaitlistContactSoonScreen: (
		showWaitlistContactSoonScreen: TypeSignUpScreens,
	) => void;
	currentRoute: TypeCurrentRoute | null;
	setCurrentRoute: (currentRoute: TypeCurrentRoute | null) => void;
	isOutdateAppError: boolean;
	setIsOutdateAppError: (isOutdateAppError: boolean) => void;

	showStagingWarningModal: boolean;
	setShowStagingWarningModal: (showStagingWarningModal: boolean) => void;
	globalCityFilterValue: string;
	setGlobalCityFilterValue: (globalCityFilterValue: string) => void;
	globalCountryFilterValue: string;
	setGlobalCountryFilterValue: (globalCityFilterValue: string) => void;
	language: TypeLanguageCodes;
	setLanguage: (language: TypeLanguageCodes) => void;
	onboardingStep: number;
	setOnboardingStep: (onboardingStep: number) => void;
	setIsAuthenticating: (isAuthenticating: boolean) => void;
}

export const createAppUserSlice: StateCreator<TypeAppUserSlice> = (set) => ({
	user: null,
	isAuthenticating: false,
	waitlistReferralLink: null,
	setWaitlistReferralLink: (referralLink) =>
		set(() => ({ waitlistReferralLink: referralLink })),
	waitlistUserNumber: randomNumber(2000, 5000),
	waitlistUserEmail: null,
	setWaitlistUserEmail: (newEmail) =>
		set(() => ({ waitlistUserEmail: newEmail })),
	setUser: (user) => set(() => ({ user })),
	regenerateWaitlistNumber: () =>
		set(() => ({ waitlistUserNumber: randomNumber(2000, 5000) })),
	userAuth: null,
	setUserAuth: (userAuth) => set(() => ({ userAuth })),
	isLoadingAuth: true,
	setIsLoadingAuth: (isLoadingAuth) => set(() => ({ isLoadingAuth })),
	isLoading: false,
	setIsLoading: (isLoading) => set(() => ({ isLoading })),
	isErrorScreen: false,
	setIsErrorScreen: (isErrorScreen) => set(() => ({ isErrorScreen })),
	isNotFoundScreen: false,
	setIsNotFoundScreen: (isNotFoundScreen) => set(() => ({ isNotFoundScreen })),
	showWaitlistContactSoonScreen: 'form',
	setShowWaitlistContactSoonScreen: (showWaitlistContactSoonScreen) =>
		set(() => ({ showWaitlistContactSoonScreen })),
	currentRoute: null,
	setCurrentRoute: (currentRoute) => set(() => ({ currentRoute })),
	isOutdateAppError: false,
	setIsOutdateAppError: (isOutdateAppError) =>
		set(() => ({ isOutdateAppError })),
	showStagingWarningModal:
		process.env.EXPO_PUBLIC_BUILD_TYPE === 'staging' ? true : false,
	setShowStagingWarningModal: (showStagingWarningModal) =>
		set(() => ({ showStagingWarningModal })),
	globalCityFilterValue: '',
	setGlobalCityFilterValue: (globalCityFilterValue) =>
		set(() => ({ globalCityFilterValue })),
	globalCountryFilterValue: '',
	setGlobalCountryFilterValue: (globalCountryFilterValue) =>
		set(() => ({ globalCountryFilterValue })),
	language: 'en',
	setLanguage: (language: TypeLanguageCodes) =>
		set(() => ({
			language,
		})),
	onboardingStep: 1,
	setOnboardingStep: (onboardingStep) => set(() => ({ onboardingStep })),
	setIsAuthenticating: (isAuthenticating) => set(() => ({ isAuthenticating })),
});
