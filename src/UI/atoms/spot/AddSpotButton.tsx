import { PressableProps, TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import PlusIcon from '@/UI/assets/svg/PlusIcon';
import CheckIcon from '@/UI/assets/svg/CheckIcon';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	interpolate,
	interpolateColor,
} from 'react-native-reanimated';

type TypeAddSpotButtonProps = {
	onPlusIconClick: PressableProps['onPress'];
	isFilled?: boolean;
	buttonTestID?: string;
	isDisabled?: boolean;
};

const AddSpotButton = ({
	onPlusIconClick,
	isFilled,
	buttonTestID = 'list-thumbnail-heart-button',
	isDisabled,
}: TypeAddSpotButtonProps) => {
	const animation = useSharedValue(0);

	useEffect(() => {
		animation.value = withSpring(isFilled ? 1 : 0, {
			damping: 8,
			stiffness: 85,
			mass: 1,
		});
	}, [isFilled]);

	const containerStyle = useAnimatedStyle(() => {
		const width = interpolate(
			animation.value,
			[0, 0.3, 0.5, 0.7, 1],
			[60, 40, 20, 40, 60],
		);

		const backgroundColor = interpolateColor(
			animation.value,
			[0, 1],
			['transparent', '#75FBCF'],
		);

		const borderColor = interpolateColor(
			animation.value,
			[0, 1],
			['#b0b0b0', '#75FBCF'],
		);

		return {
			width,
			backgroundColor,
			borderRadius: 16,
			justifyContent: 'center',
			alignItems: 'center',
			borderWidth: 1,
			borderColor,
			paddingVertical: 1,
		};
	});

	const iconStyle = useAnimatedStyle(() => {
		const rotate = `${interpolate(animation.value, [0, 1], [0, 360])}deg`;
		const scale = interpolate(animation.value, [0, 0.5, 1], [1, 0.8, 1]);

		return {
			transform: [{ rotate }, { scale }],
		};
	});

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={(e) => {
				if (onPlusIconClick) {
					onPlusIconClick(e);
				}
			}}
			testID={buttonTestID}
			disabled={isDisabled}
		>
			<Animated.View style={containerStyle}>
				<Animated.View style={iconStyle}>
					{isFilled ? (
						<CheckIcon width={15} height={14} />
					) : (
						<PlusIcon width={'12'} height={'14'} />
					)}
				</Animated.View>
			</Animated.View>
		</TouchableOpacity>
	);
};

export default AddSpotButton;
