import { useEffect, useState } from 'react';
import { Platform, Switch, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import { TypeSpotListSinglePage } from '@/lib/types/spotList';
import {
	AppStackNavigationProp,
	NavigationProps,
} from '@/lib/types/tabScreenParams';
import { useAppStore } from '@/lib/store/store';
import { usePutSpotList } from '@/lib/hooks/useQuerySpotList';

import EditIcon from '@/svg/EditIcon';
import TrashIcon from '@/svg/TrashIcon';

import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import { useShallow } from 'zustand/react/shallow';

interface SpotListEditModalProps {
	spotListEditModalRef: React.RefObject<BottomSheetModalMethods>;
	setShowDeleteSpotListModal: (showDeleteSpotListModal: boolean) => void;
	spotList?: TypeSpotListSinglePage | null;
}

const SpotListEditModal = ({
	spotListEditModalRef,
	setShowDeleteSpotListModal,
	spotList,
}: SpotListEditModalProps) => {
	const { setIsSpotListEdit, setIsSpotListEditAlreadyCreated } = useAppStore(
		useShallow((state) => ({
			setIsSpotListEdit: state.setIsSpotListEdit,
			setIsSpotListEditAlreadyCreated: state.setIsSpotListEditAlreadyCreated,
		})),
	);
	const navigation = useNavigation<AppStackNavigationProp>();
	const isPrivateSpotList = spotList?.is_private;
	const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(isPrivateSpotList);

	const { mutateAsync: updateSpotList, isLoading: isPrivacyLoading } =
		usePutSpotList(spotList?.id);

	const spotListName = spotList?.name;

	const toggleSwitch = async () => {
		setIsPrivacyEnabled((previousState) => !previousState);

		if (!spotList) return;
		await updateSpotList({
			is_private: Number(!isPrivacyEnabled),
		});
	};

	const onPressDelete = () => {
		spotListEditModalRef.current?.close();
		setShowDeleteSpotListModal(true);
	};

	const redirectToSpotListEdit = () => {
		if (!spotList) return;
		spotListEditModalRef.current?.close();
		setShowDeleteSpotListModal(false);

		setIsSpotListEdit(true);
		setIsSpotListEditAlreadyCreated(true);

		navigation.navigate('ListEdit', {
			spotList: spotList,
		});
	};

	useEffect(() => {
		setIsPrivacyEnabled(isPrivateSpotList);
	}, [isPrivateSpotList]);

	return (
		<CustomBottomSheetModal
			snapPoints={['35%']}
			bottomSheetModalRef={spotListEditModalRef}
		>
			<TextElement textStyles='text-white mb-4 !text-xl'>
				{spotListName} List Settings
			</TextElement>
			<ButtonPrimary
				buttonStyles='!px-0'
				designVariation='ghost'
				nodeContentStyles='flex text-start flex-row items-center'
				isReactNodeContent={true}
				onPress={redirectToSpotListEdit}
			>
				<EditIcon />
				<TextElement textStyles='text-white !text-base ml-1'>
					Edit List
				</TextElement>
			</ButtonPrimary>
			<ButtonPrimary
				buttonStyles='!px-0'
				onPress={onPressDelete}
				designVariation='ghost'
				nodeContentStyles='flex text-start flex-row items-center'
				isReactNodeContent={true}
			>
				<TrashIcon />
				<TextElement textStyles='text-error !text-base ml-1'>
					Delete List
				</TextElement>
			</ButtonPrimary>
			<View className='pt-4 mt-4 border-t border-white/20 flex flex-row items-center justify-between  '>
				{isPrivacyLoading ? (
					<TextElement textStyles='text-gray text-base'>
						Changing privacy, this may take a few seconds...
					</TextElement>
				) : (
					<>
						<View>
							<TextElement textStyles='text-white !text-lg'>
								Private
							</TextElement>

							<TextElement textStyles='text-gray text-base'>
								{isPrivacyEnabled
									? 'Only you can see this list'
									: 'People can see your list'}
							</TextElement>
						</View>
						<Switch
							disabled={isPrivacyLoading}
							className={Platform.OS === 'android' ? 'scale-125' : ''}
							trackColor={{ false: '#4A4A4A', true: '#4A4A4A' }}
							thumbColor={isPrivacyEnabled ? '#fff' : '#757575'}
							ios_backgroundColor='#4A4A4A'
							onValueChange={toggleSwitch}
							value={isPrivacyEnabled}
						/>
					</>
				)}
			</View>
		</CustomBottomSheetModal>
	);
};

export default SpotListEditModal;
