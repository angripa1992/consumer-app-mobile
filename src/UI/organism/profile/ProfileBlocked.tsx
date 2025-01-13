import { View } from 'react-native';
import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

type TypeProfileBlockedProps = {
	setShowConfirmationModal: (value: boolean) => void;
};

const ProfileBlocked = ({
	setShowConfirmationModal,
}: TypeProfileBlockedProps) => {
	return (
		<View className='flex flex-col items-center mt-[30%]'>
			<TextElement textStyles='text-white text-center mb-6'>
				You have blocked this user.
			</TextElement>
			<ButtonPrimary
				onPress={() => {
					setShowConfirmationModal(true);
				}}
				buttonStyles='w-[130px]'
			>
				Unblock profile
			</ButtonPrimary>
		</View>
	);
};

export default ProfileBlocked;
