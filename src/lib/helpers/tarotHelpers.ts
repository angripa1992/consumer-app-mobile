import { TypeEmojiTarotForm, TypeSingleTarotEmoji } from '../types/tarot';

export const updateTarotEmojiValueToSend = (
	tarotEmojiId: number | null | undefined,
	emoji: TypeEmojiTarotForm | null | undefined,
) => {
	if (!emoji)
		return {
			tarot_emoji_id: tarotEmojiId ?? null,
			code: '',
		};

	return {
		tarot_emoji_id: tarotEmojiId ?? null,
		code: emoji.code,
		slug: emoji.slug,
	};
};

export const getDefaultTarotEmoji = (
	emoji: TypeSingleTarotEmoji | null | undefined,
) => {
	if (!emoji || !emoji.code || !emoji.slug) return undefined;
	return {
		code: emoji.code,
		slug: emoji.slug,
	};
};

export const findTarotEmojiByOrder = (
	emojis: (TypeSingleTarotEmoji | undefined)[],
	order: number,
) => {
	return emojis.find((emoji) => emoji?.order === order);
};
