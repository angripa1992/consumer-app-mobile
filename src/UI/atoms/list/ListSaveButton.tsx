import { TouchableOpacity, View } from 'react-native';
import { memo } from 'react';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withSequence,
	withTiming,
	interpolateColor,
	useAnimatedProps,
} from 'react-native-reanimated';

import { GestureResponderEvent } from 'react-native-modal';
import TextElement from '../text/TextElement';
import { formatBigNumbers } from '@/lib/helpers/numbers/formatBigNumbers';
import SavedIcon from '@/UI/assets/svg/SavedIcon';
import {
	LIST_BUTTON_YELLOW_COLOR,
	PARTICLE_COUNT,
} from '@/lib/utils/constants';
import {
	createInitialParticles,
	Particle,
} from '@/lib/helpers/animations/createInitialParticles';

type TypeListSaveButtonProps = {
	onPressSaveList: (e: GestureResponderEvent) => void;
	isSavedList: boolean;
	listSavesCounter?: number;
	buttonTestID?: string;
	designVariation?: 'feed' | 'list';
	disableButton?: boolean;
	buttonSize?: 'md' | 'lg';
	customClassButtonContainer?: string;
	widthIcon?: number;
	heightIcon?: number;
};

const ListSaveButton = ({
	onPressSaveList,
	isSavedList,
	listSavesCounter,
	buttonTestID,
	designVariation = 'list',
	disableButton,
	customClassButtonContainer,
	buttonSize = 'md',
	widthIcon = 17,
	heightIcon = 17,
}: TypeListSaveButtonProps) => {
	const followFill = isSavedList ? LIST_BUTTON_YELLOW_COLOR : '';
	// Animation setup
	const scale = useSharedValue(1);
	const rotation = useSharedValue(0);
	const fillColor = useSharedValue(isSavedList ? 1 : 0);

	const particles = createInitialParticles();
	const particleScales = Array(PARTICLE_COUNT)
		.fill(0)
		.map(() => useSharedValue(0));
	const particleOpacities = Array(PARTICLE_COUNT)
		.fill(0)
		.map(() => useSharedValue(0));

	const animateIcon = (isFilling: boolean) => {
		fillColor.value = withTiming(1, { duration: 300 });

		scale.value = withSequence(
			withTiming(0.7, { duration: 150 }),
			withSpring(1, { damping: 12, stiffness: 90 }),
		);

		if (isFilling) {
			// Rotate 20 degrees when saving
			rotation.value = withSequence(
				withTiming(20, { duration: 150 }),
				withSpring(0, { damping: 12, stiffness: 90 }),
			);
			// Animate color from transparent to grey to yellow

			particles.forEach((_, index) => {
				particleScales[index].value = withSequence(
					withTiming(1, { duration: 200 }),
					withTiming(0, { duration: 200 }),
				);

				particleOpacities[index].value = withSequence(
					withTiming(1, { duration: 50 }),
					withSpring(0, { damping: 12, stiffness: 90 }),
					withTiming(0, { duration: 350 }),
				);
			});
		} else {
			// Reset rotation and color when unsaving
			rotation.value = withSequence(
				withTiming(20, { duration: 150 }),
				withSpring(0, { damping: 12, stiffness: 90 }),
			);
		}
	};

	const iconStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
		};
	});

	const ParticleComponent = ({
		particle,
		index,
	}: {
		particle: Particle;
		index: number;
	}) => {
		const particleStyle = useAnimatedStyle(() => ({
			position: 'absolute',
			width: 3,
			height: 3,
			borderRadius: 1.5,
			backgroundColor: LIST_BUTTON_YELLOW_COLOR,
			transform: [
				{ translateX: particle.x },
				{ translateY: particle.y },
				{ scale: particleScales[index].value },
			],
			opacity: particleOpacities[index].value,
			left: 8,
		}));

		return <Animated.View style={particleStyle} />;
	};

	return (
		<View className='flex-row relative'>
			<View className={customClassButtonContainer}>
				{particles.map((particle, index) => (
					<ParticleComponent
						key={particle.id}
						particle={particle}
						index={index}
					/>
				))}
				<Animated.View style={iconStyle}>
					<TouchableOpacity
						hitSlop={3}
						activeOpacity={1}
						onPress={(e) => {
							onPressSaveList(e);
							animateIcon(!isSavedList);
						}}
						testID={`saved-${buttonTestID}`}
						disabled={disableButton}
					>
						<SavedIcon
							isBig
							width={widthIcon}
							height={heightIcon}
							fill={followFill}
						/>
					</TouchableOpacity>
				</Animated.View>
			</View>

			{!!listSavesCounter && (
				<TextElement
					textStyles={`text-xs text-gray ml-1`}
					testID='spot-list-follow-button'
				>
					{formatBigNumbers(listSavesCounter)}
				</TextElement>
			)}
		</View>
	);
};

export default memo(ListSaveButton);
