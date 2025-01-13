import { StateCreator } from 'zustand';

import { TypeProfileTab } from '../types/profile';

export interface TypeAppProfileSlice {
	userIdProfile: number | null;
	showProfileLogoutModal: boolean;
	showUnblockModal: boolean;
	setShowProfileLogoutModal: (showProfileLogoutModal: boolean) => void;
	profileTabView: TypeProfileTab;
	setProfileTabView: (profileTabView: TypeProfileTab) => void;
	setShowUnblockModal: (showUnblockModal: boolean) => void;
}

export const createAppProfileSlice: StateCreator<TypeAppProfileSlice> = (
	set,
) => ({
	userIdProfile: null,
	showUnblockModal: false,

	showProfileLogoutModal: false,
	setShowProfileLogoutModal: (showProfileLogoutModal) =>
		set(() => ({ showProfileLogoutModal })),

	profileTabView: 'profile',
	setProfileTabView: (profileTabView) => set(() => ({ profileTabView })),
	setShowUnblockModal: (showUnblockModal) => set(() => ({ showUnblockModal })),
});
