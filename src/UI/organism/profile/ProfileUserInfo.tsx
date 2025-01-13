import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';
import { onPressShare } from '@/lib/helpers/shareHelpers';

import TextElement from '@/UI/atoms/text/TextElement';
import ProfileWebsiteLink from '@/UI/atoms/profile/ProfileWebsiteLink';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type { TypeUpdateFollowMutation } from '@/lib/types/follows';

interface WebsiteUser {
	name: string;
	url: string | null;
	id: number;
}

interface ProfileUserInfoProps {
	userId: number;
	city: string;
	name: string;
	userName: string;
	biography: string | null;
	websitesUser: WebsiteUser[];
	isBlock?: boolean;
	updateFollow: TypeUpdateFollowMutation;
	isAuthenticateUser?: boolean;
	isFollowingUser?: boolean;
}

const ProfileUserInfo = ({
	userId,
	city,
	name,
	websitesUser,
	biography,
	userName,
	isBlock = false,
	updateFollow,
	isAuthenticateUser,
	isFollowingUser,
}: ProfileUserInfoProps) => {
	const locationData = city;
	const hasWebsites = websitesUser && websitesUser?.length > 0;

	const buttonTextFollow = isFollowingUser ? 'following' : 'follow';
	const buttonVariation = isFollowingUser ? 'white-transparent' : 'green';

	const onClickFollow = async () => {
		await updateFollow();
	};

	const onPressShareButton = async () => {
		await onPressShare('user', userId);
	};

	return (
		<View className='mt-3'>
			<View className='flex flex-row items-center justify-between mb-3'>
				<View>
					<TextElement fontFamily='pachang' textStyles='text-white text-xl'>
						{name}
					</TextElement>
					<TextElement
						textStyles='text-xs text-social-media-gray'
						testID='profile-username'
					>
						@{userName}
					</TextElement>
					<TextElement
						textStyles='text-xs text-social-media-gray'
						testID='profile-location'
					>
						{locationData}
					</TextElement>
				</View>
			</View>
			<View className='mb-3 flex-row items-center gap-x-5'>
				{!isAuthenticateUser && (
					<ButtonPrimary
						onPress={onClickFollow}
						buttonStyles={`flex-1 ${isFollowingUser ? 'bg-white/20 border-white/20' : ''}`}
						designVariation={buttonVariation}
						textStyles={`font-medium text-xs`}
						testID='profile-follow-button'
					>
						{i18nInstance.t(buttonTextFollow)}
					</ButtonPrimary>
				)}
				{!isBlock && (
					<ButtonPrimary
						onPress={onPressShareButton}
						buttonStyles={`flex-1`}
						designVariation={'white-transparent'}
						textStyles={`font-medium text-xs`}
						testID='profile-share-button'
					>
						{i18nInstance.t('shareProfile')}
					</ButtonPrimary>
				)}
			</View>
			{hasWebsites && (
				<View className='flex flex-col items-start'>
					{websitesUser.map((singleWeb) => (
						<ProfileWebsiteLink {...singleWeb} key={singleWeb.id} />
					))}
				</View>
			)}
			{biography && (
				<TextElement
					textStyles='text-social-media-gray mt-3 text-xs'
					testID='profile-biography'
				>
					{biography}
				</TextElement>
			)}
		</View>
	);
};

export default ProfileUserInfo;
