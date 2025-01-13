export const isPhoneNumber = (phoneNumber: string | null | undefined) => {
	if (!phoneNumber) return false;

	const phoneRegex =
		/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
	phoneNumber = phoneNumber.split(' ').join('');
	return phoneRegex.test(phoneNumber);
};
