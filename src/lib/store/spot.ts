import { StateCreator } from 'zustand';

import { TypeSpotCandidateToSave } from '../types/spot';

export interface TypeSpotSlice {
	showSchedulesModal: boolean;
	setShowSchedulesModal: (showSchedulesModal: boolean) => void;

	spotCandidate: TypeSpotCandidateToSave | null;
	setSpotCandidate: (spotCandidate: TypeSpotCandidateToSave | null) => void;
}

export const createSpotSlice: StateCreator<TypeSpotSlice> = (set) => ({
	selectedSpot: null,
	showSchedulesModal: false,
	spotCandidate: null,

	setShowSchedulesModal: (showSchedulesModal) =>
		set(() => ({ showSchedulesModal })),

	setSpotCandidate: (spotCandidate) => set(() => ({ spotCandidate })),
});
