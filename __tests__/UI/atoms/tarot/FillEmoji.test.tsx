import { render } from '@testing-library/react-native';
import FillEmoji from '@/UI/atoms/tarot/FillEmoji';
import { charFromEmojiUnified } from '@/lib/helpers/strings/emojisHelpers';

describe('FillEmoji tests', () => {
	it('should renders the emoji when provided', () => {
		const emoji = '1F617';
		const { getByText } = render(<FillEmoji emojiCode={emoji} />);
		expect(getByText(charFromEmojiUnified(emoji))).toBeTruthy();
	});

	it('should renders the FillEmojiIcon when emoji is null', () => {
		const { getByTestId } = render(<FillEmoji emojiCode={undefined} />);
		expect(getByTestId('empty-emoji-icon')).toBeTruthy();
	});
});
