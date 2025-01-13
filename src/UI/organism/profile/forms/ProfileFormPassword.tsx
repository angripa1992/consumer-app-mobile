import { useForm } from 'react-hook-form';

import { View } from 'react-native';

import type { TypeProfileFormPassword } from '@/lib/types/profile';
import TextElement from '@/UI/atoms/text/TextElement';

type TypeProfileFormPasswordProps = {
	onSubmit: (passwordData: TypeProfileFormPassword) => void;
};

const ProfileFormPassword = ({ onSubmit }: TypeProfileFormPasswordProps) => {
	const { control, watch, setValue, handleSubmit } =
		useForm<TypeProfileFormPassword>();

	return (
		<View>
			<TextElement>Recovery Password Form</TextElement>
		</View>
	);
};

export default ProfileFormPassword;
