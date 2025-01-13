import { TouchableOpacity, View } from 'react-native';
import { GestureType } from 'react-native-gesture-handler';
import { Image } from 'expo-image';

import { changeDateFormat } from '@/lib/helpers/dates/changeDateFormat';
import { appDeepLink } from '@/lib/utils/constants';
import { i18nInstance } from 'config/i18n';
import { findTarotEmojiByOrder } from '@/lib/helpers/tarotHelpers';
import { onPressShare } from '@/lib/helpers/shareHelpers';

import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TarotQRGradient from '@/UI/organism/tarot/TarotQRGradient';
import TarotProfileImage from '../profile/tarot/TarotProfileImage';
import ArrowWithCircle from '@/UI/assets/svg/ArrowWithCircle';
import Pencil from '@/images/pencil-tarot-qr.png';

import type { TypeSingleTarotUser } from '@/lib/types/tarot';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface TarotQRInfoProps {
	singleTarotUser: TypeSingleTarotUser;
	isAuthenticateUser: boolean;
	scrollViewRef: React.RefObject<GestureType>;
	editTarotQRModalRef: React.RefObject<BottomSheetModalMethods>;
}

const TarotQRInfo = ({
	singleTarotUser,
	isAuthenticateUser,
	scrollViewRef,
	editTarotQRModalRef,
}: TarotQRInfoProps) => {
	const userName = singleTarotUser?.user_name;
	const userNickname = `@${singleTarotUser?.username}`;

	const userEmojis = singleTarotUser.emojis;
	const userEmojiOne = findTarotEmojiByOrder(userEmojis, 1);
	const userEmojiTwo = findTarotEmojiByOrder(userEmojis, 2);
	const userEmojiThree = findTarotEmojiByOrder(userEmojis, 3);
	const userProfileImage = singleTarotUser.profile_image;
	const profileLink = `${appDeepLink}?followUserId=${singleTarotUser.user_id}`;

	const onPressCustomize = () => {
		editTarotQRModalRef.current?.present();
	};

	const onPressShareButton = async () => {
		await onPressShare('user', singleTarotUser.user_id);
	};

	return (
		<View>
			<View className='mb-12 flex-row'>
				<TarotProfileImage
					tarotColors={singleTarotUser.tarot_color}
					imageUrl={userProfileImage}
					width={200}
					height={200}
					imageSize='xs'
				/>
				<View className='ml-4 flex-1'>
					<TextElement
						textStyles='text-white font-semibold text-2xl'
						testID='tarot-username'
						numberOfLines={1}
					>
						{userName}
					</TextElement>
					<TextElement
						textStyles='text-white text-sm  opacity-50'
						testID='tarot-name'
						numberOfLines={1}
					>
						{userNickname}
					</TextElement>
					{isAuthenticateUser && (
						<View className='flex-row mt-3 relative w-full'>
							<TextElement
								textStyles='text-white text-sm mr-2'
								testID='tarot-edit-card'
							>
								{i18nInstance.t('tabToEditCard')}
							</TextElement>
							<ArrowWithCircle />
						</View>
					)}
				</View>
				<View>
					<TouchableOpacity onPress={onPressCustomize} activeOpacity={0.8}>
						<Image source={Pencil} className='w-24 h-24 ml-2' />
					</TouchableOpacity>
				</View>
			</View>
			<View className='justify-center items-center '>
				<TarotQRGradient
					isAuthenticateUser={isAuthenticateUser}
					title={singleTarotUser.tarot_code_name}
					profileLink={profileLink}
					userNickname={userNickname}
					userImage={singleTarotUser.profile_image}
					userEmojiOne={userEmojiOne?.code}
					userEmojiTwo={userEmojiTwo?.code}
					userEmojiThree={userEmojiThree?.code}
					dateCreation={changeDateFormat(singleTarotUser.created_at)}
					userShape={singleTarotUser.shape}
					tarotImage={singleTarotUser.avatar}
					scrollViewRef={scrollViewRef}
					tarotColors={singleTarotUser.tarot_color}
					showTarotImage={singleTarotUser.show_avatar}
					showTarotTitle={singleTarotUser.show_name}
					tarotCode={singleTarotUser.tarot_code}
					onPressCustomize={onPressCustomize}
				/>
				{isAuthenticateUser && (
					<View className='w-full'>
						<ButtonPrimary
							onPress={onPressShareButton}
							buttonStyles='py-4 w-full'
							testID='tarot-invite-friends-button '
							designVariation='green'
						>
							{i18nInstance.t('share')}
						</ButtonPrimary>
					</View>
				)}
			</View>
		</View>
	);
};

export default TarotQRInfo;
