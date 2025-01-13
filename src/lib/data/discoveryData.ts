import { TypeDiscoveryTabOption } from '../types/discovery';

interface TypeDiscoveryTab {
	label: string;
	value: TypeDiscoveryTabOption;
}

export const dataDiscoveryTabs: TypeDiscoveryTab[] = [
	{
		label: 'all',
		value: 'all',
	},
	{
		label: 'categories',
		value: 'categories',
	},
	{
		label: 'spots',
		value: 'spot',
	},
	{
		label: 'people',
		value: 'user',
	},
	{
		label: 'lists',
		value: 'spotList',
	},
];
