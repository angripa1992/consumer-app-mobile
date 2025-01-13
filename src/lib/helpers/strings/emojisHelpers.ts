const charFromUtf16 = (utf16: string): string =>
	String.fromCodePoint(...utf16.split('-').map((u: string) => parseInt(u, 16)));

export const charFromEmojiUnified = (unified: string): string =>
	charFromUtf16(unified);

export const charactersToEmojiCode = (char: string): string => {
	const codePoints = Array.from(char).map((c) =>
		c.codePointAt(0)?.toString(16).toUpperCase(),
	);
	return codePoints.join('-');
};
