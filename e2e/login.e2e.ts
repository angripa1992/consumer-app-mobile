import { expect, element, by, waitFor } from 'detox';
import { USER_LOGIN } from './utils/mockedData.mock';
import { login } from './utils/commands';
const { openApp } = require('./utils/openApp');

describe('Login Screen', () => {
	beforeAll(async () => {
		await openApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should not login with incorrect credentials', async () => {
		await login('i_am_not_exist@test.com', 'anything123');
		await waitFor(element(by.text('Invalid credentials, please try again.')))
			.toBeVisible()
			.withTimeout(2000);
	});

	it('should not register in waitlist with an existing email', async () => {
		await element(by.id('signup-email')).typeText(USER_LOGIN.email);
		await element(by.id('signup-name')).typeText(USER_LOGIN.name);
		await expect(element(by.id('show-password-button'))).toBeVisible();
		await element(by.id('show-password-button')).tap();

		await element(by.id('signup-password')).typeText(USER_LOGIN.password);

		await element(by.text('Sign up')).tap();

		await waitFor(
			element(by.text('Email is already in use, please try log in.')),
		)
			.toBeVisible()
			.withTimeout(1000);
	});

	it('should login with correct credentials', async () => {
		await element(by.id('change-signin-button')).tap();

		await expect(element(by.id('google-button'))).toBeVisible();
		await expect(element(by.id('apple-button'))).toBeVisible();

		await element(by.id('email')).typeText(USER_LOGIN.email);
		await element(by.id('password')).typeText(USER_LOGIN.password);

		await element(by.text('Log In')).tap();
	});
});
