import pluralize from 'pluralize';
import { fromSnakeCaseToCamelCase } from './strings/fromSnakeCaseToCamelCase';

interface Categories<T> {
	[key: string]: T[];
}

interface CategoryResult<T> {
	category_name: string;
	category_name_to_render: string;
	data: T[];
}

export const getCategoriesNameAndData = <T>(
	categories: Categories<T> | undefined,
	isPlural?: boolean,
): CategoryResult<T>[] => {
	if (!categories) return [];

	return Object.entries(categories).map(([category_name, data]) => ({
		category_name,
		category_name_to_render: category_name === 'liked_list' 
			? 'listsYouLiked' 
			: `${fromSnakeCaseToCamelCase(category_name.replace(/_?category$/i, ''))}${isPlural ? 's' : ''}`,
		data,
	}));
};
