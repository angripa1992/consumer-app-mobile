import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import EmojiPickerIcon from '@/UI/assets/svg/EmojiPickerIcon';
import {
	Control,
	Controller,
	FieldError,
	FieldValues,
	Path,
} from 'react-hook-form';
import EmojiPicker, {
	EmojiType,
	useRecentPicksPersistence,
} from 'rn-emoji-keyboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
	emojiPickerDefaultExpandableHeight,
	emojiPickerDefaultHeight,
	emojiPickerTheme,
} from '@/lib/data/emojiPickerData';
import {
	charFromEmojiUnified,
	charactersToEmojiCode,
} from '@/lib/helpers/strings/emojisHelpers';
import { STORAGE_KEY_FOR_EMOJIS } from '@/lib/utils/constants';

import TextElement from '../text/TextElement';
import { i18nInstance } from 'config/i18n';
import EmojiCubePicker from '@/UI/assets/svg/EmojiCubePicker';

type EmojiInputFormProps<T extends FieldValues> = {
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

const EmojiInputForm = <T extends FieldValues>({
	control,
	name,
	inputStyles,
	containerStyles = '',
	label,
	labelStyles,
	error,
	testID,
	errorStyles = '',
}: EmojiInputFormProps<T>) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	useRecentPicksPersistence({
		initialization: () =>
			AsyncStorage.getItem(STORAGE_KEY_FOR_EMOJIS).then((item) =>
				JSON.parse(item || '[]'),
			),
		onStateChange: (next) =>
			AsyncStorage.setItem(STORAGE_KEY_FOR_EMOJIS, JSON.stringify(next)),
	});

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
					const valueCode = value?.code ? value.code : undefined;
					const emojiCharToShow = valueCode
						? charFromEmojiUnified(valueCode)
						: undefined;

					const onPressEmojiPicker = () => {
						setIsModalOpen(true);
					};

					const onSelectEmoji = (emoji: EmojiType) => {
						const emojiChar = charactersToEmojiCode(emoji.emoji);
						onChange({
							slug: emoji.slug,
							code: emojiChar,
						});
					};

					const onClearEmoji = () => {
						onChange(null);
					};

					return (
						<>
							<View className={inputStyles}>
								<TouchableOpacity
									activeOpacity={0.6}
									onPress={onPressEmojiPicker}
									testID={testID}
									className='relative'
								>
									{value ? (
										<View className='border p-1 rounded-lg border-white/30'>
											<TextElement textStyles='text-xl '>
												{emojiCharToShow}
											</TextElement>
										</View>
									) : (
										<EmojiCubePicker />
									)}
								</TouchableOpacity>
								{value && (
									<TouchableOpacity
										onPress={onClearEmoji}
										className='absolute -bottom-7'
									>
										<TextElement textStyles='text-xs text-gray mt-2'>
											{i18nInstance.t('clear')}
										</TextElement>
									</TouchableOpacity>
								)}
							</View>
							<EmojiPicker
								enableRecentlyUsed
								enableSearchBar
								onEmojiSelected={(emoji) => onSelectEmoji(emoji)}
								open={isModalOpen}
								onClose={() => setIsModalOpen(false)}
								defaultHeight={emojiPickerDefaultHeight}
								expandedHeight={emojiPickerDefaultExpandableHeight}
								theme={emojiPickerTheme}
							/>
						</>
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

export default EmojiInputForm;
