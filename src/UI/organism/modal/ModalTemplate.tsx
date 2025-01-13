import { View } from 'react-native';
import Modal from 'react-native-modal';

import { type ReactNode } from 'react';

type TypeModalTemplateProps = {
	showModal: boolean;
	children: ReactNode;
	setShowModal?: (value: boolean) => void;
	onHideModal?: () => void;
	modalPosition?: 'center' | 'top' | 'bottom';
};

const ModalTemplate = ({
	showModal,
	children,
	setShowModal,
	onHideModal,
	modalPosition = 'center',
}: TypeModalTemplateProps) => {
	const renderModalPosition = () => {
		if (modalPosition === 'center') {
			return 'justify-center';
		}
		if (modalPosition === 'top') {
			return 'justify-start';
		}
		if (modalPosition === 'bottom') {
			return 'justify-end';
		}
	};

	const hideModal = () => {
		setShowModal && setShowModal(false);
		onHideModal && onHideModal();
	};

	return (
		<Modal
			onBackdropPress={hideModal}
			isVisible={showModal}
			animationIn='fadeIn'
			animationOut='fadeOut'
			className={`flex-1 items-center ${renderModalPosition()}`}
		>
			{children}
		</Modal>
	);
};

export default ModalTemplate;
