import { Image, ImageSourcePropType, View } from 'react-native';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import ProfileImageDefault from '@/images/Profile-default.png';
import TextElement from '@/UI/atoms/text/TextElement';
import BellCancelIcon from '@/svg/BellCancelIcon';
import SettingsIcon from '@/svg/SettingsIcon';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface ProfileBlockConfirmationModalProps {
	profileBlockConfirmationModal: React.RefObject<BottomSheetModalMethods>;
	profileImageUrl?: string | null;
	name?: string | null;
	onPressBlock: () => void;
	isLoading?: boolean;
}

const ProfileBlockConfirmationModal = ({
	profileBlockConfirmationModal,
	profileImageUrl,
	onPressBlock,
	name,
	isLoading = false,
}: ProfileBlockConfirmationModalProps) => {
	const image: ImageSourcePropType = profileImageUrl
		? { uri: profileImageUrl }
		: ProfileImageDefault;

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={profileBlockConfirmationModal}
			snapPoints={['50%']}
		>
			<View className='mb-6'>
				<Image
					className='aspect-square rounded-full w-[76px] mx-auto h-[76px] mb-2 '
					width={76}
					height={76}
					defaultSource={ProfileImageDefault}
					source={image}
				/>
				<TextElement textStyles='text-light-white text-base font-medium text-center'>
					{name}
				</TextElement>
			</View>
			<TextElement textStyles='text-sm text-gray'>
				This will also block any other accounts that they may have or create in
				the future.
			</TextElement>
			<View className='my-6  pb-5 border-b-[1px] border-[#ffffff1a]'>
				<View className='flex flex-row mb-3 '>
					<BellCancelIcon />
					<TextElement textStyles='text-base text-light-white ml-2'>
						They won't be notified that you blocked them.
					</TextElement>
				</View>
				<View className='flex flex-row '>
					<SettingsIcon />
					<TextElement textStyles='text-base text-light-white ml-2'>
						You can unblock them at any time in Settings.
					</TextElement>
				</View>
			</View>
			<ButtonPrimary
				onPress={onPressBlock}
				buttonStyles={`mt-1 ${
					isLoading ? 'bg-middle-gray border-gray/50' : ''
				}`}
				isReactNodeContent
			>
				<TextElement textStyles='text-button-black text-center'>
					{isLoading ? 'Loading...' : 'Block'}
				</TextElement>
			</ButtonPrimary>
		</CustomBottomSheetModal>
	);
};

export default ProfileBlockConfirmationModal;
