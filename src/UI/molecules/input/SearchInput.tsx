import { View } from 'react-native';
import { Control, FieldValues, Path } from 'react-hook-form';

import SearchIcon from '@/UI/assets/svg/SearchIcon';
import { i18nInstance } from 'config/i18n';
import InputForm from '@/UI/atoms/input/InputForm';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CloseIcon from '@/UI/assets/svg/CloseIcon';
import AlertIcon from '@/UI/assets/svg/AlertIcon';
import TextElement from '@/UI/atoms/text/TextElement';

type TypeSearchInputProps<T extends FieldValues> = {
	searchQueryValue: string;
	control: Control<T>;
	name: Path<T>;
	clearInput: () => void;
	placeholder?: string;
	showCustomError?: boolean;
	customErrorText?: string;
	testID?: string;
	containerStyles?: string;
};

const SearchInput = <T extends FieldValues>({
	searchQueryValue,
	control,
	name,
	clearInput,
	placeholder = 'whereTo',
	showCustomError,
	customErrorText,
	testID,
	containerStyles,
}: TypeSearchInputProps<T>) => {
	return (
		<View className={containerStyles}>
			<View className=' relative'>
				<View className='absolute z-20  left-0 top-0 bottom-0  w-[50px] flex items-center justify-center'>
					<SearchIcon color='#858585' />
				</View>
				<InputForm
					control={control}
					name={name}
					placeholder={i18nInstance.t(placeholder)}
					placeholderTextColor='#666666'
					inputStyles='text-light-white pl-12 pr-10 border-[#F4F5F70F]'
					testID={testID}
				/>
				{searchQueryValue.length > 0 && (
					<ButtonPrimary
						isReactNodeContent
						onPress={clearInput}
						designVariation='ghost'
						buttonStyles='absolute z-20 bottom-0 right-0 top-0 w-[40px] flex items-center justify-center'
					>
						<CloseIcon color='#FFF' />
					</ButtonPrimary>
				)}
			</View>
			{showCustomError && (
				<View className='mt-3 flex-row items-center'>
					<AlertIcon width={20} height={20} color='#F66079' />
					<TextElement textStyles='text-red text-xs ml-2 text-error flex-1'>
						{customErrorText}
					</TextElement>
				</View>
			)}
		</View>
	);
};

export default SearchInput;
