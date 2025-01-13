import { StateCreator } from 'zustand';

export interface TypeAppDiscoverySlice {
	locationMessageError: string;
	setLocationMessageError: (locationMessageError: string) => void;

	showLocationMessageError: boolean;
	setShowLocationMessageError: (showLocationMessageError: boolean) => void;
}

export const createAppDiscoverySlice: StateCreator<TypeAppDiscoverySlice> = (
	set,
) => ({
	locationMessageError: '',
	setLocationMessageError: (locationMessageError) =>
		set(() => ({ locationMessageError })),

	showLocationMessageError: false,
	setShowLocationMessageError: (showLocationMessageError) =>
		set(() => ({ showLocationMessageError })),
});
