import { expect, element, waitFor } from 'detox';

import { login } from './utils/commands';

describe('Spot screen', () => {
	beforeAll(async () => {
		await device.launchApp();
		await login();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should show spot info correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();
		await waitFor(element(by.id('profile-filter-spots')));
		await element(by.id('profile-filter-spots')).tap();

		await waitFor(element(by.id('spot-visited_spots-0'))).toBeVisible();
		await element(by.id('spot-visited_spots-0')).tap();

		await expect(element(by.id('spot-heart-button'))).toBeVisible();
		await expect(element(by.id('spot-name'))).toBeVisible();
		await expect(element(by.id('spot-share-button'))).toBeVisible();
		await expect(element(by.id('spot-screen-image'))).toBeVisible();

		await expect(element(by.id('spot-interactions'))).toBeVisible();
		await expect(element(by.id('spot-interaction-likes'))).toBeVisible();
		await expect(element(by.id('spot-interaction-scribbles'))).toBeVisible();
		await expect(element(by.id('spot-interaction-lists'))).toBeVisible();

		await expect(element(by.text('Visited'))).toBeVisible();
		await expect(element(by.id('opening-hours-button'))).toBeVisible();
		await element(by.id('opening-hours-button')).tap();
		await expect(element(by.id('modal-content'))).toBeVisible();
		await expect(element(by.id('close-modal-button'))).toBeVisible();
		await element(by.id('close-modal-button')).tap({ x: 5, y: 10 });

		await element(by.id('spot-screen-scroll')).scrollTo('bottom', 0.5, 0.5);
		await expect(element(by.id('spot-screen-map'))).toBeVisible();
	});

	it('should create and show a new scribble correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();
		await waitFor(element(by.id('profile-filter-spots')));
		await element(by.id('profile-filter-spots')).tap();

		await waitFor(element(by.id('spot-visited_spots-0'))).toBeVisible();
		await element(by.id('spot-visited_spots-0')).tap();

		await element(by.id('spot-interaction-scribbles')).tap();

		await element(by.id('add-scribble-button')).tap();

		await expect(element(by.id('scribble-form-title'))).toBeVisible();
		await expect(element(by.id('input-date-picker-button'))).toBeVisible();
		await expect(element(by.id('scribble-form-is-positive'))).toBeVisible();
		await expect(element(by.id('scribble-form-is-negative'))).toBeVisible();
		await expect(element(by.id('scribble-form-description'))).toBeVisible();
		await expect(element(by.id('scribble-form-submit-button'))).toBeVisible();
		await expect(element(by.id('scribble-form-cancel-button'))).toBeVisible();

		await element(by.id('input-date-picker-button')).tap();
		await element(by.text('Confirm')).tap();
		await element(by.id('scribble-form-is-positive')).tap();
		await element(by.id('scribble-form-description')).typeText(
			'This is a test scribble',
		);
		await element(by.id('scribble-form-submit-button')).tap();

		await waitFor(element(by.id('scribble-card-0')))
			.toBeVisible()
			.withTimeout(5000);
		await expect(
			element(
				by
					.id('scribble-card-0')
					.withDescendant(by.text('This is a test scribble')),
			),
		).toBeVisible();
	});

	it('should edit and delete scribble correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();
		await waitFor(element(by.id('profile-filter-spots')));
		await element(by.id('profile-filter-spots')).tap();

		await waitFor(element(by.id('spot-visited_spots-0'))).toBeVisible();
		await element(by.id('spot-visited_spots-0')).tap();

		await element(by.id('spot-interaction-scribbles')).tap();

		await element(
			by.id('scribble-options-button').withAncestor(by.id('scribble-card-0')),
		).tap();

		await expect(element(by.text('Edit Scribble'))).toBeVisible();
		await expect(element(by.text('Delete Scribble'))).toBeVisible();

		await element(by.text('Edit Scribble')).tap();
		await expect(element(by.id('scribble-form-title'))).toBeVisible();
		await expect(element(by.id('input-date-picker-button'))).toBeVisible();
		await expect(element(by.id('scribble-form-is-positive'))).toBeVisible();
		await expect(element(by.id('scribble-form-is-negative'))).toBeVisible();
		await expect(element(by.id('scribble-form-description'))).toBeVisible();
		await expect(element(by.id('scribble-form-submit-button'))).toBeVisible();
		await expect(element(by.id('scribble-form-cancel-button'))).toBeVisible();

		await element(by.id('scribble-form-is-negative')).tap();
		await element(by.id('scribble-form-description')).clearText();
		await element(by.id('scribble-form-description')).typeText('Updated');

		await element(by.id('scribble-form-submit-button')).tap();

		await expect(
			element(by.id('scribble-card-0').withDescendant(by.text('Updated'))),
		).toBeVisible();
		await element(
			by.id('scribble-options-button').withAncestor(by.id('scribble-card-0')),
		).tap();

		await expect(element(by.text('Edit Scribble'))).toBeVisible();
		await expect(element(by.text('Delete Scribble'))).toBeVisible();

		await element(by.text('Delete Scribble')).tap();

		await expect(
			element(by.text('Are you sure you want to delete this scribble?')),
		).toBeVisible();
		await expect(element(by.text('Delete'))).toBeVisible();
		await expect(element(by.text('Cancel'))).toBeVisible();

		await element(by.text('Delete')).tap();

		await expect(
			element(by.id('scribble-card-0').withDescendant(by.text('Updated'))),
		).not.toBeVisible();
	});

	it('should show spot thumbnail elements correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();
		await waitFor(element(by.id('profile-filter-spots')));
		await element(by.id('profile-filter-spots')).tap();

		await element(
			by
				.id('spot-visited_spots-0')
				.withDescendant(by.id('spot-thumbnail-heart-button')),
		).atIndex(1);
		await element(
			by
				.id('spot-visited_spots-0')
				.withDescendant(by.id('spot-thumbnail-been-button')),
		).atIndex(1);
		await element(
			by
				.id('spot-visited_spots-0')
				.withDescendant(by.id('spot-thumbnail-image')),
		).atIndex(1);

		await expect(
			element(by.id('spot-thumbnail-edit-button')),
		).not.toBeVisible();
	});

	it('should show spot list correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();

		await waitFor(element(by.id('profile-filter-list')));
		await element(by.id('list-0-my_list')).tap();

		await waitFor(element(by.id('list-name'))).toBeVisible();
		await waitFor(element(by.id('spot-0')))
			.toBeVisible()
			.withTimeout(2000);

		await element(
			by.id('spot-0').withDescendant(by.id('spot-thumbnail-heart-button')),
		);
		await element(
			by.id('spot-0').withDescendant(by.id('spot-thumbnail-been-button')),
		);
		await element(
			by.id('spot-0').withDescendant(by.id('spot-thumbnail-image')),
		);
		await element(
			by.id('spot-0').withDescendant(by.id('spot-thumbnail-edit-button')),
		);
	});
});
