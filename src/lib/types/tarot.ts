import { z } from 'zod';
import {
	singleTarotUserSchema,
	tarotCardFormSchema,
	updateTarotCardValuesSchema,
	emojiTarotFormSchema,
	singleTarotEmojiSchema,
	tarotShapesEnum,
} from '../schemas/tarot';

export type TarotProfileImageSize = 'xs' | 'md' | 'sm' | 'lg' | 'medium';

export type TypeTarotCardForm = z.infer<typeof tarotCardFormSchema>;

export type TypeEmojiTarotForm = z.infer<typeof emojiTarotFormSchema>;

export type TypeSingleTarotUser = z.infer<typeof singleTarotUserSchema>;

export type TypeSingleTarotEmoji = z.infer<typeof singleTarotEmojiSchema>;

export type TypeUpdateTarotCardValues = z.infer<
	typeof updateTarotCardValuesSchema
>;

export type TypeTarotShape = z.infer<typeof tarotShapesEnum>;
