import { USER_LOGIN } from './mockedData.mock';

export const login = async (email?: string, password?: string) => {
	const emailToSend = email ? email : USER_LOGIN.email;
	const passwordToSend = password ? password : USER_LOGIN.password;

	await element(by.id('change-signin-button')).tap();
	await element(by.id('email')).typeText(emailToSend);
	await element(by.id('password')).typeText(passwordToSend);

	await element(by.text('Log In')).tap();
};
