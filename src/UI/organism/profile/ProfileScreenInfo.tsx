import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';
import { useGetUser } from '@/lib/hooks/useQueryUser';
import { useUpdateFollowUserQuery } from '@/lib/hooks/useQueryFollow';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';

import MainLayout from '@/UI/layouts/MainLayout';
import ProfileUserHeader from '@/UI/molecules/profile/ProfileUserHeader';
import ProfileUserInfo from '@/UI/organism/profile/ProfileUserInfo';
import ProfileContent from '@/UI/organism/profile/ProfileContent';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import ProfileBlocked from '@/UI/organism/profile/ProfileBlocked';

import type { TypeUserDataEvent } from '@/lib/types/user';
import type { ProfileScreenNavigationProp } from '@/lib/types/tabScreenParams';

interface ProfileScreenInfoProps {
	userId: number;
	isUserFollow?: boolean;
}

const ProfileScreenInfo = ({
	userId,
	isUserFollow,
}: ProfileScreenInfoProps) => {
	const { appUserId, setShowUnblockModal } = useAppStore(
		useShallow((state) => ({
			appUserId: state.user?.id,
			setShowUnblockModal: state.setShowUnblockModal,
		})),
	);
	const navigation = useNavigation<ProfileScreenNavigationProp>();

	const { user, isLoading: isLoadingUser, refetch } = useGetUser(userId);

	useRefetchOnFocus(refetch);

	const dataUserEvent: TypeUserDataEvent = {
		user_id: userId,
		user_name: user?.name ?? '',
	};

	const { mutateAsync: updateFollow } = useUpdateFollowUserQuery({
		queryMutateDestination: 'user',
		dataUserEvent,
		followUserId: userId,
		currentUserId: userId,
	});

	const isAuthenticateUser = appUserId === userId;
	const isFollowingUser = !isAuthenticateUser && user?.is_following;

	const isBlock = user?.is_blocked_user;

	useEffect(() => {
		if (!user) return;
		if (isAuthenticateUser) return;

		const redirectQRFollowUser = async () => {
			if (isUserFollow && !isFollowingUser) {
				await updateFollow();
			}

			navigation.setParams({
				isFollow: undefined,
			});
		};

		redirectQRFollowUser();
	}, [user, isAuthenticateUser, isUserFollow, isFollowingUser]);

	const renderProfileHeader = () => {
		if (!user) return null;

		return (
			<>
				<ProfileUserHeader
					userId={user.id}
					profileImageUrl={user.profile_image_url}
					listCounter={user.spot_list_counter}
					followingCounter={user.following_users_counter}
					followersCounter={user.followers_counter}
					isBlock={isBlock}
					tarotCode={user.tarot_code}
					tarotColors={user.tarot_color}
					isCreator={user.is_creator}
				/>
				<ProfileUserInfo
					userName={user.username}
					userId={user.id}
					name={user.name}
					city={user.city}
					biography={user.biography}
					websitesUser={user.website_user}
					isBlock={isBlock}
					isFollowingUser={isFollowingUser}
					updateFollow={updateFollow}
					isAuthenticateUser={isAuthenticateUser}
				/>
			</>
		);
	};

	return (
		<>
			<MainLayout isDismissKeyboardActive={false}>
				{isLoadingUser ? (
					<SpinnerCup />
				) : (
					<>
						{user && (
							<ProfileContent
								isAuthenticateUser={isAuthenticateUser}
								profileHeader={renderProfileHeader()}
								userId={user.id}
								currentCity={user.city}
								isBlock={isBlock}
							/>
						)}
						{isBlock && (
							<ProfileBlocked setShowConfirmationModal={setShowUnblockModal} />
						)}
					</>
				)}
			</MainLayout>
		</>
	);
};

export default ProfileScreenInfo;
