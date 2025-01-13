import { View, PressableProps } from 'react-native';

import TextElement from '../text/TextElement';
import ButtonPrimary from './ButtonPrimary';

import HeartIcon from '@/UI/assets/svg/HeartIcon';
import Spinner from '@/UI/atoms/spinner/Spinner';

type TypeButtonHeartProps = {
	onClickFavorite?: PressableProps['onPress'];
	isStatusFavorite?: boolean;
	likesCounter?: number;
	isLoading?: boolean;
	containerStyles?: string;
	isDisabled?: boolean;
	width?: number;
	height?: number;
	testID?: string;
};

const ButtonHeart = ({
	onClickFavorite,
	isStatusFavorite,
	likesCounter,
	isLoading,
	containerStyles = '',
	isDisabled,
	width = 22,
	height = 22,
	testID = 'spot-heart-button',
}: TypeButtonHeartProps) => {
	return (
		<View className={`flex-row ${containerStyles}`}>
			{isLoading ? (
				<View className=''>
					<Spinner isFullPage={false} width={20} height={20} />
				</View>
			) : (
				<>
					{!isDisabled ? (
						<ButtonPrimary
							designVariation='ghost'
							isReactNodeContent
							buttonStyles='border-none p-0'
							nodeContentStyles='flex-row items-center'
							onPress={onClickFavorite}
							hitSlop={2}
							testID={testID}
						>
							<HeartIcon
								color='#B0B0B0'
								fill={isStatusFavorite ? '#B0B0B0' : ''}
								width={width}
								height={height}
							/>
							{!!likesCounter && (
								<TextElement
									textStyles='text-xs ml-1 text-white'
									testID={`${testID}-text`}
								>
									{likesCounter}
								</TextElement>
							)}
						</ButtonPrimary>
					) : (
						<View className='opacity-50 flex-row items-center'>
							<HeartIcon
								color='#B0B0B0'
								fill={isStatusFavorite ? '#B0B0B0' : ''}
								width={width}
								height={height}
							/>
							{!!likesCounter && (
								<TextElement textStyles='text-xs ml-1 text-white'>
									{likesCounter}
								</TextElement>
							)}
						</View>
					)}
				</>
			)}
		</View>
	);
};

export default ButtonHeart;
