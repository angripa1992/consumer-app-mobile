import { z } from 'zod';
import { getAllAreasByCityValuesSchema } from '../schemas/cities';

export type TypeGetAllAreasByCityValuesSchema = z.infer<
	typeof getAllAreasByCityValuesSchema
>;
