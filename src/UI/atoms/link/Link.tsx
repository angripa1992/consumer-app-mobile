import { handleLinkPress } from '@/lib/helpers/handleLinkPress';
import { useCallback } from 'react';
import { Pressable } from 'react-native';

interface LinkProps {
	linkStyles?: string;
	url?: string | null;
	children: React.ReactNode;
}

const Link = ({ url, linkStyles, children }: LinkProps) => {
	const handlePress = useCallback(async () => {
		await handleLinkPress(url);
	}, [url]);

	return (
		<Pressable className={linkStyles} onPress={handlePress}>
			{children}
		</Pressable>
	);
};

export default Link;
