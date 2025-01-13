import { z } from 'zod';
import { tagsSchema } from '../schemas/tags';

export type TagOption<T> = {
	label: string;
	value: T;
	icon?: string | null;
	color?: string | null;
};

export type TagOptionNumber = TagOption<number>;
export type TagOptionString = TagOption<string>;

export type TypeTags = z.infer<typeof tagsSchema>;
