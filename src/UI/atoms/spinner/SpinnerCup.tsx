import { View } from 'react-native';

import { Video, ResizeMode } from 'expo-av';

type SpinnerProps = {
	width?: number;
	height?: number;
	isFullPage?: boolean;
	containerStyles?: string;
};

const SpinnerCup = ({
	width = 120,
	height = 120,
	isFullPage = true,
	containerStyles,
}: SpinnerProps) => {
	if (!isFullPage) {
		return (
			<Video
				style={{
					width,
					height,
				}}
				source={require('../../assets/videos/loader-cup.mp4')}
				resizeMode={ResizeMode.CONTAIN}
				className='flex-1'
				shouldPlay
				isLooping
				isMuted
			/>
		);
	}

	return (
		<View
			className={`absolute left-0 top-0 w-full h-full flex justify-center items-center ${
				containerStyles ?? ''
			}`}
		>
			<View className='w-[200px] h-[200px]'>
				<Video
					resizeMode={ResizeMode.CONTAIN}
					className='flex-1'
					source={require('../../assets/videos/loader-cup.mp4')}
					shouldPlay
					isLooping
					isMuted
				/>
			</View>
		</View>
	);
};

export default SpinnerCup;
