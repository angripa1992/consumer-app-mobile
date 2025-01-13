import { render, fireEvent } from '@testing-library/react-native';

import ScribbleImageItem from '@/UI/atoms/scribble/ScribbleImageItem';

jest.mock('expo-image', () => ({
	Image: 'Image',
}));

describe('ScribbleImageItem tests', () => {
	it('should render an image with a url given', () => {
		const imageSrc = 'testing-image-123';

		const { getByTestId } = render(
			<ScribbleImageItem imageSrc={imageSrc} onPressRemoveIcon={() => {}} />,
		);

		expect(getByTestId(imageSrc)).toBeTruthy();
	});
	it('should call remove function when trash icon is clicked', () => {
		const imageSrc = 'testing-image-123';
		const removeFunction = jest.fn();

		const { getByTestId } = render(
			<ScribbleImageItem
				imageSrc={imageSrc}
				onPressRemoveIcon={removeFunction}
			/>,
		);
		const removeButton = getByTestId('scribble-image-remove-button');
		fireEvent.press(removeButton);

		expect(removeFunction).toHaveBeenCalledTimes(1);
	});
});
