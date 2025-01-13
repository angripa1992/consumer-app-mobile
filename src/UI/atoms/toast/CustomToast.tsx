import { TouchableOpacity, View } from 'react-native';
import { ToastProps } from 'react-native-toast-notifications/lib/typescript/toast';
import { useToast } from 'react-native-toast-notifications';
import TextElement from '../text/TextElement';
import CloseIcon from '@/svg/CloseIcon';

interface CustomToastProps {
	options: ToastProps;
}

interface ToastData {
	item?: string;
	message?: string;
}

const CustomToast = ({ options }: CustomToastProps) => {
	const toast = useToast();
	const data = options.data as ToastData;

	const iconToShow = () => {
		if (options.type === 'success') {
			return options.successIcon;
		}
		if (options.type === 'danger') {
			return options.dangerIcon;
		}
		return options.icon;
	};

	const onClose = () => {
		toast.hide(options.id);
	};

	return (
		<View className='flex flex-row items-center bg-dark-gray rounded-2xl  py-4 px-3 w-[95%] shadow-lg '>
			<View className='mr-3'>{iconToShow()}</View>
			{data?.item ? (
				<TextElement textStyles='text-gray flex-1'>
					{data.item}{' '}
					<TextElement textStyles='text-white'>{data?.message}</TextElement>{' '}
				</TextElement>
			) : (
				<TextElement textStyles='text-gray flex-1 '>
					{options.message}
				</TextElement>
			)}
			<TouchableOpacity
				activeOpacity={1}
				className='ml-auto'
				hitSlop={5}
				onPress={onClose}
				testID='close-toast'
			>
				<CloseIcon color='#FFF' />
			</TouchableOpacity>
		</View>
	);
};

export default CustomToast;
