import { View } from 'react-native';

import TextElement from '@/UI/atoms/text/TextElement';
import ModalTemplate from './ModalTemplate';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import CloseIcon from '@/UI/assets/svg/CloseIcon';

import type { ReactNode } from 'react';

type TypeModalWithCloseButtonProps = {
	title: string;
	showModal: boolean;
	setShowModal: (value: boolean) => void;
	content: ReactNode;
};

const ModalWithCloseButton = ({
	title,
	showModal,
	setShowModal,
	content,
}: TypeModalWithCloseButtonProps) => {
	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<ModalTemplate showModal={showModal} setShowModal={setShowModal}>
			<View className='bg-dark-gray px-4 rounded-lg z-50 absolute w-full py-6'>
				<View className='flex flex-row justify-between items-start'>
					<TextElement designVariation='subtitle'>{title}</TextElement>
					<ButtonPrimary
						onPress={handleCloseModal}
						designVariation='custom'
						hitSlop={5}
						buttonStyles='bg-transparent'
						testID='close-modal-button'
					>
						<CloseIcon width={23} height={23} />
					</ButtonPrimary>
				</View>
				<View className='mt-4'>{content}</View>
			</View>
		</ModalTemplate>
	);
};

export default ModalWithCloseButton;
