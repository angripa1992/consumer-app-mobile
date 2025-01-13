import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import EmojiPicker, {
	EmojiType,
	useRecentPicksPersistence,
} from 'rn-emoji-keyboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { usePostEmojiToEvent } from '@/lib/hooks/useQueryEmoji';
import { charactersToEmojiCode } from '@/lib/helpers/strings/emojisHelpers';
import {
	emojiPickerDefaultExpandableHeight,
	emojiPickerDefaultHeight,
	emojiPickerTheme,
} from '@/lib/data/emojiPickerData';
import { STORAGE_KEY_FOR_EMOJIS } from '@/lib/utils/constants';

import TextElement from '../../../atoms/text/TextElement';
import EmojiCodeButton from './EmojiCodeButton';
import EmojiPickerIcon from '@/UI/assets/svg/EmojiPickerIcon';

import type { TypeEmojiFromEvent } from '@/lib/types/emojis';
import type { TypeQueriesMutateDestination } from '@/lib/types/queries';

interface EmojiPickerButtonProps {
	queryMutateDestination: TypeQueriesMutateDestination;
	eventId: number;
	emojis: TypeEmojiFromEvent[];
	spotId?: string | number;
}
const EmojiPickerButton = ({
	queryMutateDestination,
	eventId,
	emojis,
	spotId,
}: EmojiPickerButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const totalEmojisCounter = emojis.reduce(
		(total, emoji) => total + emoji.emoji_counter,
		0,
	);

	useRecentPicksPersistence({
		initialization: () =>
			AsyncStorage.getItem(STORAGE_KEY_FOR_EMOJIS).then((item) =>
				JSON.parse(item || '[]'),
			),
		onStateChange: (next) =>
			AsyncStorage.setItem(STORAGE_KEY_FOR_EMOJIS, JSON.stringify(next)),
	});

	const { mutateAsync: addEmojiToEvent } = usePostEmojiToEvent(
		queryMutateDestination,
		spotId,
	);

	const onPressEmojiPicker = () => {
		setIsModalOpen(true);
	};

	const onSelectEmoji = async (emoji: EmojiType) => {
		const emojiCode = charactersToEmojiCode(emoji.emoji);
		setIsModalOpen(false);

		if (emojis.some((emoji) => emoji.code === emojiCode)) return;

		await addEmojiToEvent({
			event_id: eventId,
			code: emojiCode,
			slug: emoji.slug,
		});
	};

	return (
		<>
			{emojis.length > 0 &&
				emojis.map((emoji, index) => (
					<EmojiCodeButton
						key={index}
						eventId={eventId}
						queryMutateDestination={queryMutateDestination}
						emojiCounter={emoji.emoji_counter}
						code={emoji.code}
						codeVariations={emoji.code_variations}
						eventEmojiId={emoji.event_emoji_id}
						slug={emoji.slug}
						variationsCodeId={emoji.variations_code_id}
						spotId={spotId}
					/>
				))}
			<TouchableOpacity
				className={'flex-row items-center bg-[#151515] p-1 rounded-lg'}
				activeOpacity={0.5}
				onPress={onPressEmojiPicker}
				testID='emoji-picker-button'
			>
				<EmojiPickerIcon width={20} height={20} />
				<TextElement
					textStyles='text-xs ml-1 text-white'
					testID='emoji-counter-text'
				>
					{totalEmojisCounter}
				</TextElement>
			</TouchableOpacity>
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
};

export default EmojiPickerButton;
