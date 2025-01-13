import { useEffect, useState } from 'react';
import DatePicker from 'react-native-date-picker';

import TextElement from '../text/TextElement';
import ButtonPrimary from '../button/ButtonPrimary';
import CalendarIcon from '@/UI/assets/svg/CalendarIcon';
import { Platform } from 'react-native';

interface InputDatePickerProps {
	value: Date | null | undefined;
	onChange: (...event: any[]) => void;
}

const InputDatePickerButton = ({ value, onChange }: InputDatePickerProps) => {
	const [date, setDate] = useState(new Date());
	const [open, setOpen] = useState(false);

	const onPressInput = () => {
		setOpen(true);
	};

	const textToShow = () => {
		if (value) {
			const formattedDate = new Intl.DateTimeFormat('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit',
			}).format(value);

			return formattedDate;
		}

		return 'DD/MM/YY';
	};

	useEffect(() => {
		if (value) {
			setDate(value);
		}
	}, [value]);

	return (
		<>
			<ButtonPrimary
				designVariation='ghost'
				buttonStyles={`py-2 rounded-lg border border-admin-gray px-[16px] ${!value ? 'opacity-60' : ''} `}
				isReactNodeContent={true}
				nodeContentStyles='flex flex-row justify-between items-center'
				onPress={onPressInput}
				testID='input-date-picker-button'
			>
				<TextElement textStyles='text-light-white text-sm no-underline  text-left '>
					{textToShow().toString()}
				</TextElement>
				<CalendarIcon />
			</ButtonPrimary>
			<DatePicker
				modal
				mode='date'
				open={open}
				date={date}
				maximumDate={new Date()}
				onConfirm={(date) => {
					setOpen(false);
					setDate(date);
					onChange(date);
				}}
				onCancel={() => {
					setOpen(false);
				}}
				dividerColor='black'
				theme={Platform.OS === 'android' ? 'light' : 'dark'}
			/>
		</>
	);
};

export default InputDatePickerButton;
