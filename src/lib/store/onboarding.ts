import { StateCreator } from 'zustand';

import { TypeOnboardingFormSchema } from '../types/onboarding';

export interface TypeAppOnboardingSlice {
	onboardingForm: TypeOnboardingFormSchema;
	setOnboardingForm: (form: TypeOnboardingFormSchema) => void;
	resetOnboardingValues: () => void;
}

const defaultOnboardingForm: TypeOnboardingFormSchema = {
	relevantLists: [],
	relevantUsers: [],
	tags: [],
};

export const createAppOnboardingSlice: StateCreator<TypeAppOnboardingSlice> = (
	set,
) => ({
	onboardingForm: defaultOnboardingForm,
	setOnboardingForm: (form) =>
		set((state) => ({
			onboardingForm: {
				...state.onboardingForm,
				...form,
			},
		})),
	resetOnboardingValues: () =>
		set(() => ({
			onboardingForm: defaultOnboardingForm,
		})),
});
