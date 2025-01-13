import { z } from 'zod';
import { onboardingFormSchema } from '../schemas/onboarding';

export type TypeOnboardingFormSchema = z.infer<typeof onboardingFormSchema>;

export type TypePostOnboardingPreferences = {
	tags: Array<string> | null;
	profiles_to_follow: Array<number> | null;
	spot_lists_to_follow: Array<number> | null;
};
