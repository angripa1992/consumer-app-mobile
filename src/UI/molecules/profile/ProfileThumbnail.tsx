import { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';

import { i18nInstance } from 'config/i18n';

import { useUpdateFollowUserQuery } from '@/lib/hooks/useQueryFollow';
import { useAppStore } from '@/lib/store/store';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import CustomImage from '@/UI/atoms/image/CustomImage';

import type { TypeQueriesMutateDestination } from '@/lib/types/queries';
import type { TypeUserDataEvent } from '@/lib/types/user';
import type {
	ListScreenNavigationProp,
	ProfileScreenNavigationProp,
} from '@/lib/types/tabScreenParams';

type TypeProfileThumbnailProps = {
	followUserId: number;
	queryMutateDestination: TypeQueriesMutateDestination;
	name: string;
	imageUrl?: string | null;
	isFollowing?: boolean | null;
	hideFollowButton?: boolean;
	containerStyles?: string;
	imageStyles?: string;
	handlePressFollowButton?: () => void;
	currentUserId?: number;
	searchQuery?: string;
	currentCity?: string;
	categoryName?: string;
	disabledRedirect?: boolean;
	designVariation?: 'large' | 'small';
	testID?: string;
};

const ProfileThumbnail = ({
	followUserId,
	queryMutateDestination,
	name,
	imageUrl,
	isFollowing,
	hideFollowButton,
	containerStyles = '',
	imageStyles = '',
	handlePressFollowButton,
	currentUserId,
	searchQuery,
	currentCity,
	categoryName,
	disabledRedirect,
	designVariation = 'large',
	testID,
}: TypeProfileThumbnailProps) => {
	const navigation = useNavigation<
		ProfileScreenNavigationProp & ListScreenNavigationProp
	>();
	const { appUserId } = useAppStore(
		useShallow((state) => ({
			appUserId: state.user?.id,
		})),
	);

	const dataUserEvent: TypeUserDataEvent = {
		user_id: followUserId,
		user_name: name,
	};

	const { mutateAsync: updateFollow } = useUpdateFollowUserQuery({
		queryMutateDestination,
		dataUserEvent,
		followUserId,
		currentUserId,
		searchQuery,
		currentCity,
		categoryName,
	});

	const isAuthenticateUser = appUserId === followUserId;

	const buttonStylesFollow = isFollowing ? 'opacity-50' : '';
	const buttonTextFollow = isFollowing ? 'following' : 'follow';
	const buttonVariation = isFollowing ? 'white-transparent' : 'white';

	const onClickButton = async () => {
		if (followUserId) {
			await updateFollow();
		}
	};

	const onPressCard = () => {
		if (disabledRedirect) return;
		navigation.push('ProfileScreen', {
			userId: followUserId,
		});
	};

	const onPressFollowButton = () => {
		if (handlePressFollowButton) {
			handlePressFollowButton();
		} else {
			onClickButton();
		}
	};

	if (designVariation === 'large') {
		return (
			<View
				className={`mb-5 flex flex-col items-center ${containerStyles || 'flex-1'}`}
				style={{ columnGap: 7 }}
				testID={testID}
			>
				<TouchableOpacity onPress={onPressCard} activeOpacity={1}>
					<View className='flex flex-col items-center'>
						<CustomImage
							className={`w-[150px] h-[150px] rounded-full ${imageStyles}`}
							imageSrc={imageUrl}
							width={150}
							height={150}
							typeDefaultImage='profile'
							testID='profile-thumbnail-image'
						/>
						<TextElement
							textStyles='text-white text-base mt-2'
							numberOfLines={1}
							testID='profile-thumbnail-name'
						>
							{name}
						</TextElement>
					</View>
				</TouchableOpacity>
				{!hideFollowButton && (
					<>
						{!isAuthenticateUser && (
							<ButtonPrimary
								onPress={onPressFollowButton}
								buttonStyles={`w-full mt-2 rounded-lg`}
								designVariation={buttonVariation}
								textStyles={`font-medium text-sm `}
								testID='profile-thumbnail-follow-button'
							>
								{i18nInstance.t(buttonTextFollow)}
							</ButtonPrimary>
						)}
					</>
				)}
			</View>
		);
	}

	return (
		<View
			className={`mb-5 flex-row items-center justify-between ${containerStyles}`}
			style={{ columnGap: 7 }}
			testID={testID}
		>
			<TouchableOpacity
				className='flex-row items-center gap-x-3 flex-1'
				onPress={onPressCard}
				activeOpacity={1}
			>
				<CustomImage
					className={`w-[50px] h-[50px] rounded-full ${imageStyles}`}
					imageSrc={imageUrl}
					width={50}
					height={50}
					typeDefaultImage='profile'
					testID='profile-thumbnail-image'
				/>
				<TextElement
					textStyles='text-white text-base mt-2 flex-1 '
					numberOfLines={1}
					testID='profile-thumbnail-name'
				>
					{name}
				</TextElement>
			</TouchableOpacity>
			{!hideFollowButton && (
				<>
					{!isAuthenticateUser && (
						<ButtonPrimary
							onPress={onPressFollowButton}
							buttonStyles={`mt-2 rounded-full py-2 ${buttonStylesFollow}`}
							designVariation='light-gray'
							textStyles={`font-medium text-sm`}
							testID='profile-thumbnail-follow-button'
						>
							{i18nInstance.t(buttonTextFollow)}
						</ButtonPrimary>
					)}
				</>
			)}
		</View>
	);
};

export default memo(ProfileThumbnail);
