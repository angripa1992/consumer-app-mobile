import { expect, element, waitFor } from 'detox';

import { login } from './utils/commands';

const userCity = 'Singapore';
const userCountry = 'Singapore';

const spotListId = 'list-0';

const myListCategoryKey = 'my_list';
const nearbySpotListCategoryKey = 'nearby_spot_list';
const popularListCategoryKey = 'popular_list';
const likedListCategoryKey = 'liked_list';

const viewMoreNearbySpotListId = `${nearbySpotListCategoryKey}-view_more`;
const viewMorePopularListId = `${popularListCategoryKey}-view_more`;
const viewMoreLikedListId = `${likedListCategoryKey}-view_more`;

const firstSpotListIdForMyLists = `${spotListId}-${myListCategoryKey}`;
const firstSpotListIdForNearbySpotLists = `${spotListId}-${nearbySpotListCategoryKey}`;
const firstSpotListIdForPopularLists = `${spotListId}-${popularListCategoryKey}`;
const firstSpotListIdForLikedList = `${spotListId}-${likedListCategoryKey}`;

describe('Explore screen', () => {
	beforeAll(async () => {
		await device.launchApp();
	});

	beforeEach(async () => {
		await device.reloadReactNative();
	});

	it('should show all categories correctly', async () => {
		await login();

		await element(by.text('Explore')).atIndex(1).tap();

		await waitFor(element(by.text(`${userCity}, ${userCountry}`)))
			.toBeVisible()
			.withTimeout(1000);

		// my list
		await waitFor(element(by.text('My lists')))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');

		await waitFor(element(by.id(firstSpotListIdForMyLists)))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');

		// nearby spot list
		await waitFor(element(by.text('Nearby spot lists')))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');

		await expect(element(by.id(viewMoreNearbySpotListId))).toBeVisible();

		await waitFor(element(by.id(firstSpotListIdForNearbySpotLists)))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');

		// popular list
		await waitFor(element(by.text('Popular lists')))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');

		await expect(element(by.id(viewMorePopularListId))).toBeVisible();

		await waitFor(element(by.id(firstSpotListIdForPopularLists)))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(140, 'down');

		// liked list
		await expect(element(by.text('Lists you liked'))).toBeVisible();
		await element(by.id('home-scroll')).scrollTo('bottom');

		await expect(element(by.id(viewMoreLikedListId))).toBeVisible();

		await expect(element(by.id(firstSpotListIdForLikedList))).toBeVisible();
	});

	it('should show view more screen correctly', async () => {
		await element(by.text('Explore')).atIndex(1).tap();

		await waitFor(element(by.text('My lists')))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(140, 'down');

		// nearby spot list
		await waitFor(element(by.id(viewMoreNearbySpotListId)))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');
		await element(by.id(viewMoreNearbySpotListId)).tap();

		await expect(
			element(by.id(firstSpotListIdForNearbySpotLists)),
		).toBeVisible();

		await element(by.id('view-more-back')).tap();

		// popular list
		await waitFor(element(by.id(viewMorePopularListId)))
			.toBeVisible()
			.whileElement(by.id('home-scroll'))
			.scroll(70, 'down');
		await element(by.id(viewMorePopularListId)).tap();
		await expect(element(by.id(firstSpotListIdForPopularLists))).toBeVisible();
		await element(by.id('view-more-back')).tap();
	});
});
