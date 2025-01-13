export const extractTranslationsFromFeed = (feedEventMessage: string) => {
	const containsCreated = feedEventMessage.includes('created');
	const containsList = feedEventMessage.includes('list');
	const containsSpot = feedEventMessage.includes('spot');
	const containsLiked = feedEventMessage.includes('liked');
	const containsVisited = feedEventMessage.includes('visited');
	const containsSaved = feedEventMessage.includes('saved');

	if (containsCreated && containsList) {
		return 'createdList';
	}
	if (containsLiked && containsList) {
		return 'likedList';
	}
	if (containsLiked && containsVisited && containsSpot) {
		return 'visitedAndLikedSpot';
	}
	if (containsVisited && containsSpot) {
		return 'visitedSpot';
	}
	if (containsLiked && containsSpot) {
		return 'likedSpot';
	}
	if (containsLiked && containsSaved && containsSpot) {
		return 'likedAndSavedSpot';
	}
	if (containsLiked && containsSaved && containsVisited && containsSpot) {
		return 'likedSavedAndVisitedSpot';
	}
	if (containsSaved && containsSpot) {
		return 'savedSpot';
	}
	if (containsSaved && containsVisited && containsSpot) {
		return 'savedAndVisitedSpot';
	}

	return '';
};
