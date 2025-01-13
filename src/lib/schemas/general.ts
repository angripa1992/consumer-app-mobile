import { z } from 'zod';
import { isValidUrl } from '../helpers/isValidUrl';

export const refineWebsiteUrl = z
	.string()
	.trim()
	.toLowerCase()
	.nullable()
	.refine(
		async (url) => {
			if (!url) return true;
			return await isValidUrl(url);
		},
		{
			message: 'enterValidUrl',
		},
	);
