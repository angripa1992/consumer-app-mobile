import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import AlertIcon from '@/svg/AlertIcon';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import { i18nInstance } from 'config/i18n';

interface SpotSingleViewModalProps {
	spotName: string;
	spotSingleViewModalRef: React.RefObject<BottomSheetModalMethods>;
	onPressReport: () => void;
}

const SpotSingleViewModal = ({
	spotName,
	spotSingleViewModalRef,
	onPressReport,
}: SpotSingleViewModalProps) => {
	const snapPoints = () => {
		return ['20%'];
	};

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={spotSingleViewModalRef}
			snapPoints={snapPoints()}
		>
			<TextElement textStyles='text-white mb-4 !text-xl'>
				{spotName}
			</TextElement>
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

export default SpotSingleViewModal;
