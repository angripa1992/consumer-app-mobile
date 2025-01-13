import { View } from 'react-native';

import CustomImage from '../image/CustomImage';
import ButtonPrimary from '../button/ButtonPrimary';
import TrashIcon from '@/UI/assets/svg/TrashIcon';

type TypeScribbleImageItemProps = {
	imageSrc: string;
	onPressRemoveIcon: () => void;
};

const ScribbleImageItem = ({
	imageSrc,
	onPressRemoveIcon,
}: TypeScribbleImageItemProps) => {
	return (
		<View className='flex flex-row items-start h-[120px] w-[32%]'>
			<CustomImage
				imageSrc={imageSrc}
				className='w-[85%] aspect-square'
				width={100}
				height={100}
				testID={imageSrc}
			/>
			<ButtonPrimary
				isReactNodeContent
				designVariation='custom'
				buttonStyles='m-0 p-0'
				onPress={onPressRemoveIcon}
				testID='scribble-image-remove-button'
			>
				<TrashIcon />
			</ButtonPrimary>
		</View>
	);
};

export default ScribbleImageItem;
