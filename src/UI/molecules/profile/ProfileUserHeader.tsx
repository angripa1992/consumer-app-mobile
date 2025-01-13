import { useRef } from 'react';
import { TouchableOpacity, View, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';

import ProfileNumberHeader from '@/UI/atoms/profile/ProfileNumberHeader';
import CustomImage from '@/UI/atoms/image/CustomImage';
import TarotProfileImage from '@/UI/organism/profile/tarot/TarotProfileImage';
import QRIcon from '@/UI/assets/svg/QRIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TarotQRModal from '@/UI/organism/tarot/TarotQRModal';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

interface ProfileUserHeaderProps {
	userId: number;
	profileImageUrl: string | null;
	listCounter: number;
	followingCounter: number;
	followersCounter: number;
	isBlock?: boolean;
	tarotCode: string | null;
	tarotColors: string[] | null;
	isCreator: boolean | undefined | null;
}

const yellowColors = ['#F5BF03', '#FFCC33'];

const ProfileUserHeader = ({
	userId,
	profileImageUrl,
	listCounter = 0,
	followingCounter = 0,
	followersCounter = 0,
	isBlock = false,
	tarotCode,
	tarotColors,
	isCreator,
}: ProfileUserHeaderProps) => {
	const navigation = useNavigation<AppStackNavigationProp>();
	const tarotQRModalRef = useRef<BottomSheetModal>(null);

	const { width } = Dimensions.get('window');

	const onClickFollowing = () => {
		navigation.push('FollowView', { userId, filter: 'following' });
	};

	const onClickFollowers = () => {
		navigation.push('FollowView', { userId, filter: 'followers' });
	};

	const handleRedirectToTarotQRScreen = () => {
		if (!tarotCode) return;
		tarotQRModalRef.current?.present();
	};

	const imageToShow = () => {
		if (isCreator) {
			return (
				<TarotProfileImage
					tarotColors={yellowColors}
					imageUrl={profileImageUrl}
					showPickImageButton={false}
					imageSize='sm'
				/>
			);
		}

		if (tarotCode) {
			return (
				<TouchableOpacity
					onPress={handleRedirectToTarotQRScreen}
					activeOpacity={0.6}
				>
					<TarotProfileImage
						tarotCode={tarotCode}
						tarotColors={tarotColors}
						imageUrl={profileImageUrl}
						showPickImageButton={false}
						imageSize='sm'
					/>
				</TouchableOpacity>
			);
		}

		return (
			<CustomImage
				className='aspect-square rounded-full w-[76px] h-[76px]'
				width={76}
				height={76}
				imageSrc={profileImageUrl}
				contentFit='cover'
				typeDefaultImage='profile'
				priority='high'
				testID='profile-image'
			/>
		);
	};

	return (
		<>
			<View className='flex-row items-center justify-between'>
				<View>{imageToShow()}</View>
				{!isBlock && (
					<View
						className='flex-1 justify-center flex-row items-center'
						style={{ columnGap: width < 400 ? 12 : 25 }}
					>
						<TouchableOpacity activeOpacity={1}>
							<ProfileNumberHeader
								number={listCounter}
								text={i18nInstance.t('lists')}
								testID='profile-lists-counter'
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={onClickFollowing} activeOpacity={1}>
							<ProfileNumberHeader
								number={followingCounter}
								text={i18nInstance.t('following')}
								testID='profile-following-counter'
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={onClickFollowers} activeOpacity={1}>
							<ProfileNumberHeader
								number={followersCounter}
								text={i18nInstance.t('followers')}
								testID='profile-followers-counter'
							/>
						</TouchableOpacity>
					</View>
				)}
				<View>
					{tarotCode && (
						<ButtonPrimary
							designVariation='custom'
							buttonStyles='!p-0'
							onPress={handleRedirectToTarotQRScreen}
							isReactNodeContent
							testID='tarot-qr-button'
						>
							<QRIcon width={21} height={21} />
						</ButtonPrimary>
					)}
				</View>
			</View>
			<TarotQRModal tarotQRModalRef={tarotQRModalRef} userId={userId} />
		</>
	);
};

export default ProfileUserHeader;
