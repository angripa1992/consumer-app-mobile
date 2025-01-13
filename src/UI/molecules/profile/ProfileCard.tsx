import { Image, View } from 'react-native';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import defaultImage from '@/images/default-image.png';

type TypeProfileCardProps = {
	imageUrl?: string | null;
	name: string;
	username: string;
	onPressCard: () => void;
};

const ProfileCard = ({
	imageUrl,
	name,
	username,
	onPressCard,
}: TypeProfileCardProps) => {
	return (
		<ButtonPrimary
			buttonStyles='bg-transparent p-0'
			isReactNodeContent
			nodeContentStyles='flex flex-row mb-6'
			onPress={onPressCard}
		>
			<Image
				source={imageUrl ? { uri: imageUrl } : defaultImage}
				width={100}
				height={100}
				className='rounded-full'
			/>
			<View className='flex justify-around ml-4 w-[60%]'>
				<View className='flex flex-row justify-between '>
					<TextElement textStyles='text-gray font-bold text-[14px]'>
						{name}
					</TextElement>
					<TextElement textStyles='text-gray ml-1'>{username}</TextElement>
				</View>
			</View>
		</ButtonPrimary>
	);
};

export default ProfileCard;
