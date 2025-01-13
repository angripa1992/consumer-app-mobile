import { useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { useShallow } from 'zustand/react/shallow';

import { auth } from 'config/firebase';
import {
	useGetUser,
	usePutSingleUser,
	useDeleteUser,
} from '@/lib/hooks/useQueryUser';
import { useAppStore } from '@/lib/store/store';
import { getImageUriInformation } from '@/lib/helpers/strings/getImageUriInformation';
import { addHttpPrefix } from '@/lib/helpers/addHttpPrefix';
import useImagePicker from '@/lib/hooks/useImagePicker';

import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import MainLayout from '@/UI/layouts/MainLayout';
import ProfileFormEdit from '@/UI/organism/profile/forms/ProfileFormEdit';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';

import type {
	TypeProfileForm,
	TypePutProfileRequest,
} from '@/lib/types/profile';

const ProfileFormScreen = () => {
	const { user: userStored, setUser: setUserStored } = useAppStore(
		useShallow((state) => ({
			user: state.user,
			setUser: state.setUser,
		})),
	);

	const { user, isLoading: isLoadingUser } = useGetUser(Number(userStored?.id));
	const { mutateAsync: updateUser, isLoading: isLoadingUpdate } =
		usePutSingleUser(user && Number(userStored?.id));
	const { mutateAsync: deleteUser, isLoading: isLoadingDelete } = useDeleteUser(
		Number(userStored?.id),
	);

	const { imagePicked: imageProfile, pickImage } = useImagePicker({});
	const navigate = useNavigation();

	const [isUsernameRepeated, setIsUsernameRepeated] = useState(false);
	const [showDeleteProfileModal, setShowDeleteProfileModal] = useState(false);
	const [isDeleteUser, setIsDeleteUser] = useState(false);

	const isLoading =
		isLoadingUpdate || isLoadingDelete || isDeleteUser || isLoadingUser;
	const hideFormStyles = isLoading ? 'hidden' : '';
	const subContainerStyles = Platform.OS === 'android' ? 'pb-7' : 'pt-0';

	const handlePutProfile = (profileData: TypeProfileForm) => {
		if (!isLoadingUpdate && !isLoadingDelete) {
			const userWebsites = [
				{
					id: user?.website_user[0].id,
					url: addHttpPrefix(profileData.websiteOne),
				},
				{
					id: user?.website_user[1].id,
					url: addHttpPrefix(profileData.websiteTwo),
				},
				{
					id: user?.website_user[2].id,
					url: addHttpPrefix(profileData.websiteThree),
				},
			];

			let dataToSend: TypePutProfileRequest = {
				name: profileData.name,
				country: '',
				city: profileData.city ?? '',
				website_users: JSON.stringify(userWebsites),
				biography: profileData.biography ?? '',
				tarot_code: profileData.tarot ?? '',
			};

			if (profileData.username !== user?.username) {
				dataToSend.username = profileData.username;
			}
			if (
				imageProfile &&
				Array.isArray(imageProfile) &&
				imageProfile.length > 0
			) {
				const uri = imageProfile[0].uri;

				const { fileName, fileType } = getImageUriInformation(uri);

				dataToSend['profile_image_url'] = {
					uri,
					type: fileType,
					name: fileName,
				};
			}

			updateUser(dataToSend)
				.then(() => {
					navigate.goBack();
				})
				.catch((e) => {
					if (e.message.includes('409')) {
						setIsUsernameRepeated(true);
					}
				});
		}
	};

	const handleCancelPutProfile = () => {
		navigate.goBack();
	};

	const handleConfirmDelete = async () => {
		setIsDeleteUser(true);
		setShowDeleteProfileModal(false);
		await deleteUser();
		setUserStored(null);
		signOut(auth);
		setIsDeleteUser(false);
	};

	const imageUrl = () => {
		if (
			imageProfile &&
			Array.isArray(imageProfile) &&
			imageProfile.length > 0
		) {
			return imageProfile[0].uri;
		}
		if (user?.profile_image_url) {
			return user?.profile_image_url;
		}
	};

	return (
		<>
			<ConfirmModal
				showConfirmModal={showDeleteProfileModal}
				setShowConfirmModal={setShowDeleteProfileModal}
				onConfirm={handleConfirmDelete}
				questionText='Are you sure you want to delete your account?'
				confirmButtonText='Delete'
				cancelButtonText='Cancel'
				confirmButtonStyles='!bg-error'
			/>
			<MainLayout
				isDismissKeyboardActive={false}
				subContainerStyles={subContainerStyles}
				isKeyAvoidingView={false}
			>
				{isLoading && <SpinnerCup containerStyles='z-50 bg-black' />}
				{user && (
					<ProfileFormEdit
						setShowDeleteProfileModal={setShowDeleteProfileModal}
						hideFormStyles={hideFormStyles}
						onSubmit={handlePutProfile}
						onCancel={handleCancelPutProfile}
						isUsernameRepeated={isUsernameRepeated}
						setIsUsernameRepeated={setIsUsernameRepeated}
						imageUrl={imageUrl}
						pickImage={pickImage}
					/>
				)}
			</MainLayout>
		</>
	);
};

export default ProfileFormScreen;
