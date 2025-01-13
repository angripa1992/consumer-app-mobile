import { render, fireEvent, screen } from '@testing-library/react-native';
import ErrorTemplate from '@/UI/organism/error/ErrorTemplate';
import { Text } from 'react-native';
const { expect } = require('@jest/globals');

jest.mock('expo-image', () => ({
	Image: 'Image',
}));

describe('ErrorTemplate Component', () => {
	it('renders general error correctly', () => {
		const handleBackToHomePage = jest.fn();
		render(
			<ErrorTemplate
				onClickButton={handleBackToHomePage}
				typeError='notFound'
			/>,
		);

		expect(screen.getByTestId('not-found-error-description')).toBeVisible();
		expect(screen.getByTestId('title-error')).toBeVisible();
		expect(screen.getByTestId('back-button')).toBeVisible();
	});

	it('renders custom error correctly', () => {
		const handleBackToHomePage = jest.fn();
		const customTitle = 'custom title';
		const customDescription = 'custom description';
		const customButton = 'custom button';

		const { getByText } = render(
			<ErrorTemplate
				onClickButton={handleBackToHomePage}
				title={customTitle}
				descriptionContent={<Text>{customDescription}</Text>}
				buttonText={customButton}
				typeError='custom'
			/>,
		);

		expect(getByText(customTitle)).toBeVisible();
		expect(getByText(customDescription)).toBeVisible();
		expect(getByText(customButton)).toBeVisible();
	});

	it('calls handleBackToHomePage when Go Home button is pressed', () => {
		const handleBackToHomePage = jest.fn();
		render(<ErrorTemplate onClickButton={handleBackToHomePage} />);

		const goHomeButton = screen.getByTestId('back-button');
		fireEvent.press(goHomeButton);

		expect(handleBackToHomePage).toHaveBeenCalledTimes(1);
	});
});
