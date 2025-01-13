import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

import { i18nInstance } from 'config/i18n';

import TextElement from '../text/TextElement';
import ButtonPrimary from '../button/ButtonPrimary';
import EyeIcon from '@/UI/assets/svg/EyeIcon';
import CrossedEyeIcon from '@/UI/assets/svg/CrossedEyeIcon';

import type { TextInputProps } from 'react-native';
import type { Control, FieldError, FieldValues, Path } from 'react-hook-form';

type ExtraInputFormProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	error?: FieldError | undefined;
	inputStyles?: string;
	containerStyles?: string;
	labelStyles?: string;
	label?: string;
	customErrorMessage?: string;
	showCustomError?: boolean;
	editValue?: string;
	errorStyles?: string;
	isPassword?: boolean;
	testID?: string;
	autoCompleteType?: TextInputProps['autoComplete'];
	isBottomSheetTextInput?: boolean;
	customIcon?: React.ReactNode;
	showCounter?: boolean;
};

type InputFormProps<T extends FieldValues> = ExtraInputFormProps<T> &
	TextInputProps;

const InputForm = <T extends FieldValues>({
	control,
	name,
	inputStyles,
	containerStyles = 'w-full',
	label,
	labelStyles,
	selectionColor = '#EBEBEB',
	error,
	customErrorMessage,
	showCustomError,
	editValue,
	errorStyles = '',
	isPassword = false,
	testID,
	autoCompleteType = 'off',
	isBottomSheetTextInput,
	style,
	customIcon,
	showCounter,
	...props
}: InputFormProps<T>) => {
	const { multiline } = props;
	const [showPassword, setShowPassword] = useState(isPassword);
	const [internalValue, setInternalValue] = useState(editValue ?? '');

	const inputClassName = `bg-dark-gray border border-admin-gray h-11 rounded-lg px-[16px] text-light-white ${inputStyles} ${customIcon ? 'pr-8' : ''}`;

	const renderIcon = (iconType: 'password' | 'custom') => {
		if (iconType === 'custom') {
			return (
				<View className='absolute right-0 top-0 bottom-0  flex items-center justify-center'>
					{customIcon}
				</View>
			);
		}

		if (iconType === 'password') {
			return (
				<ButtonPrimary
					onPress={() => {
						setShowPassword(!showPassword);
					}}
					isReactNodeContent
					designVariation='ghost'
					buttonStyles='absolute right-0 top-0 bottom-0 flex items-center justify-center '
					testID='show-password-button'
				>
					{showPassword ? <EyeIcon /> : <CrossedEyeIcon />}
				</ButtonPrimary>
			);
		}

		return null;
	};

	const renderCounter = (value: string) => {
		const { maxLength } = props;

		if (!maxLength) return null;

		const valueLength = value ? value.length : 0;

		return (
			<TextElement textStyles='text-neutral-gray text-sm mt-1 text-right absolute right-3 bottom-3'>{`${valueLength}/${maxLength}`}</TextElement>
		);
	};

	useEffect(() => {
		setInternalValue(editValue ?? '');
	}, [editValue]);

	return (
		<View className={containerStyles}>
			{label && (
				<TextElement textStyles={`text-gray-label mb-2 ${labelStyles} `}>
					{label}
				</TextElement>
			)}
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => (
					<View className='relative'>
						{!isBottomSheetTextInput ? (
							<TextInput
								autoComplete={autoCompleteType}
								value={editValue ? internalValue : value}
								onChangeText={(text) => {
									setInternalValue(text);
									onChange(text);
								}}
								className={inputClassName}
								selectionColor={selectionColor}
								secureTextEntry={showPassword}
								style={[
									{
										fontSize: 14,
										textAlignVertical: multiline ? 'top' : 'center',
									},
									style,
								]}
								testID={testID}
								{...props}
							/>
						) : (
							<BottomSheetTextInput
								autoComplete={autoCompleteType}
								value={editValue ? internalValue : value}
								onChangeText={(text) => {
									setInternalValue(text);
									onChange(text);
								}}
								selectionColor={selectionColor}
								secureTextEntry={showPassword}
								style={[
									{
										textAlignVertical: multiline ? 'top' : 'center',
									},
									styles.bottomSheetTextInput,
									style,
								]}
								testID={testID}
								{...props}
							/>
						)}
						{isPassword && renderIcon('password')}
						{!!customIcon && renderIcon('custom')}
						{showCounter && renderCounter(value)}
					</View>
				)}
			/>
			{error && (
				<TextElement textStyles={`text-error ${errorStyles}`}>
					{i18nInstance.t(error.message ?? 'error')}
				</TextElement>
			)}
			{showCustomError && (
				<TextElement textStyles={`text-error ${errorStyles}`}>
					{customErrorMessage}
				</TextElement>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	bottomSheetTextInput: {
		borderColor: '#3B3B3B',
		borderWidth: 1,
		borderRadius: 8,
		color: '#EBEBEB',
		padding: 13,
		paddingTop: 13,
		fontSize: 12,
	},
});

export default InputForm;
