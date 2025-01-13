export interface AppUser {
	name: string;
	email: string;
}

export interface AppState {
	appUser?: AppUser;
}
export interface AppStore {
	state?: AppState;
}

export type TypeFilterTabsData = {
	name: string;
	value: string;
};

export type TypeShareEntity = 'spot' | 'spotList' | 'user' | 'app';

export type TypeLanguageCodes = 'en' | 'id' | 'jp' | 'th' | 'cht';

export type TypeLanguageOptions = {
	label: string;
	value: TypeLanguageCodes;
};
