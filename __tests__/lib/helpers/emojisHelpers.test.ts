import {
	charFromEmojiUnified,
	charactersToEmojiCode,
} from '@/lib/helpers/strings/emojisHelpers';

describe('emojisHelpers', () => {
	describe('charFromEmojiUnified', () => {
		it('should return a character from a unified emoji', () => {
			expect(charFromEmojiUnified('1F600')).toBe('😀');
		});
	});

	describe('charactersToEmojiCode', () => {
		it('should return the code of an emoji character', () => {
			expect(charactersToEmojiCode('😀')).toBe('1F600');
		});
	});
});
