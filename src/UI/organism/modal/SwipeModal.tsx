import { Dispatch, ReactNode, SetStateAction } from 'react';
import Modal from 'react-native-modal';
type SwipeModalProps = {
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>> | ((value: boolean) => void);
	children: ReactNode;
	swipeDirection?: 'up' | 'left' | 'right' | 'down';
	avoidKeyboard?: boolean;
	isPropagateSwipe?: boolean;
	onModalHide?: () => void;
};

const SwipeModal = ({
	children,
	showModal,
	setShowModal,
	swipeDirection = 'down',
	avoidKeyboard = false,
	isPropagateSwipe = false,
	onModalHide,
}: SwipeModalProps) => {
	const hideModal = () => {
		setShowModal(false);
	};
	return (
		<Modal
			avoidKeyboard={avoidKeyboard}
			swipeDirection={swipeDirection}
			isVisible={showModal}
			onSwipeComplete={hideModal}
			onBackdropPress={hideModal}
			propagateSwipe={isPropagateSwipe}
			onModalHide={onModalHide}
			style={{ justifyContent: 'flex-end', margin: 0 }}
		>
			{children}
		</Modal>
	);
};

export default SwipeModal;
