import { TypeSingleListSpotsFilter } from '../types/listFilter';

export const singleListSpotsFilterData: TypeSingleListSpotsFilter[] = [
	{
		name: 'All',
		value: 'all',
	},
	{
		name: 'Liked',
		value: 'is_like_spot',
	},
	{
		name: 'Visited',
		value: 'is_been_to',
	},
];
