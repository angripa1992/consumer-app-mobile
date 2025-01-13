import { expect, waitFor } from 'detox';

import { login } from './utils/commands';
import { randomNumber } from './utils/helpers';

const successMessage =
	"Spot added successfully. Soon, you'll be able to find the spot in our app.";

describe('Discovery screen', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should add a basic spot', async () => {
		await login();

		const spotName = `TestSpot${randomNumber(0, 10000)}`;

		await element(by.text('Discovery')).atIndex(1).tap();

		await element(by.id('add-spot-button-discovery')).tap();

		await expect(element(by.id('input-spot-name'))).toBeVisible();
		await expect(element(by.id('select-country'))).toBeVisible();
		await expect(element(by.id('select-city'))).toBeVisible();
		await element(by.id('input-spot-name')).typeText(spotName);

		await element(by.id('button-submit-spot')).tap();

		await waitFor(element(by.text(successMessage)))
			.toBeVisible()
			.withTimeout(5000);
	});
});
