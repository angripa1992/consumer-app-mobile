import { z } from 'zod';

export type TypePersonPlayFromSchema = z.infer<typeof personPlaySchema>;

export type TypePostSearchPeople = {
	search_content: string;
};
export const personPlaySchema = z.object({
	id: z.number(),
	is_following: z.boolean().optional(),
	name: z.string(),
	profile_image: z.string().nullable(),
});

export const playSchema = z.object({
	popular_people: z.array(personPlaySchema),
});

export const postPlayResultsResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	plays: playSchema,
});

export const postPlayPeopleSchema = z.object({
	code: z.number(),
	message: z.string(),
	peoples: z.array(personPlaySchema),
});