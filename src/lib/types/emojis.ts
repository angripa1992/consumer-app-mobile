import { z } from 'zod';
import { emojiFromEventSchema } from '../schemas/emojis';

export type TypeEmojiFromEvent = z.infer<typeof emojiFromEventSchema>;
