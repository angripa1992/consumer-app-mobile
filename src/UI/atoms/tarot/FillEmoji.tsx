import { View } from 'react-native';

import { charFromEmojiUnified } from '@/lib/helpers/strings/emojisHelpers';

import TextElement from '../text/TextElement';
import FillEmojiIcon from '@/UI/assets/svg/FillEmojiIcon';

type TypeFillEmojiProps = {
	emojiCode: string | null | undefined;
	testID?: string;
};

const FillEmoji = ({ emojiCode, testID }: TypeFillEmojiProps) => {
	return (
		<View
			className='bg-white/60 p-1 flex items-center justify-center rounded-lg'
			shouldRasterizeIOS={true}
		>
			{emojiCode ? (
				<TextElement textStyles='text-sm' testID={testID}>
					{charFromEmojiUnified(emojiCode)}
				</TextElement>
			) : (
				<View testID='empty-emoji-icon'>
					<FillEmojiIcon width={20} height={20} />
				</View>
			)}
		</View>
	);
};

export default FillEmoji;
