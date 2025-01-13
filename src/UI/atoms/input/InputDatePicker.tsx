import { View } from 'react-native';
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
} from 'react-hook-form';

import TextElement from '../text/TextElement';
import InputDatePickerButton from './InputDatePickerButton';

type InputDatePickerProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	error?: FieldError | undefined;
	inputStyles?: string;
	containerStyles?: string;
	labelStyles?: string;
	label?: string;
	errorStyles?: string;
	testID?: string;
};

const InputDatePicker = <T extends FieldValues>({
	control,
	name,
	inputStyles,
	containerStyles = '',
	label,
	labelStyles,
	error,
	errorStyles = '',
	testID,
}: InputDatePickerProps<T>) => {
	return (
		<View className={containerStyles} testID='input-date-picker'>
			{label && (
				<TextElement textStyles={`text-gray-label mb-2 ${labelStyles} `}>
					{label}
				</TextElement>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => {
					return <InputDatePickerButton value={value} onChange={onChange} />;
				}}
			/>
			{error && (
				<TextElement textStyles={`text-error ${errorStyles}`}>
					{error.message}
				</TextElement>
			)}
		</View>
	);
};

export default InputDatePicker;
