import {
	Platform,
	Keyboard,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
} from 'react-native';
import ForgotPasswordForm from '@/UI/organism/login/ForgotPasswordForm';

const ForgotPassword = () => {
	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			className='flex-1'
		>
			<TouchableWithoutFeedback touchSoundDisabled onPress={Keyboard.dismiss}>
				<ForgotPasswordForm />
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default ForgotPassword;
