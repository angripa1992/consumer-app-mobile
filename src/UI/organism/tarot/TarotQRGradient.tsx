import { TouchableOpacity, View } from 'react-native';
import { QrCodeSvg } from 'react-native-qr-svg';
import Animated from 'react-native-reanimated';
import { GestureDetector, GestureType } from 'react-native-gesture-handler';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import useTarotQRGradient from '@/lib/hooks/useTarotQRGradient';
import { TAROT_CARD_HEIGHT, TAROT_CARD_WIDTH } from '@/lib/utils/constants';

import TarotProfileImage from '../profile/tarot/TarotProfileImage';
import TarotTitle from '@/UI/atoms/tarot/TarotTitle';
import TextElement from '@/UI/atoms/text/TextElement';
import FillEmoji from '@/UI/atoms/tarot/FillEmoji';

import type { TypeTarotShape } from '@/lib/types/tarot';
import { i18nInstance } from 'config/i18n';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

type TypeTarotQRGradientProps = {
	title: string;
	profileLink: string;
	userNickname: string;
	userImage?: string | null;
	userEmojiOne: string | null | undefined;
	userEmojiTwo: string | null | undefined;
	userEmojiThree: string | null | undefined;
	dateCreation: string;
	userShape: TypeTarotShape;
	tarotImage: string;
	scrollViewRef: React.RefObject<GestureType>;
	tarotColors: string[];
	showTarotTitle: boolean;
	showTarotImage: boolean;
	tarotCode: string;
	isAuthenticateUser: boolean;
	onPressCustomize: () => void;
};

const TarotQRGradient = ({
	title,
	userNickname,
	profileLink,
	userImage,
	userEmojiOne,
	userEmojiTwo,
	userEmojiThree,
	dateCreation,
	userShape,
	tarotImage,
	scrollViewRef,
	tarotColors,
	showTarotTitle,
	showTarotImage,
	isAuthenticateUser,
	onPressCustomize,
}: TypeTarotQRGradientProps) => {
	const {
		renderShape,
		regularCardAnimatedStyle,
		flippedCardAnimatedStyle,
		handleCardPress,
	} = useTarotQRGradient({
		scrollViewRef,
		userShape,
		userImage,
		tarotImage,
		direction: 'y',
	});

	return (
		<View className={`rotate-2 relative  mb-10`} shouldRasterizeIOS={true}>
			<TouchableOpacity activeOpacity={1} onPress={handleCardPress}>
				<Animated.View
					className=' bg-slate-50 absolute overflow-hidden  justify-between items-center rounded-2xl'
					style={[
						{
							width: TAROT_CARD_WIDTH,
							height: TAROT_CARD_HEIGHT,
							zIndex: 1,
						},
						regularCardAnimatedStyle,
					]}
				>
					<LinearGradient
						colors={tarotColors}
						className='w-full h-full absolute top-0 left-0 rounded-2xl'
					/>
					{showTarotImage && (
						<Image
							source={{
								uri: tarotImage,
								width: 300,
								height: 300,
							}}
							contentFit='contain'
							className='absolute -bottom-5 -right-5 w-[155px] h-[155px]  rounded-2xl z-30'
							testID='tarot-avatar-image'
							transition={150}
							priority={'high'}
							cachePolicy={'memory-disk'}
						/>
					)}
					{showTarotTitle ? (
						<>
							<TarotTitle
								title={title}
								containerStyles=' absolute left-2 top-2 min-w-[50%] justify-center flex-row z-10'
							/>
							<View></View>
						</>
					) : (
						<View></View>
					)}
					<View
						className='absolute top-0 -right-3 -rotate-12'
						testID={`tarot-shape-${userShape}-one`}
					>
						{renderShape()}
					</View>
					<View
						className='relative z-20 overflow-hidden rounded-lg'
						shouldRasterizeIOS={true}
					>
						<QrCodeSvg
							style={{
								padding: 10,
							}}
							value={profileLink}
							frameSize={210}
							contentCells={5}
							contentStyle={{
								justifyContent: 'center',
								alignItems: 'center',
							}}
							content={
								<TarotProfileImage
									tarotColors={tarotColors}
									imageUrl={userImage}
									width={200}
									height={200}
									imageSize='md'
								/>
							}
						/>
					</View>
					<View className='ml-5 mb-4 items-start w-full relative '>
						<View
							className='absolute bottom-16  rotate-12 z-0 -left-5'
							testID={`tarot-shape-${userShape}-two`}
						>
							{renderShape()}
						</View>
						<View
							className='flex-row mb-1'
							shouldRasterizeIOS={true}
							style={{ gap: 7 }}
						>
							<FillEmoji emojiCode={userEmojiOne} testID='tarot-emoji-one' />
							<FillEmoji emojiCode={userEmojiTwo} testID='tarot-emoji-two' />
							<FillEmoji
								emojiCode={userEmojiThree}
								testID='tarot-emoji-three'
							/>
						</View>
						<View
							className=' rounded-md bg-white/60 py-1 px-2'
							shouldRasterizeIOS={true}
						>
							<TextElement
								textStyles='text-black text-md font-bold text-sm '
								testID='tarot-date'
							>
								{i18nInstance.t('tarotDate', { date: dateCreation })}
							</TextElement>
						</View>
					</View>
				</Animated.View>
				<Animated.View
					className='bg-slate-50 relative  overflow-hidden  items-center justify-between py-5 rounded-2xl'
					style={[
						{
							width: TAROT_CARD_WIDTH,
							height: TAROT_CARD_HEIGHT,
							backfaceVisibility: 'hidden',
							zIndex: 2,
						},
						flippedCardAnimatedStyle,
					]}
				>
					<View>
						<TarotProfileImage
							tarotColors={tarotColors}
							imageUrl={userImage}
							width={200}
							height={200}
							imageSize='medium'
							customContainerStyles='mb-0'
						/>
						<TarotTitle title={userNickname} />
					</View>
					{isAuthenticateUser && (
						<ButtonPrimary
							buttonStyles='py-2 '
							textStyles='text-dark-black'
							designVariation='gray'
							onPress={onPressCustomize}
						>
							{i18nInstance.t('editProfile')}
						</ButtonPrimary>
					)}
				</Animated.View>
			</TouchableOpacity>
		</View>
	);
};

export default TarotQRGradient;
