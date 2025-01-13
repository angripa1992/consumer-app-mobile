import type { TypeProfileListFilter } from '../types/profile';

export const dataProfileTabs = (
	isAuthenticateUser: boolean,
): TypeProfileListFilter[] => {
	return [
		{
			name: isAuthenticateUser ? 'myLists' : 'lists',
			value: 'list',
		},
		{
			name: 'savedLists',
			value: 'followed',
		},
		{
			name: 'spots',
			value: 'spots',
		},
		{
			name: 'scribbles',
			value: 'scribbles',
		},
	];
};

export const dataEditProfileTabs = [
	{
		name: 'profile',
		value: 'profile',
	},
	{
		name: 'qrCard',
		value: 'qr-card',
	},
];
