import { TypeSpotListDataEvent } from './spotList';
import { TypeUserDataEvent } from './user';

export type TypeQueriesMutateDestination =
	| 'home'
	| 'featuredLists'
	| 'followingFeaturedLists'
	| 'followingLists'
	| 'userSpots'
	| 'viewMorePopularLists'
	| 'viewMorePopularPeople'
	| 'viewMorePopularSpots'
	| 'viewMoreCategories'
	| 'viewMoreSpotsNearby'
	| 'viewMoreUserSpots'
	| 'viewMoreHome'
	| 'spotsNearby'
	| 'user'
	| 'followingUsers'
	| 'followersUsers'
	| 'peopleDiscovery'
	| 'popularPeopleDiscovery'
	| 'spotList'
	| 'spotListDiscovery'
	| 'popularSpotListDiscovery'
	| 'categorySpotListDiscovery'
	| 'spot'
	| 'popularSpotDiscovery'
	| 'spotDiscovery'
	| 'allSpotDiscovery'
	| 'searchSpotsAvailable'
	| 'searchSpotsCandidate'
	| 'feed'
	| 'followingFeed'
	| 'creatorFeed'
	| 'scribbles'
	| 'followingScribbles'
	| 'likesForSpot'
	| 'followingLikesForSpot'
	| 'userScribbles';

export interface UseUpdateFollowSpotListQuery {
	queryMutateDestination: TypeQueriesMutateDestination;
	dataListEvent: TypeSpotListDataEvent;
	spotListId: number;
	spotId?: number;
	categoryName?: string;
	searchQuery?: string;
	currentCity?: string;
	currentUserId?: number;
}

export interface UseUpdateFollowUserQuery {
	queryMutateDestination: TypeQueriesMutateDestination;
	dataUserEvent: TypeUserDataEvent;
	followUserId: number;
	currentUserId?: number;
	searchQuery?: string;
	currentCity?: string;
	categoryName?: string;
}

export interface UseUpdateStatusTagsInSingleSpot {
	queryMutateDestination: TypeQueriesMutateDestination;
	isCandidateSpot?: boolean;
	spotId: number | string;
	spotListId?: number;
	userId?: number | null;
	categoryName?: string;
	searchQuery?: string;
	currentCity?: string | null;
	isOwner?: boolean;
	googlePlaceLocationId?: string;
	currentArea?: string;
}

export interface UsePostSpotToSpotList {
	queryMutateDestination: TypeQueriesMutateDestination;
	spotId?: number | string | null;
	searchQuery?: string;
	isCandidateSpot?: boolean;
	currentCity?: string | null;
	userId?: number | null;
	googlePlaceLocationId?: string;
}

export interface UseDeleteSpotFromList {
	queryMutateDestination: TypeQueriesMutateDestination;
	spotSpotListId?: number | null;
	spotListId?: number;
	searchQuery?: string;
	currentCity?: string | null;
	userId?: number | null;
	spotId?: number | string;
	googlePlaceLocationId?: string;
}
