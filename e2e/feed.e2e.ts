import { expect, element } from 'detox';

import { login } from './utils/commands';
import { charFromEmojiUnified } from '../src/lib/helpers/strings/emojisHelpers';

describe('Feed screen', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should show all UI feed correctly', async () => {
		await login();
		const firstIndexFeedCard = 0;
		const firstFeedCardTestId = `feed-card-${firstIndexFeedCard}`;
		const secondIndexFeedCard = 1;
		const secondFeedCardTestId = `feed-card-${secondIndexFeedCard}`;

		await expect(element(by.id('feed-community-tab'))).toBeVisible();
		await expect(element(by.id('feed-following-tab'))).toBeVisible();
		await expect(element(by.id('invite-friends-button'))).toBeVisible();

		waitFor(element(by.id(firstFeedCardTestId))).toBeVisible();

		await expect(element(by.id(firstFeedCardTestId))).toBeVisible();

		const eventName = element(by.id(`name-${firstFeedCardTestId}`));
		const eventMessage = element(by.id(`event-${firstFeedCardTestId}`));
		const eventImage = element(by.id(`image-${firstFeedCardTestId}`));
		const eventHeart = element(by.id(`heart-${firstFeedCardTestId}`));

		await expect(eventName).toBeVisible();
		await expect(eventMessage).toBeVisible();
		await expect(eventImage).toBeVisible();
		await expect(eventHeart).toBeVisible();

		await element(by.id('feed-following-tab')).tap();

		waitFor(element(by.id(secondFeedCardTestId))).toBeVisible();

		await expect(element(by.id(secondFeedCardTestId))).toBeVisible();

		const secondEventName = element(by.id(`name-${secondFeedCardTestId}`));
		const secondEventMessage = element(by.id(`event-${secondFeedCardTestId}`));
		const secondEventImage = element(by.id(`image-${secondFeedCardTestId}`));
		const secondEventHeart = element(by.id(`heart-${secondFeedCardTestId}`));

		await expect(secondEventName).toBeVisible();
		await expect(secondEventMessage).toBeVisible();
		await expect(secondEventImage).toBeVisible();
		await expect(secondEventHeart).toBeVisible();
	});

	it('should handle emojis correctly', async () => {
		const firstIndexFeedCard = 0;
		const firstFeedCardTestId = `feed-card-${firstIndexFeedCard}`;
		const emojiCode = '1F602';

		await expect(element(by.id(firstFeedCardTestId))).toBeVisible();

		const emojiPickerButton = element(by.id('emoji-picker-button')).atIndex(
			firstIndexFeedCard,
		);
		await emojiPickerButton.tap();

		const emojiText = charFromEmojiUnified(emojiCode);

		const emoji = element(by.text(emojiText));
		await waitFor(emoji).toBeVisible().withTimeout(1000);

		await emoji.tap();

		const emojiAddedText = element(
			by.id(`emoji-code-text-${emojiCode}`),
		).atIndex(firstIndexFeedCard);

		await expect(emojiAddedText).toHaveText(emojiText);

		await emojiAddedText.tap();

		await expect(emojiAddedText).not.toBeVisible();
	});
});
