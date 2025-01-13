import { z } from 'zod';

export const countrySchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
});

export const countriesSchemaResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	countries: z.array(countrySchema),
});

export const getCountryByIpValuesToSendSchema = z.object({
	user_ip: z.string(),
});

export const getCountryByIpResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	country: z.string(),
});
