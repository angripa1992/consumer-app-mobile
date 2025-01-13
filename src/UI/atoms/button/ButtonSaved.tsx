import { PressableProps, View } from 'react-native';

import ButtonPrimary from './ButtonPrimary';
import Spinner from '../spinner/Spinner';

import SavedIcon from '@/UI/assets/svg/SavedIcon';
import TextElement from '../text/TextElement';

type TypeButtonSavedProps = {
	onClickSaved?: PressableProps['onPress'];
	isStatusSaved?: boolean;
	isLoading?: boolean;
	isDisabled?: boolean;
	width?: number;
	height?: number;
	testID?: string;
	counter?: number;
	isSpotListOwner?: boolean;
};

const ButtonSaved = ({
	onClickSaved,
	isStatusSaved,
	isLoading,
	isDisabled,
	width = 22,
	height = 22,
	testID = 'spot-saved-button',
	counter,
	isSpotListOwner,
}: TypeButtonSavedProps) => {
	return (
		<View>
			{isLoading ? (
				<View>
					<Spinner isFullPage={false} width={20} height={20} />
				</View>
			) : (
				<>
					{!isDisabled ? (
						<ButtonPrimary
							designVariation='ghost'
							isReactNodeContent
							buttonStyles={`border-none p-0  ml-auto`}
							nodeContentStyles='flex flex-row items-center justify-center'
							onPress={onClickSaved}
							hitSlop={2}
							testID={testID}
						>
							<SavedIcon
								color={isSpotListOwner ? '#575757' : '#B0B0B0'}
								width={width}
								height={height}
								fill={isStatusSaved ? '#B0B0B0' : ''}
							/>
							{!!counter && (
								<TextElement
									textStyles={`text-xs ml-1 ${isSpotListOwner ? 'text-[#575757]' : 'text-white'}`}
								>
									{counter}
								</TextElement>
							)}
						</ButtonPrimary>
					) : (
						<View className='opacity-50 flex-row items-center'>
							<SavedIcon
								color={isSpotListOwner ? '#575757' : '#B0B0B0'}
								width={width}
								height={height}
								fill={isStatusSaved ? '#B0B0B0' : ''}
							/>
							{!!counter && (
								<TextElement textStyles='text-xs ml-1 text-white'>
									{counter}
								</TextElement>
							)}
						</View>
					)}
				</>
			)}
		</View>
	);
};

export default ButtonSaved;
