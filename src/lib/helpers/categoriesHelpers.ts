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

	return Object.entries(categories).map(([category_name, data]) => {
		let category_name_to_render = '';

		if (category_name === 'liked_list') {
			category_name_to_render = 'listsYouLiked';
		} else {
			category_name_to_render = `${fromSnakeCaseToCamelCase(category_name)}${isPlural ? 's' : ''}`;
		}

		return {
			category_name,
			category_name_to_render,
			data,
		};
	});
};
