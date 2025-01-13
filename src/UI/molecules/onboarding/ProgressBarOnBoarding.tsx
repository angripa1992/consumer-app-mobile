import { View } from 'react-native';
import { Image } from 'expo-image';
import ProgressBarBackground from '@/images/progress-bar-background.png';

interface ProgressBarOnBoardingProps {
	progress: number;
}
const ProgressBarOnBoarding = ({ progress }: ProgressBarOnBoardingProps) => {
	return (
		<View className='bg-admin-tag-gray rounded-full w-full h-[10px] mb-10 overflow-hidden'>
			<Image
				source={ProgressBarBackground}
				className='h-[16px] rounded-full'
				style={{ width: `${progress}%` }}
			/>
		</View>
	);
};

export default ProgressBarOnBoarding;
