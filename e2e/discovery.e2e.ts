import { expect } from 'detox';

import { login } from './utils/commands';

describe('Discovery screen', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should show all UI elements correctly', async () => {
		await login();

		await element(by.text('Explore')).atIndex(1).tap();

		await expect(element(by.id('discovery-location-filter'))).toBeVisible();
		await expect(element(by.id('discovery-search-input'))).toBeVisible();
		await expect(element(by.id('discovery-spots-nearby-button'))).toBeVisible();

		await expect(element(by.id('discovery-tabs-list'))).toBeVisible();
		await waitFor(element(by.id('discovery-tab-element-all')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await waitFor(element(by.id('discovery-tab-element-categories')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await waitFor(element(by.id('discovery-tab-element-spot')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await waitFor(element(by.id('discovery-tab-element-user')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await waitFor(element(by.id('discovery-tab-element-spotList')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
	});

	it('should search correctly', async () => {
		await element(by.text('Explore')).atIndex(1).tap();

		await element(by.id('discovery-search-input')).typeText('Bar');

		// all tab
		await waitFor(element(by.id('discovery-search-result-text')))
			.toBeVisible()
			.withTimeout(4000);
		await expect(element(by.id('discovery-spots-nearby-button'))).toBeVisible();
		await expect(element(by.text('Spots Results'))).toBeVisible();
		await element(
			by
				.id('spot-candidate-0')
				.withDescendant(by.id('spot-thumbnail-heart-button')),
		).atIndex(1);
		await element(
			by
				.id('spot-candidate-0')
				.withDescendant(by.id('spot-thumbnail-been-button')),
		).atIndex(1);
		await element(
			by
				.id('spot-candidate-0')
				.withDescendant(by.id('spot-thumbnail-saved-button')),
		).atIndex(1);
		await element(
			by.id('spot-candidate-0').withDescendant(by.id('spot-thumbnail-image')),
		).atIndex(1);

		await waitFor(element(by.id('discovery-tab-element-categories')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await element(by.id('discovery-tab-element-categories')).tap();
		await expect(element(by.id('discovery-no-results'))).toBeVisible();

		// spots tab
		await waitFor(element(by.id('discovery-tab-element-spot')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await element(by.id('discovery-tab-element-spot')).tap();

		await element(
			by
				.id('spot-candidate-0')
				.withDescendant(by.id('spot-thumbnail-heart-button')),
		).atIndex(1);
		await element(
			by
				.id('spot-candidate-0')
				.withDescendant(by.id('spot-thumbnail-been-button')),
		).atIndex(1);
		await element(
			by
				.id('spot-candidate-0')
				.withDescendant(by.id('spot-thumbnail-saved-button')),
		).atIndex(1);
		await element(
			by.id('spot-candidate-0').withDescendant(by.id('spot-thumbnail-image')),
		).atIndex(1);

		// people tab
		await waitFor(element(by.id('discovery-tab-element-user')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await element(by.id('discovery-tab-element-user')).tap();
		await expect(
			element(by.id('discovery-search-result-text')),
		).not.toBeVisible();
		await expect(element(by.id('discovery-location-filter'))).not.toBeVisible();

		// list tab
		await waitFor(element(by.id('discovery-tab-element-spotList')))
			.toBeVisible()
			.whileElement(by.id('discovery-tabs-list'))
			.scroll(70, 'right');
		await element(by.id('discovery-tab-element-spotList')).tap();
		await expect(element(by.id('discovery-no-results'))).toBeVisible();
	});
});
