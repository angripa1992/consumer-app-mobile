import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { View } from 'react-native';
import ArrowIcon from '@/UI/assets/svg/Arrow';

import type { TypeReportReason, TypeEntityReport } from '@/lib/types/report';
import { ScrollView } from 'react-native-gesture-handler';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { i18nInstance } from 'config/i18n';

type TypeReportFormProps = {
	entityType: TypeEntityReport;
	handleSendReason: (reason: TypeReportReason) => void;
	reasonOptions: Array<TypeReportReason>;
};

const ReportOptionsView = ({
	entityType,
	handleSendReason,
	reasonOptions,
}: TypeReportFormProps) => {
	const handleReportReasonTranslation = (reason: TypeReportReason) => {
		if (reason.id === 1) {
			return 'noLikeIt';
		}
		if (reason.id === 2) {
			return 'itsSpam';
		}
		if (reason.id === 3) {
			return 'nudityOrSexualActivity';
		}
		if (reason.id === 4) {
			return 'hateSpeechOrSymbols';
		}
		if (reason.id === 5) {
			return 'falseInformation';
		}
		if (reason.id === 6) {
			return 'bullyingOrHarassment';
		}
		if (reason.id === 7) {
			return 'scampOrFraud';
		}
		if (reason.id === 8) {
			return 'violenceOrDangerousOrganizations';
		}
		if (reason.id === 9) {
			return 'saleOfIllegalOrRegulatedGoods';
		}
		if (reason.id === 10) {
			return 'suicideOrSelf-Injury';
		}
		if (reason.id === 11) {
			return 'eatingDisorders';
		}
		if (reason.id === 12) {
			return 'reportAsUnlawfull';
		}
		if (reason.id === 13) {
			return 'somethingElse';
		}
		return 'somethingElse';
	};

	return (
		<BottomSheetScrollView className='flex-1 mb-10'>
			<TextElement textStyles='text-white !text-base !font-bold mb-3'>{`${i18nInstance.t('report')} ${entityType}`}</TextElement>
			<TextElement textStyles='text-white mb-3 !font-bold'>{`${i18nInstance.t('whyAreYouReportingThisEntity', { entity: entityType })}`}</TextElement>
			<TextElement textStyles='text-white mb-3 text-gray'>
				{i18nInstance.t('yourReportIsAnonymous')}
			</TextElement>
			{reasonOptions.map((singleReason) => (
				<ButtonPrimary
					key={singleReason.id}
					designVariation='ghost'
					buttonStyles='w-full px-0 mb-1'
					isReactNodeContent
					onPress={() => {
						handleSendReason(singleReason);
					}}
				>
					<View className='flex flex-row items-center justify-between'>
						<TextElement textStyles='text-white'>
							{i18nInstance.t(handleReportReasonTranslation(singleReason))}
						</TextElement>
						<ArrowIcon />
					</View>
				</ButtonPrimary>
			))}
		</BottomSheetScrollView>
	);
};

export default ReportOptionsView;
