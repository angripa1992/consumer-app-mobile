import { fireEvent, render } from '@testing-library/react-native';

import ModalWithCloseButton from '@/UI/organism/modal/ModalWithCloseButton';
import TextElement from '@/UI/atoms/text/TextElement';

const { expect } = require('@jest/globals');
import { ReactNode } from 'react';

jest.mock('react-native-modal', () => {
	const ModalMock = ({
		children,
		isVisible,
	}: {
		children: ReactNode;
		isVisible: boolean;
	}) => (isVisible ? children : null);
	return ModalMock;
});

describe('ModalWithCloseButton tests', () => {
	const title = 'Test Modal';
	const content = <TextElement>Modal Content</TextElement>;

	it('should renders correctly when showModal is true', () => {
		const { getByText } = render(
			<ModalWithCloseButton
				title={title}
				showModal={true}
				setShowModal={() => {}}
				content={content}
			/>,
		);

		expect(getByText(title)).toBeVisible();
		expect(getByText('Modal Content')).toBeVisible();
	});

	it('should does not render when showModal is false', () => {
		const { queryByText } = render(
			<ModalWithCloseButton
				title={title}
				showModal={false}
				setShowModal={() => {}}
				content={content}
			/>,
		);

		expect(queryByText(title)).not.toBeVisible();
	});

	it('closes the modal when the close button is pressed', () => {
		const setShowModalMock = jest.fn();

		const { getByTestId } = render(
			<ModalWithCloseButton
				title={title}
				showModal={true}
				setShowModal={setShowModalMock}
				content={content}
			/>,
		);

		fireEvent.press(getByTestId('close-modal-button'));
		expect(setShowModalMock).toHaveBeenCalledWith(false);
	});
});
