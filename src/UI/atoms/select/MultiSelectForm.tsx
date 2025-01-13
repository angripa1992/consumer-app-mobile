import { View } from 'react-native';
import TextElement from '../text/TextElement';
import {
	Controller,
	Control,
	FieldError,
	FieldValues,
	Merge,
	Path,
} from 'react-hook-form';
import { TagOptionString } from '@/lib/types/tags';
import CustomMultiSelectFormOption from './CustomMultiSelectFormOption';

type TypeMultiSelectFormProps<T extends FieldValues> = {
	control: Control<T>;
	name: Path<T>;
	options: TagOptionString[];
	label?: string;
	disabled?: boolean;
	error?: Merge<FieldError, (FieldError | undefined)[]> | undefined;

	labelStyles?: string;
	containerOptionsStyles?: string;
	containerColumnGap?: number;
	containerRowGap?: number;
	optionsActiveTextStyles?: string;
	optionsTextStyles?: string;
	optionsStyles?: string;
	optionsDefaultColor?: string;
	optionsBackgroundOpacity?: string;
	limitSelectedOptions?: number;
	singleSelect?: boolean;
};

const MultiSelectForm = <T extends FieldValues>({
	control,
	name,
	options,
	label,
	error,
	labelStyles,
	containerOptionsStyles,
	containerColumnGap = 4,
	containerRowGap = 4,
	optionsTextStyles,
	optionsActiveTextStyles,
	optionsStyles,
	optionsDefaultColor,
	optionsBackgroundOpacity,
	limitSelectedOptions,
	disabled = false,
	singleSelect = false,
}: TypeMultiSelectFormProps<T>) => {
	const onPressOption = (
		selectedItems: string[],
		option: TagOptionString,
		onChange: (...event: any[]) => void,
	) => {
		if (singleSelect) {
			onChange([option.value]);
			return;
		}

		if (selectedItems.includes(option.value)) {
			const filteredItems = selectedItems.filter(
				(item) => item !== option.value,
			);

			onChange(filteredItems);

			return;
		}

		const newItems = [...selectedItems, option.value];
		onChange(newItems);
	};

	return (
		<View className='w-full mb-1'>
			{label && (
				<TextElement
					textStyles={`text-neutral-gray text-[11px] ${labelStyles ?? ''}`}
				>
					{label}
				</TextElement>
			)}
			<View>
				<Controller
					name={name}
					control={control}
					render={({ field: { onChange, value } }) => {
						return (
							<View
								style={{
									columnGap: containerColumnGap,
									rowGap: containerRowGap,
								}}
								className={`flex flex-row  justify-between ${containerOptionsStyles}`}
							>
								{options.map((option, index) => {
									const selectedOptions = (
										Array.isArray(value) ? value : []
									) as string[];
									const isOptionSelected = selectedOptions.includes(
										option.value,
									);

									const onPress = () => {
										onPressOption(value, option, onChange);
									};

									return (
										<CustomMultiSelectFormOption
											key={index}
											selectedOptions={selectedOptions}
											option={option}
											onPressOption={onPress}
											isItemSelected={isOptionSelected}
											disabled={disabled}
											optionsTextStyles={optionsTextStyles}
											optionsStyles={optionsStyles}
											optionsDefaultColor={optionsDefaultColor}
											optionsBackgroundOpacity={optionsBackgroundOpacity}
											optionsActiveTextStyles={optionsActiveTextStyles}
											limitSelectedOptions={limitSelectedOptions}
										/>
									);
								})}
							</View>
						);
					}}
				/>
			</View>
			{error && (
				<TextElement textStyles='text-error'> {error.message} </TextElement>
			)}
		</View>
	);
};

export default MultiSelectForm;
