import { expect, element, waitFor } from 'detox';

import { login } from './utils/commands';
import { randomString } from './utils/helpers';

describe('Profile screen', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	it('should show filters and user info correctly', async () => {
		await login();

		await element(by.text('Profile')).atIndex(1).tap();

		await expect(element(by.id('profile-username'))).toBeVisible();
		await expect(element(by.id('profile-image'))).toBeVisible();
		await expect(element(by.id('profile-location'))).toBeVisible();
		await expect(element(by.id('profile-biography'))).toBeVisible();

		await expect(element(by.id('profile-lists-counter'))).toBeVisible();
		await expect(element(by.id('profile-following-counter'))).toBeVisible();
		await expect(element(by.id('profile-followers-counter'))).toBeVisible();

		await expect(element(by.text('My Lists'))).toBeVisible();
		await expect(element(by.text('Saved Lists'))).toBeVisible();
		await expect(element(by.text('Spots'))).toBeVisible();
	});

	it('should filters works correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();

		const firstSpotListId = 'list-0-my_list';
		const secondSpotListId = 'list-0-liked_list';
		const firstSpotInBeenTo = 'spot-visited_spots-0';
		const firstSpotInFavorites = 'spot-liked_spots-0';

		await expect(element(by.id(firstSpotListId))).toBeVisible();

		await element(by.text('Saved Lists')).tap();

		await expect(element(by.id(secondSpotListId))).toBeVisible();

		await element(by.text('Spots')).tap();
		await expect(element(by.text('Visited Spots'))).toBeVisible();
		await expect(element(by.text('Liked Spots'))).toBeVisible();

		await expect(element(by.id(firstSpotInBeenTo))).toBeVisible();
		await element(by.id('profile-lists-scroll')).scrollTo('bottom');
		await expect(element(by.id(firstSpotInFavorites))).toBeVisible();
	});

	it('should show edit form correctly', async () => {
		const newUserName = randomString(7);

		await element(by.text('Profile')).atIndex(1).tap();

		await waitFor(element(by.id('profile-options')))
			.toBeVisible()
			.withTimeout(2000);
		await element(by.id('profile-options')).tap();

		await waitFor(element(by.text('Edit Profile')))
			.toBeVisible()
			.withTimeout(2000);
		await element(by.text('Edit Profile')).tap();

		await element(by.id('input-profile-name')).replaceText(newUserName);
		await expect(element(by.id('edit-profile-username'))).toBeVisible();
		await expect(element(by.id('profile-tarot-code'))).toBeVisible();
		await expect(element(by.id('profile-filter-profile'))).toBeVisible();
		await expect(element(by.id('profile-filter-qr-card'))).toBeVisible();
		await waitFor(element(by.id('profile-form-scroll')))
			.toBeVisible()
			.whileElement(by.id('input-profile-tarot'))
			.scroll(70, 'down');

		await element(by.id('profile-form-scroll')).scrollTo('bottom');
		await element(by.id('button-update-profile')).tap();

		await waitFor(element(by.text(newUserName)))
			.toBeVisible()
			.withTimeout(1000);
	});

	it('should show followers correctly', async () => {
		await element(by.text('Profile')).atIndex(1).tap();
		await element(by.id('profile-lists-scroll')).scrollTo('top');

		const profileTestID = `profile-thumbnail-0-followers`;

		await waitFor(element(by.id('profile-followers-counter'))).toBeVisible();
		await element(by.id('profile-followers-counter')).tap();

		await expect(element(by.id(profileTestID))).toBeVisible();
		await expect(
			element(
				by.id(profileTestID).withDescendant(by.id('profile-thumbnail-name')),
			),
		).toBeVisible();
		await expect(
			element(
				by.id(profileTestID).withDescendant(by.id('profile-thumbnail-image')),
			),
		).toBeVisible();
		await expect(
			element(
				by
					.id(profileTestID)
					.withDescendant(by.id('profile-thumbnail-follow-button')),
			),
		).toBeVisible();
	});

	it("should show and edit user's tarot correctly", async () => {
		const allShapes = [
			'Asterisk',
			'Circle',
			'Diamond',
			'Love Heart',
			'Splatter',
		];
		const shapeToSelect =
			allShapes[Math.floor(Math.random() * allShapes.length)];
		const emojiToSelect = '😄';

		const tarotQRButton = element(by.id('tarot-qr-button'));
		const tarotUsername = element(by.id('tarot-username'));
		const tarotName = element(by.id('tarot-name'));
		const tarotAvatar = element(by.id('tarot-avatar-image'));

		const tarotEmojiOne = element(by.id('tarot-emoji-one'));
		const tarotDate = element(by.id('tarot-date'));
		const tarotCustomizeButton = element(by.id('tarot-edit-card'));

		const inputShowAvatar = element(by.id('input-show-avatar'));
		const inputShowName = element(by.id('input-show-name'));
		const inputShape = element(by.id('input-shape'));
		const inputEmojiOne = element(by.id('input-emoji-one'));
		const buttonSave = element(by.id('button-save'));

		await element(by.text('Profile')).atIndex(1).tap();

		await expect(tarotQRButton).toBeVisible();
		await tarotQRButton.tap();

		await waitFor(tarotUsername).toBeVisible().withTimeout(1000);

		await expect(tarotName).toBeVisible();
		await waitFor(tarotAvatar).toBeVisible().withTimeout(3000);
		await expect(tarotDate).toBeVisible();
		await expect(tarotCustomizeButton).toBeVisible();

		await tarotCustomizeButton.tap();

		await waitFor(inputShowAvatar).toBeVisible().withTimeout(1000);
		await expect(inputShowAvatar).toBeVisible();
		await expect(inputShowName).toBeVisible();
		await expect(inputShape).toBeVisible();
		await expect(inputEmojiOne).toBeVisible();

		await inputShape.tap();
		await element(by.text(shapeToSelect)).tap();

		await inputEmojiOne.tap();
		await element(by.text(emojiToSelect)).tap();

		await buttonSave.tap();

		await expect(tarotEmojiOne).toHaveText(emojiToSelect);
	});
});
