import {
	GestureResponderEvent,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withSequence,
	withTiming,
} from 'react-native-reanimated';

import TextElement from '../text/TextElement';
import { formatBigNumbers } from '@/lib/helpers/numbers/formatBigNumbers';
import HeartIcon from '@/UI/assets/svg/HeartIcon';
import {
	createInitialParticles,
	Particle,
} from '@/lib/helpers/animations/createInitialParticles';
import {
	BUTTON_GRAY_COLOR,
	HEART_BUTTON_PINK_COLOR,
	PARTICLE_COUNT,
} from '@/lib/utils/constants';

type TypeSpotHeartButtonProps = {
	onClickFavorite: (e: GestureResponderEvent) => void;
	hasStatusFavorite: boolean;
	spotLikeCounter?: number | null;
};

const SpotHeartButton = ({
	onClickFavorite,
	hasStatusFavorite,
	spotLikeCounter,
}: TypeSpotHeartButtonProps) => {
	const scale = useSharedValue(1);
	const particles = createInitialParticles();
	const particleScales = Array(PARTICLE_COUNT)
		.fill(0)
		.map(() => useSharedValue(0));
	const particleOpacities = Array(PARTICLE_COUNT)
		.fill(0)
		.map(() => useSharedValue(0));

	const animateHeart = (isFilling: boolean) => {
		scale.value = withSequence(
			withTiming(0.7, { duration: 150 }),
			withSpring(1, { damping: 12, stiffness: 90 }),
		);

		if (isFilling) {
			particles.forEach((_, index) => {
				particleScales[index].value = withSequence(
					withTiming(1, { duration: 200 }),
					withTiming(0, { duration: 200 }),
				);

				particleOpacities[index].value = withSequence(
					withTiming(1, { duration: 50 }),
					withTiming(0, { duration: 350 }),
				);
			});
		}
	};

	const heartStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

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
			backgroundColor: HEART_BUTTON_PINK_COLOR,
			transform: [
				{ translateX: particle.x },
				{ translateY: particle.y },
				{ scale: particleScales[index].value },
			],
			opacity: particleOpacities[index].value,
		}));

		return <Animated.View style={particleStyle} />;
	};

	return (
		<View style={styles.container}>
			{particles.map((particle, index) => (
				<ParticleComponent
					key={particle.id}
					particle={particle}
					index={index}
				/>
			))}
			<View style={styles.containerButton}>
				<Animated.View style={heartStyle}>
					<TouchableOpacity
						onPress={(e) => {
							onClickFavorite(e);
							animateHeart(!hasStatusFavorite);
						}}
						activeOpacity={1}
						hitSlop={3}
					>
						<HeartIcon
							width={25}
							height={25}
							fill={hasStatusFavorite ? HEART_BUTTON_PINK_COLOR : 'none'}
							color={
								hasStatusFavorite ? HEART_BUTTON_PINK_COLOR : BUTTON_GRAY_COLOR
							}
						/>
					</TouchableOpacity>
				</Animated.View>
				{!!spotLikeCounter && (
					<TextElement textStyles='text-xs ml-1 text-white'>
						{formatBigNumbers(spotLikeCounter)}
					</TextElement>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	containerButton: {
		flexDirection: 'row',
		alignItems: 'center',
	},
});

export default SpotHeartButton;
