import { z } from 'zod';

export const emojiFromEventSchema = z.object({
	code_variations: z.array(z.string()),
	variations_code_id: z.string().nullable(),
	code: z.string(),
	emoji_counter: z.number(),
	event_emoji_id: z.number().nullable(),
	slug: z.string(),
});
