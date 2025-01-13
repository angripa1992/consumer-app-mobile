import { Dispatch, SetStateAction } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import EditIcon from '@/UI/assets/svg/EditIcon';
import TrashIcon from '@/UI/assets/svg/TrashIcon';
import AlertIcon from '@/UI/assets/svg/AlertIcon';
import CustomBottomSheetModal from '../../modal/CustomBottonSheet';
import { i18nInstance } from 'config/i18n';

interface TypeScribblesForSpotCardProps {
	scribbleOptionsModalRef: React.RefObject<BottomSheetModal>;
	scribbleEditFormModalRef: React.RefObject<BottomSheetModal>;
	reportModalRef: React.RefObject<BottomSheetModal>;
	isAuthenticateUser: boolean;
	setShowDeleteSingleScribbleModal: Dispatch<SetStateAction<boolean>>;
}

const ScribbleOptionsModal = ({
	scribbleOptionsModalRef,
	scribbleEditFormModalRef,
	reportModalRef,
	isAuthenticateUser,
	setShowDeleteSingleScribbleModal,
}: TypeScribblesForSpotCardProps) => {
	const snapPointsForOptions = () => {
		if (!isAuthenticateUser) return ['20%'];

		return ['25%'];
	};

	const onPressDeleteScribble = () => {
		setShowDeleteSingleScribbleModal(true);
		scribbleOptionsModalRef.current?.close();
	};

	const onOpenEditScribbleForm = () => {
		scribbleEditFormModalRef.current?.present();
		scribbleOptionsModalRef.current?.dismiss();
	};

	const onPressReportScribble = () => {
		reportModalRef.current?.present();
		scribbleOptionsModalRef.current?.dismiss();
	};

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={scribbleOptionsModalRef}
			keyboardBlurBehavior='restore'
			snapPoints={snapPointsForOptions()}
		>
			{isAuthenticateUser ? (
				<>
					<ButtonPrimary
						buttonStyles='!px-0'
						designVariation='ghost'
						nodeContentStyles='flex text-start flex-row items-center'
						isReactNodeContent={true}
						onPress={onOpenEditScribbleForm}
					>
						<EditIcon />
						<TextElement textStyles='text-white !text-base ml-1'>
							Edit Scribble
						</TextElement>
					</ButtonPrimary>
					<ButtonPrimary
						buttonStyles='!px-0'
						designVariation='ghost'
						nodeContentStyles='flex text-start flex-row items-center'
						isReactNodeContent={true}
						onPress={onPressDeleteScribble}
					>
						<TrashIcon />
						<TextElement textStyles='text-error !text-base ml-1'>
							Delete Scribble
						</TextElement>
					</ButtonPrimary>
				</>
			) : (
				<ButtonPrimary
					buttonStyles='!px-0'
					designVariation='ghost'
					nodeContentStyles='flex text-start flex-row items-center'
					isReactNodeContent={true}
					onPress={onPressReportScribble}
				>
					<AlertIcon />
					<TextElement textStyles='text-error !text-base ml-1'>
						{i18nInstance.t('reportScribble')}
					</TextElement>
				</ButtonPrimary>
			)}
		</CustomBottomSheetModal>
	);
};

export default ScribbleOptionsModal;
