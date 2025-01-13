export const extractNameFromEmail = (mail: string | null) => {
	if (!mail) {
		return null;
	}

	const match = mail.match(/^([^@]+)/);

	if (match) {
		return match[0];
	} else {
		return null;
	}
};
