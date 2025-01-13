import { TouchableOpacity } from 'react-native';

import { charFromEmojiUnified } from '@/lib/helpers/strings/emojisHelpers';
import {
	useDeleteEmojiFromEvent,
	usePostEmojiToEvent,
} from '@/lib/hooks/useQueryEmoji';
import TextElement from '@/UI/atoms/text/TextElement';

import type { TypeQueriesMutateDestination } from '@/lib/types/queries';

type EmojiCodeButtonProps = {
	queryMutateDestination: TypeQueriesMutateDestination;
	eventId: number;
	code: string;
	slug: string;
	eventEmojiId: number | null;
	variationsCodeId: string | null;
	codeVariations: string[];
	emojiCounter: number;
	spotId?: number | string;
};

const EmojiCodeButton = ({
	code,
	emojiCounter,
	eventEmojiId,
	slug,
	variationsCodeId,
	codeVariations,
	eventId,
	queryMutateDestination,
	spotId,
}: EmojiCodeButtonProps) => {
	const emojiChar = charFromEmojiUnified(code);
	const { mutateAsync: addEmojiToEvent, isLoading: isLoadingAddEmojiToEvent } =
		usePostEmojiToEvent(queryMutateDestination, spotId);
	const { mutateAsync: deleteEmojiFromEvent } = useDeleteEmojiFromEvent(
		queryMutateDestination,
		eventId,
		spotId,
	);

	const onPressEmoji = async () => {
		if (isLoadingAddEmojiToEvent) return;

		if (!eventEmojiId) {
			await addEmojiToEvent({
				event_id: eventId,
				code,
				slug,
			});
			return;
		}
		await deleteEmojiFromEvent({
			event_emoji_id: eventEmojiId,
			variations_code_id: variationsCodeId,
		});
	};

	if (emojiCounter === 0) return;

	return (
		<TouchableOpacity
			activeOpacity={1}
			onPress={onPressEmoji}
			testID='emoji-button'
			hitSlop={2}
			className={`flex-row items-center p-1 rounded-lg border  ${isLoadingAddEmojiToEvent ? 'opacity-40' : ''} ${eventEmojiId ? 'border-admin-tag-gray bg-[#2E2E2E]' : 'bg-[#151515] border-[#151515]'}`}
			disabled={isLoadingAddEmojiToEvent}
		>
			<TextElement
				testID={`emoji-code-text-${code}`}
				textStyles='text-sm text-white'
			>
				{emojiChar}
				{codeVariations.length > 0 &&
					codeVariations.map((variation) => {
						const variationChar = charFromEmojiUnified(variation);
						return variationChar;
					})}
			</TextElement>
			<TextElement
				textStyles='text-xs ml-1 text-white'
				testID='emoji-counter-text'
			>
				{emojiCounter}
			</TextElement>
		</TouchableOpacity>
	);
};

export default EmojiCodeButton;
