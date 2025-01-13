import { render } from '@testing-library/react-native';
import TarotTitle from '@/UI/atoms/tarot/TarotTitle';

describe('TarotTitle tests', () => {
	it('should renders the title correctly', () => {
		const title = 'Test Title';
		const { getByText } = render(<TarotTitle title={title} />);
		expect(getByText(title)).toBeTruthy();
	});
});
