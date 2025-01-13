import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import { useGetAllReportReasons } from '@/lib/hooks/useQueryReport';
import { usePostReport } from '@/lib/hooks/useQueryReport';
import { useAppStore } from '@/lib/store/store';

import { View } from 'react-native';
import ReportOptionsView from './view/ReportOptionsView';
import Spinner from '@/UI/atoms/spinner/Spinner';
import ReportCommentsView from './view/ReportCommentsView';
import ReportThanksView from './view/ReportThanksView';

import type {
	TypeSubmitReport,
	TypeReportReason,
	TypeEntityReport,
	TypeBackendReport,
} from '@/lib/types/report';
import { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import { useShallow } from 'zustand/react/shallow';

type TypeReportFormProps = {
	entityType: TypeEntityReport;
	reportModalRef: React.RefObject<BottomSheetModalMethods>;
	reportedId: number;
};

const ReportModal = ({
	entityType,
	reportModalRef,
	reportedId,
}: TypeReportFormProps) => {
	const { allReportReasons } = useGetAllReportReasons();
	const { mutateAsync: fetchCreateReport } = usePostReport();
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [reasonType, setReasonType] = useState<TypeReportReason | null>(null);
	const [isLoadingPostReport, setIsLoadingPostReport] = useState(false);

	const snapPoints = () => {
		if (step === 1) return ['50%', '75%'];
		if (step === 2) return ['38%', '38%'];
		if (step === 3) return ['35%', '35%'];
	};

	const postEntityType: () => TypeBackendReport = () => {
		if (entityType === 'spot') return 'spot';
		if (entityType === 'list') return 'spot_list';
		if (entityType === 'scribble') return 'spot_scribble_added';
		return 'user';
	};

	const handleSetReasonType = (reason: TypeReportReason) => {
		setReasonType(reason);
		setStep(2);
	};

	const handleSubmitReport: SubmitHandler<TypeSubmitReport> = (formValues) => {
		if (user?.id && reasonType) {
			setIsLoadingPostReport(true);
			const dataToSend = {
				report_reason_type_id: reasonType.id,
				report_type: postEntityType(),
				user_reporter_id: user?.id,
				reported_id: reportedId,
				motivation: formValues.motivation,
			};
			fetchCreateReport(dataToSend).finally(() => {
				setIsLoadingPostReport(false);
				setStep(3);
			});
		}
	};

	const handleCloseModal = () => {
		reportModalRef.current?.close();
		setStep(1);
	};

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={reportModalRef}
			keyboardBlurBehavior='restore'
			snapPoints={snapPoints()}
			onDismiss={handleCloseModal}
		>
			{step === 1 && (
				<>
					{allReportReasons ? (
						<ReportOptionsView
							entityType={entityType}
							handleSendReason={handleSetReasonType}
							reasonOptions={allReportReasons}
						/>
					) : (
						<View className='h-[120px] w-full flex items-center justify-center'>
							<Spinner />
						</View>
					)}
				</>
			)}
			{step === 2 && (
				<ReportCommentsView
					handleSubmitReport={handleSubmitReport}
					entityType={entityType}
					isLoadingSubmit={isLoadingPostReport}
				/>
			)}
			{step === 3 && (
				<ReportThanksView
					entityType={entityType}
					handleDonePress={handleCloseModal}
				/>
			)}
		</CustomBottomSheetModal>
	);
};

export default ReportModal;
