import { View } from 'react-native';

import { getCurrentDay } from '@/lib/helpers/dates/getCurrentDay';

import TextElement from '@/UI/atoms/text/TextElement';
import ModalWithCloseButton from '@/UI/organism/modal/ModalWithCloseButton';

import type { TypeWeekdayText } from '@/lib/types/spot';
import { i18nInstance } from 'config/i18n';

type TypeModalOpeningHoursProps = {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
	weekdayText?: TypeWeekdayText[] | null;
};

const ModalOpeningHours = ({
	showModal,
	setShowModal,
	weekdayText,
}: TypeModalOpeningHoursProps) => {
	return (
		<ModalWithCloseButton
			showModal={showModal}
			setShowModal={setShowModal}
			title={i18nInstance.t('openingHours')}
			content={
				<View className='flex px-3' testID='modal-content'>
					{weekdayText &&
					Array.isArray(weekdayText) &&
					weekdayText.length > 0 ? (
						weekdayText?.map((day, index) => (
							<View key={index} className='mb-2 flex flex-row'>
								<TextElement
									textStyles={`w-[40%] ${day.weekdays === getCurrentDay() ? 'text-white' : '!text-gray'}`}
								>
									{i18nInstance.t(day.weekdays.toLowerCase())}
								</TextElement>
								<TextElement
									textStyles={`${day.weekdays === getCurrentDay() ? 'text-white' : '!text-gray'}`}
								>
									{day.date === 'Closed' ? i18nInstance.t('closed') : day.date}
								</TextElement>
							</View>
						))
					) : (
						<TextElement textStyles='!text-gray text-center mt-2'>
							{i18nInstance.t('noItemsAvailable')}
						</TextElement>
					)}
				</View>
			}
		/>
	);
};

export default ModalOpeningHours;
