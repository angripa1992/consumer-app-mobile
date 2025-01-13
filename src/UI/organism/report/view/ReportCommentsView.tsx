import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import InputForm from '@/UI/atoms/input/InputForm';

import type { TypeSubmitReport, TypeEntityReport } from '@/lib/types/report';
import { motivationFormReportValidations } from '@/lib/schemas/report';
import { i18nInstance } from 'config/i18n';

type TypeReportFormProps = {
	handleSubmitReport: SubmitHandler<TypeSubmitReport>;
	entityType: TypeEntityReport;
	isLoadingSubmit: boolean;
};

const ReportCommentsView = ({
	handleSubmitReport,
	entityType,
	isLoadingSubmit,
}: TypeReportFormProps) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			motivation: '',
		},
		resolver: zodResolver(motivationFormReportValidations),
	});
	return (
		<>
			<TextElement textStyles='text-white !text-base !font-bold mb-3'>{`${i18nInstance.t('report')} ${entityType}`}</TextElement>
			<TextElement textStyles='mb-3 text-gray'>
				{i18nInstance.t('helpUseUnderstandTheProblem')}
			</TextElement>
			<InputForm
				control={control}
				name='motivation'
				error={errors.motivation}
				multiline
				isBottomSheetTextInput
				style={{ height: 131 }}
			/>

			<ButtonPrimary
				buttonStyles={`mt-5 ${
					isLoadingSubmit ? 'bg-middle-gray border-gray/50' : ''
				}`}
				onPress={handleSubmit(handleSubmitReport)}
				isReactNodeContent
				disabled={isLoadingSubmit}
			>
				{isLoadingSubmit ? (
					<TextElement textStyles='text-white text-center'>
						{i18nInstance.t('loading')}...
					</TextElement>
				) : (
					<TextElement textStyles='text-button-black text-center'>
						{i18nInstance.t('send')}
					</TextElement>
				)}
			</ButtonPrimary>
		</>
	);
};

export default ReportCommentsView;
