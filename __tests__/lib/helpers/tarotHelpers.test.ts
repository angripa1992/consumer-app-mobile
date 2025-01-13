import {
	getDefaultTarotEmoji,
	updateTarotEmojiValueToSend,
	findTarotEmojiByOrder,
} from '@/lib/helpers/tarotHelpers';
import { TypeEmojiTarotForm, TypeSingleTarotEmoji } from '@/lib/types/tarot';

describe('Tarot helpers functions', () => {
	describe('updateTarotEmojiValueToSend', () => {
		it('should return object with tarot_emoji_id and empty code when emoji is not provided', () => {
			const result = updateTarotEmojiValueToSend(1, undefined);
			expect(result).toEqual({
				tarot_emoji_id: 1,
				code: '',
			});
		});

		it('should return object with tarot_emoji_id, code, and slug when emoji is provided', () => {
			const emoji: TypeEmojiTarotForm = {
				code: '😊',
				slug: 'smiling-face',
			};
			const result = updateTarotEmojiValueToSend(2, emoji);
			expect(result).toEqual({
				tarot_emoji_id: 2,
				code: '😊',
				slug: 'smiling-face',
			});
		});
	});

	describe('getDefaultTarotEmoji', () => {
		it('should return undefined when emoji is not provided', () => {
			const result = getDefaultTarotEmoji(undefined);
			expect(result).toBeUndefined();
		});

		it('should return object with code when emoji is provided', () => {
			const emoji: TypeSingleTarotEmoji = {
				code: '🌟',
				tarot_emoji_id: 1,
				slug: 'star',
				order: 1,
			};
			const result = getDefaultTarotEmoji(emoji);
			expect(result).toEqual({
				code: '🌟',
				slug: 'star',
			});
		});
	});

	describe('findTarotEmojiByOrder', () => {
		it('should return undefined when emoji with order is not found', () => {
			const emojis: (TypeSingleTarotEmoji | undefined)[] = [
				{
					code: '🌟',
					tarot_emoji_id: 1,
					slug: 'star',
					order: 2,
				},
				{
					code: '🌙',
					tarot_emoji_id: 2,
					slug: 'moon',
					order: 3,
				},
			];
			const result = findTarotEmojiByOrder(emojis, 1);
			expect(result).toBeUndefined();
		});

		it('should return emoji with order when emoji with order is found', () => {
			const emojis: (TypeSingleTarotEmoji | undefined)[] = [
				{
					code: '🌟',
					tarot_emoji_id: 1,
					slug: 'star',
					order: 1,
				},
				{
					code: '🌙',
					tarot_emoji_id: 2,
					slug: 'moon',
					order: 2,
				},
			];
			const result = findTarotEmojiByOrder(emojis, 1);
			expect(result).toEqual({
				code: '🌟',
				tarot_emoji_id: 1,
				slug: 'star',
				order: 1,
			});
		});
	});
});
