import { z } from 'zod';

import { userSchema } from './user';

export const onboardingFormSchema = z.object({
	tags: z.array(z.string()),
	relevantUsers: z.array(z.number()),
	relevantLists: z.array(z.number()),
});

export const postOnboardingPreferencesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	user: userSchema,
});
