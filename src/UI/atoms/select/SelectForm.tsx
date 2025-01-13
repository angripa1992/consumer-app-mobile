import { ReactNode, RefObject } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
} from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';

import TextElement from '../text/TextElement';
import DownArrowIcon from '@/UI/assets/svg/DownArrowIcon';
import { i18nInstance } from 'config/i18n';
import { TagOption } from '@/lib/types/tags';

type TypeSelectFormProps<T extends FieldValues, F> = {
	control: Control<T>;
	options: TagOption<F>[];
	name: Path<T>;
	defaultValue?: string;
	containerStyles?: string;
	label?: string | null;
	labelStyles?: string;
	error?: FieldError | undefined;
	editValue?: string;
	selectRef?: RefObject<any>;
	disabled?: boolean;
	errorStyles?: string;
	onCustomSelect?: (value: string) => void;
	testID?: string;
	customLabel?: ReactNode;
	designVariation?: 'default' | 'waitList';
	dropdownHeight?: number;
	buttonStyles?: ViewStyle;
};

const SelectForm = <T extends FieldValues, F>({
	options,
	name,
	control,
	defaultValue = i18nInstance.t('selectAnOption'),
	containerStyles,
	label = null,
	labelStyles,
	error,
	editValue,
	selectRef,
	disabled = false,
	errorStyles = '',
	onCustomSelect = () => {},
	testID,
	customLabel,
	designVariation = 'default',
	dropdownHeight,
	buttonStyles,
}: TypeSelectFormProps<T, F>) => {
	const styleDesignVariation = () => {
		if (designVariation === 'waitList') {
			return styles.buttonWaitListStyles;
		}
		return styles.buttonDefaultStyles;
	};

	return (
		<View className={containerStyles} testID={testID}>
			{label && (
				<TextElement textStyles={`text-white mb-2  ${labelStyles}`}>
					{label}
				</TextElement>
			)}
			{customLabel && customLabel}

			<Controller
				control={control}
				name={name}
				render={({ field: { value, onChange } }) => (
					<SelectDropdown
						ref={selectRef}
						data={options ?? []}
						disabled={disabled}
						defaultValue={editValue ?? value}
						showsVerticalScrollIndicator={false}
						statusBarTranslucent={true}
						searchInputStyle={{
							backgroundColor: '#151516',
							borderRadius: 6,
							borderWidth: 1,
							borderColor: '#3B3B3B',
						}}
						onSelect={(selectedItem) => {
							const selectedItemValue = selectedItem?.value
								? selectedItem.value
								: selectedItem;

							if (options) {
								onChange(selectedItemValue);
								onCustomSelect(selectedItemValue);
							}
						}}
						dropdownStyle={{
							...styles.dropdownStyles,
							height: dropdownHeight,
						}}
						renderButton={(selectedItem, isOpened) => {
							console.log('def', defaultValue);
							const selectedItemValue = selectedItem?.label;

							const defaultValueToShow = options.find(
								(item) => item.value === value,
							)?.label;

							return (
								<View style={[styleDesignVariation(), buttonStyles]}>
									<TextElement
										textStyles={`text-light-white ${designVariation === 'waitList' ? 'text-xs' : 'text-sm'}`}
									>
										{selectedItemValue || defaultValueToShow}
									</TextElement>
									<DownArrowIcon rotate={isOpened} />
								</View>
							);
						}}
						renderItem={(item, _, isSelected) => {
							const itemValue = item?.label ? item.label : item;

							return (
								<View style={styles.dropdownItemStyle}>
									<TextElement
										textStyles={`text-light-white text-sm ${isSelected ? 'font-bold' : ''}`}
									>
										{itemValue}
									</TextElement>
								</View>
							);
						}}
					/>
				)}
			/>
			{error && (
				<TextElement textStyles={`text-error ${errorStyles}`}>
					{i18nInstance.t(error.message ?? 'error')}
				</TextElement>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	dropdownStyles: {
		backgroundColor: '#151516',
		borderRadius: 6,
		borderWidth: 1,
		borderColor: '#3B3B3B',
		paddingVertical: 11,
		paddingHorizontal: 16,
	},
	dropdownItemStyle: {
		flexDirection: 'row',
		paddingVertical: 13,
	},
	buttonDefaultStyles: {
		borderColor: '#3B3B3B',
		backgroundColor: '#161616',
		width: '100%',
		height: 'auto',
		paddingVertical: 11,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	buttonWaitListStyles: {
		width: '100%',
		borderRadius: 8,
		borderWidth: 1,
		backgroundColor: '#FFFFFF08',
		borderColor: '#3B3B3B',
		height: 42,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 11,
		paddingHorizontal: 16,
	},
});

export default SelectForm;
