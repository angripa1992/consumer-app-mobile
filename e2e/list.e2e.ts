import { expect, element, waitFor } from 'detox';
import { randomNumber } from './utils/helpers';
import { login } from './utils/commands';

describe('List screen', () => {
	beforeAll(async () => {
		await device.launchApp();

		await login();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should show an own single list correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();

		await element(by.id('list-0-my_list')).tap();

		await expect(element(by.id('list-name'))).toBeVisible();
		await expect(element(by.id('list-heart-button'))).not.toBeVisible();
		await expect(element(by.id('list-share-button'))).toBeVisible();
		await expect(element(by.id('list-creator'))).toBeVisible();
		await expect(element(by.id('add-spots-button'))).toBeVisible();
		await expect(element(by.id('map-locations-button'))).toBeVisible();
		await expect(element(by.id('list-filter-all'))).toBeVisible();
		await expect(element(by.id('list-filter-is_like_spot'))).toBeVisible();
		await expect(element(by.id('list-filter-is_been_to'))).toBeVisible();
		await expect(element(by.id('list-spot-counter'))).toBeVisible();
		await expect(element(by.id('list-follows-counter'))).toBeVisible();
		await expect(element(by.id('list-view-counter'))).toBeVisible();
		await expect(element(by.id('list-description'))).toBeVisible();
	});

	it('should show list thumbnail elements correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();

		await expect(
			element(
				by
					.id('list-0-my_list')
					.withDescendant(by.id('list-thumbnail-heart-button')),
			),
		).toBeVisible();

		await expect(
			element(
				by
					.id('list-0-my_list')
					.withDescendant(by.id('list-thumbnail-views-counter')),
			),
		).toBeVisible();

		await expect(
			element(
				by.id('list-0-my_list').withDescendant(by.id('list-thumbnail-creator')),
			),
		).toBeVisible();

		await expect(
			element(
				by
					.id('list-0-my_list')
					.withDescendant(by.id('list-thumbnail-spot-counter')),
			),
		).toBeVisible();
	});

	it('should search spots and appear at least one', async () => {
		await element(by.text('Profile')).atIndex(1).tap();

		await element(by.id('list-0-my_list')).tap();

		await element(by.id('add-spots-button')).tap();
		await element(by.id('search-spot-input')).typeText('chicken');
		await waitFor(element(by.id('spot-candidate-0')))
			.toBeVisible()
			.withTimeout(5000);
	});

	it('should create a list ', async () => {
		const spotListName = `TestList${randomNumber(0, 10000)}`;
		const spotListDescription = `TestDescription${randomNumber(0, 10000)}`;
		await element(by.text('Create')).atIndex(0).tap();
		await expect(element(by.id('input-list-name'))).toBeVisible();
		await element(by.id('input-list-name')).typeText(spotListName);

		await element(by.text('Select Country')).tap();
		await element(by.text('Colombia')).tap();

		await element(by.id('input-list-description')).typeText(
			spotListDescription,
		);

		await element(by.id('button-save-list')).tap();

		await waitFor(element(by.text(`${spotListName} successfully created...`)))
			.toBeVisible()
			.withTimeout(6000);

		await element(by.id('close-toast')).tap();

		await expect(element(by.id('list-name'))).toBeVisible();
	});
});
