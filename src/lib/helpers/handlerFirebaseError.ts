import { FirebaseError } from 'firebase/app';

export const handlerFirebaseError = (error: FirebaseError) => {
	if (error.code === 'auth/invalid-email') {
		return 'Invalid email, please try again.';
	}
	if (error.code === 'auth/user-not-found') {
		return 'User not found, please try again.';
	}
	if (error.code === 'auth/invalid-credential') {
		return 'Invalid credentials, please try again.';
	}
	if (error.code === 'auth/email-already-in-use') {
		return 'Email is already in use, please try log in.';
	}
	return 'Something went wrong, please try again.';
};
