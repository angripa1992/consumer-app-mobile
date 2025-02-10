import { z } from 'zod';

export type TypePersonPlayFromSchema = z.infer<typeof personPlaySchema>;

export const personPlaySchema = z.object({
	id: z.number(),
	is_following: z.boolean().optional(),
	name: z.string(),
	profile_image: z.string().nullable(),
});

export type TypePlayResults = z.infer<typeof discoveriesSchema>;

export const discoveriesSchema = z.object({
    people: z.array(personPlaySchema),
});