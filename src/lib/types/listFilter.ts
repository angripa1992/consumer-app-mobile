import { z } from 'zod';
import {
	locationFilterValidationSchema,
	locationSearchQuerySchema,
} from '../schemas/discovery';
import type { TypeStatusTagsSchema } from './spot';

export type TypeLocationFilter = z.infer<typeof locationFilterValidationSchema>;

export type TypeSingleListSpotsFilterValue = 'all' | keyof TypeStatusTagsSchema;

export type TypeLocationSearchQuery = z.infer<typeof locationSearchQuerySchema>;

export type TypeSingleListSpotsFilter = {
	name: string;
	value: TypeSingleListSpotsFilterValue;
};
