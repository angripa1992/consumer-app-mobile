import { z } from 'zod';
import { getCountryByIpValuesToSendSchema } from '../schemas/countries';

export type TypeGetCountryByIpValuesToSend = z.infer<
	typeof getCountryByIpValuesToSendSchema
>;
