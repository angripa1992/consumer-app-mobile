export const handlerAuthError = (error: any) => {
	const errorMessage = String(error);

	if (errorMessage.includes('403')) {
		return 'This email is pending approval.';
	}
	if (errorMessage.includes('302')) {
		return 'Email is already in use, please try log in.';
	}

	if (errorMessage.includes('409')) {
		return 'This account does not exist. Please sign up.';
	}

	if (errorMessage === 'Not authorized to access the application.') {
		return 'Please join our waitlist to get access.';
	}

	return errorMessage;
};
