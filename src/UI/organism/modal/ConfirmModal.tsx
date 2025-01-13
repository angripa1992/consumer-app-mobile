import { View } from 'react-native';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import ModalTemplate from '@/UI/organism/modal/ModalTemplate';
import TextElement from '@/UI/atoms/text/TextElement';
import AlertIcon from '@/UI/assets/svg/AlertIcon';

interface ConfirmModalProps {
	showConfirmModal: boolean;
	setShowConfirmModal: (show: boolean) => void;
	questionText: string;
	descriptionText?: string;
	confirmButtonText: string;
	cancelButtonText?: string;
	onConfirm: () => void;
	confirmButtonStyles?: string;
	questionTextStyles?: string;
	CustomIcon?: React.ReactNode;
	onCustomCancel?: () => void;
	isShowCancelButton?: boolean;
}

const ConfirmModal = ({
	showConfirmModal,
	setShowConfirmModal,
	questionText,
	descriptionText,
	confirmButtonText,
	cancelButtonText,
	onConfirm,
	confirmButtonStyles,
	questionTextStyles,
	CustomIcon,
	onCustomCancel,
	isShowCancelButton = true,
}: ConfirmModalProps) => {
	const onCancel = () => {
		setShowConfirmModal(false);
	};

	return (
		<ModalTemplate showModal={showConfirmModal} modalPosition='center'>
			<View className='bg-dark-gray rounded-2xl flex flex-col items-center justify-center  p-[8%] w-full z-40 relative'>
				{CustomIcon ? (
					CustomIcon
				) : (
					<AlertIcon width={40} height={40} color='#B0B0B0' />
				)}
				<TextElement
					textStyles={`text-center mt-5 text-gray text-lg mb-5 ${questionTextStyles}`}
				>
					{questionText}
				</TextElement>
				{!!descriptionText && (
					<TextElement textStyles='text-center text-gray text-sm mb-5'>
						{descriptionText}
					</TextElement>
				)}
				{isShowCancelButton && (
					<ButtonPrimary
						buttonStyles='w-full py-2'
						textStyles='text-sm'
						onPress={onCustomCancel ?? onCancel}
						designVariation='white-transparent'
					>
						{cancelButtonText}
					</ButtonPrimary>
				)}
				<ButtonPrimary
					buttonStyles={`w-full mt-5 py-2 ${confirmButtonStyles ?? ''}`}
					textStyles='text-sm'
					onPress={onConfirm}
				>
					{confirmButtonText}
				</ButtonPrimary>
			</View>
		</ModalTemplate>
	);
};

export default ConfirmModal;
