import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
} from 'react-hook-form';

import { SwitchProps, View, Switch, Platform } from 'react-native';
import TextElement from '../text/TextElement';

type ExtraSwitchInputProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	error?: FieldError | undefined;
	label?: string;
	containerStyles?: string;
	labelStyles?: string;
	errorStyles?: string;
	activeText?: string;
	inactiveText?: string;
};

type SwitchInputProps<T extends FieldValues> = ExtraSwitchInputProps<T> &
	SwitchProps;

const SwitchInput = <T extends FieldValues>({
	control,
	name,
	error,
	label,
	containerStyles,
	labelStyles,
	errorStyles,
	activeText,
	inactiveText,
}: SwitchInputProps<T>) => {
	return (
		<View className={containerStyles}>
			{label && (
				<TextElement textStyles={`text-neutral-gray mb-2 ${labelStyles} `}>
					{label}
				</TextElement>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => {
					const isActive = !!value;

					const onValueChange = () => {
						onChange(!isActive);
					};

					return (
						<View className='flex-row justify-between'>
							<Switch
								trackColor={{ false: '#4A4A4A', true: '#4A4A4A' }}
								thumbColor={isActive ? '#fff' : '#757575'}
								ios_backgroundColor='#4A4A4A'
								onValueChange={onValueChange}
								value={isActive}
							/>
							<TextElement textStyles='text-gray text-sm'>
								{isActive ? activeText : inactiveText}
							</TextElement>
						</View>
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

export default SwitchInput;
