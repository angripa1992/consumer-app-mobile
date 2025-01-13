import CheckFormIcon from '@/UI/assets/svg/CheckFormIcon';
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
} from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import TextElement from '../text/TextElement';

type CheckboxInputFormProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	error?: FieldError | undefined;
	inputStyles?: string;
	containerStyles?: string;
	labelStyles?: string;
	label?: string;
	errorStyles?: string;
	testID?: string;
	checkIconColor?: string;
};

const CheckboxInputForm = <T extends FieldValues>({
	control,
	name,
	inputStyles,
	containerStyles = '',
	label,
	labelStyles,
	error,
	errorStyles = '',
	checkIconColor,
	testID,
}: CheckboxInputFormProps<T>) => {
	return (
		<View
			className={`flex-row items-center justify-between ${containerStyles}`}
		>
			{label && (
				<TextElement textStyles={`text-neutral-gray mb-2 ${labelStyles} `}>
					{label}
				</TextElement>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => {
					const valueToShow = !!value;

					const onPressCheckbox = () => {
						onChange(!value);
					};

					return (
						<TouchableOpacity
							testID={testID}
							activeOpacity={1}
							onPress={onPressCheckbox}
						>
							<CheckFormIcon color={checkIconColor} isChecked={valueToShow} />
						</TouchableOpacity>
					);
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

export default CheckboxInputForm;
