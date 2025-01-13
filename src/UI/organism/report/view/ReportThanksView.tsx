import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { View } from 'react-native';
import DoneIcon from '@/UI/assets/svg/Done';

import type { TypeEntityReport } from '@/lib/types/report';
import { i18nInstance } from 'config/i18n';

type TypeReportThanksViewProps = {
	entityType: TypeEntityReport;
	handleDonePress: () => void;
};

const ReportThanksView = ({
	entityType,
	handleDonePress,
}: TypeReportThanksViewProps) => {
	return (
		<View className='pb-8 pt-2'>
			<View className='flex items-center w-full border-[#2a2a2a] border-b mb-8'>
				<DoneIcon />
				<TextElement textStyles='my-6 !text-white !text-base'>
					{i18nInstance.t('thanksForReportingThisEntity', {
						entity: entityType,
					})}
				</TextElement>
				<TextElement textStyles='text-white mb-8 text-gray w-full'>
					{i18nInstance.t('reportConfirmText')}
				</TextElement>
			</View>
			<ButtonPrimary onPress={handleDonePress}>
				{i18nInstance.t('done')}
			</ButtonPrimary>
		</View>
	);
};

export default ReportThanksView;
