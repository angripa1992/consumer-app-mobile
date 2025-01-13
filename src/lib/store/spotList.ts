import { StateCreator } from 'zustand';
import { TypeSpotListSinglePage } from '../types/spotList';

export interface TypeSpotListSlice {
	isSpotListEdit: boolean;
	showDeleteSpotListModal: boolean;

	isReorderingSpotListActive: boolean;
	spotListToUpdate: TypeSpotListSinglePage | null;
	isSpotListEditAlreadyCreated: boolean;

	setIsReorderingSpotListActive: (isReorderingSpotListActive: boolean) => void;

	setShowDeleteSpotListModal: (showDeleteSpotListModal: boolean) => void;

	setSpotListToUpdate: (
		spotListToUpdate: TypeSpotListSinglePage | null,
	) => void;
	setIsSpotListEdit: (isSpotListEdit: boolean) => void;
	setIsSpotListEditAlreadyCreated: (
		isSpotListEditAlreadyCreated: boolean,
	) => void;
}

export const createSpotListSlice: StateCreator<TypeSpotListSlice> = (set) => ({
	isReorderingSpotListActive: false,

	showDeleteSpotListModal: false,

	spotListToUpdate: null,
	isSpotListEdit: false,

	isSpotListEditAlreadyCreated: false,

	setIsReorderingSpotListActive: (isReorderingSpotListActive) =>
		set({ isReorderingSpotListActive }),

	setShowDeleteSpotListModal: (showDeleteSpotListModal) =>
		set({ showDeleteSpotListModal }),

	setSpotListToUpdate: (spotListToUpdate) => set(() => ({ spotListToUpdate })),
	setIsSpotListEdit: (isSpotListEdit) => set(() => ({ isSpotListEdit })),

	setIsSpotListEditAlreadyCreated: (isSpotListEditAlreadyCreated) =>
		set(() => ({ isSpotListEditAlreadyCreated })),
});
