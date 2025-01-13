import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import { i18nInstance } from 'config/i18n';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import TrashIcon from '@/svg/TrashIcon';
import SwitchVerticalIcon from '@/svg/SwitchVerticalIcon';
import AlertIcon from '@/svg/AlertIcon';

interface SpotThumbnailEditModalProps {
	spotName: string;
	spotThumbnailEditModalRef: React.RefObject<BottomSheetModalMethods>;
	setShowDeleteSpotModal: (show: boolean) => void;
	onPressReport: () => void;
}

const SpotThumbnailEditModal = ({
	spotName,
	spotThumbnailEditModalRef,
	setShowDeleteSpotModal,
	onPressReport,
}: SpotThumbnailEditModalProps) => {
	const { setIsReorderingSpotListActive } = useAppStore(
		useShallow((state) => ({
			setIsReorderingSpotListActive: state.setIsReorderingSpotListActive,
		})),
	);

	const snapPoints = () => {
		return ['30%'];
	};

	const onPressDelete = () => {
		spotThumbnailEditModalRef.current?.close();
		setShowDeleteSpotModal(true);
	};

	const onPressReorder = () => {
		spotThumbnailEditModalRef.current?.close();
		setIsReorderingSpotListActive(true);
	};

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={spotThumbnailEditModalRef}
			snapPoints={snapPoints()}
		>
			<TextElement textStyles='text-white mb-4 !text-xl'>
				{spotName}
			</TextElement>

			<ButtonPrimary
				buttonStyles='!px-0'
				designVariation='ghost'
				nodeContentStyles='flex text-start flex-row items-center'
				isReactNodeContent={true}
				onPress={onPressReorder}
			>
				<SwitchVerticalIcon />
				<TextElement textStyles='text-white !text-base ml-1'>
					{i18nInstance.t('reorderSpot')}
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
					{i18nInstance.t('deleteSpot')}
				</TextElement>
			</ButtonPrimary>
			<ButtonPrimary
				buttonStyles='!px-0'
				onPress={onPressReport}
				designVariation='ghost'
				nodeContentStyles='flex text-start flex-row items-center'
				isReactNodeContent={true}
			>
				<AlertIcon />
				<TextElement textStyles='text-error !text-base ml-1'>
					{i18nInstance.t('report')}
				</TextElement>
			</ButtonPrimary>
		</CustomBottomSheetModal>
	);
};

export default SpotThumbnailEditModal;
