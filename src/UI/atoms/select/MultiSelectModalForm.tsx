import { useRef } from 'react';
import { View, Keyboard } from 'react-native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
	Controller,
	type Control,
	type FieldError,
	type FieldValues,
	type Merge,
	type Path,
} from 'react-hook-form';

import CustomChipItem from './CustomChipItem';
import TextElement from '../text/TextElement';
import ButtonPrimary from '../button/ButtonPrimary';
import MultiSelectModal from '@/UI/organism/modal/MultiSelectModal';
import DownArrowIcon from '@/UI/assets/svg/DownArrowIcon';

import type { TagOption } from '@/lib/types/tags';

type TypeMultiSelectModalFormProps<T extends FieldValues, F> = {
	control: Control<T>;
	name: Path<T>;
	options: TagOption<F>[];
	label: string;
	labelStyles?: string;
	placeholder?: string;
	clearItemsText?: string;
	error?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
};

const MultiSelectModalForm = <T extends FieldValues, F>({
	control,
	name,
	options,
	label,
	labelStyles,
	placeholder = 'Choose tags',
	clearItemsText = 'Clear items',
	error,
}: TypeMultiSelectModalFormProps<T, F>) => {
	const multiSelectModalRef = useRef<BottomSheetModal>(null);

	const onPressButton = () => {
		Keyboard.dismiss();
		multiSelectModalRef.current?.present();
	};

	return (
		<View className='w-full'>
			<TextElement textStyles={`text-neutral-gray  mb-2 ${labelStyles}`}>
				{label}
			</TextElement>
			<View>
				<ButtonPrimary
					designVariation='ghost'
					buttonStyles='bg-dark-gray py-3  rounded-lg border border-admin-gray px-[16px] '
					isReactNodeContent={true}
					nodeContentStyles='flex flex-row justify-between items-center'
					onPress={onPressButton}
				>
					<TextElement textStyles='text-light-white text-sm no-underline  text-left '>
						{placeholder}
					</TextElement>
					<DownArrowIcon />
				</ButtonPrimary>
				<Controller
					control={control}
					name={name}
					render={({ field: { onChange, value } }) => {
						const items = Array.isArray(value) ? value : [];
						const hasItems = items && items.length > 0;

						const onResetItems = () => {
							onChange([]);
						};

						return (
							<>
								{hasItems && (
									<View className='mt-1 flex flex-row flex-wrap'>
										{items.map((item: number) => {
											const itemFound = options.find(
												(option) => option.value === item,
											);

											if (itemFound) {
												return (
													<CustomChipItem
														key={itemFound?.label}
														option={itemFound}
														selectedItems={items}
														onSelectedItemsChange={onChange}
													/>
												);
											}
										})}
									</View>
								)}
								{hasItems && (
									<View className='flex-row justify-end mt-3'>
										<ButtonPrimary
											designVariation='ghost'
											onPress={onResetItems}
										>
											{clearItemsText}
										</ButtonPrimary>
									</View>
								)}
							</>
						);
					}}
				/>
			</View>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => {
					const items = Array.isArray(value) ? value : [];

					return (
						<MultiSelectModal
							options={options}
							onSelectedItemsChange={onChange}
							selectedItems={items}
							multiSelectModalRef={multiSelectModalRef}
						/>
					);
				}}
			/>
			{error && (
				<TextElement textStyles='text-error'> {error.message} </TextElement>
			)}
		</View>
	);
};

export default MultiSelectModalForm;
