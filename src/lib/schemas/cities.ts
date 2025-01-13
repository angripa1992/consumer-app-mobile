import { z } from 'zod';

export const citiesSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
	country_id: z.number(),
	country: z.string(),
});

export const citiesSchemaResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	cities: z.array(citiesSchema),
});

export const singleActiveCitySchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const getAllActiveCitiesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	cities: z.array(singleActiveCitySchema),
});

export const getAllAreasByCityValuesSchema = z.object({
	city_name: z.string().optional(),
	city_id: z.number().optional(),
});

export const areaSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const getAllAreasByCityResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	areas: z.array(areaSchema),
});
