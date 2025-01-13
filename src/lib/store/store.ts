import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { type TypeAppUserSlice, createAppUserSlice } from './user';
import { type TypeAppProfileSlice, createAppProfileSlice } from './profile';
import { type TypeSpotListSlice, createSpotListSlice } from './spotList';
import { type TypeSpotSlice, createSpotSlice } from './spot';
import {
	type TypeAppDiscoverySlice,
	createAppDiscoverySlice,
} from './discovery';
import {
	type TypeAppOnboardingSlice,
	createAppOnboardingSlice,
} from './onboarding';

export const useAppStore = create<
	TypeAppUserSlice &
		TypeAppProfileSlice &
		TypeSpotListSlice &
		TypeSpotSlice &
		TypeAppDiscoverySlice &
		TypeAppOnboardingSlice
>()(
	persist(
		(...a) => ({
			...createAppUserSlice(...a),
			...createAppProfileSlice(...a),
			...createSpotListSlice(...a),
			...createSpotSlice(...a),
			...createAppDiscoverySlice(...a),
			...createAppOnboardingSlice(...a),
		}),
		{
			name: 'appStore',
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => {
				const {
					isLoadingAuth,
					setIsLoadingAuth,
					showStagingWarningModal,
					setShowStagingWarningModal,
					onboardingStep,
					setOnboardingStep,
					isAuthenticating,
					setIsAuthenticating,
					...rest
				} = state;
				return rest;
			},
		},
	),
);
