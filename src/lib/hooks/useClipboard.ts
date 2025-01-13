import { useCallback, useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';

export const useClipboard = (
	value: string,
	timeout = 1500,
	callBack?: () => void,
) => {
	const [hasCopied, setHasCopied] = useState(false);
	const [valueState, setValueState] = useState(value);

	const handleCopy = useCallback(async () => {
		try {
			await Clipboard.setString(valueState);
			setHasCopied(true);
			callBack && callBack();
		} catch (error) {
			setHasCopied(false);
		}
	}, [valueState]);

	useEffect(() => setValueState(value), [value]);

	useEffect(() => {
		let timeoutId: number | null = null;

		if (hasCopied) {
			timeoutId = Number(
				setTimeout(() => {
					setHasCopied(false);
				}, timeout),
			);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [timeout, hasCopied]);

	return {
		onCopyToClipBoard: handleCopy,
		hasCopied,
	};
};
