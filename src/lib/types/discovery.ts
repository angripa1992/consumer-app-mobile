import { z } from 'zod';
import {
	categoriesDiscoverySchema,
	discoveriesSchema,
	discoveryFilterFormSchema,
	personDiscoverySchema,
	popularSpotDiscoverySchema,
	postDiscoveryCategoriesResponseSchema,
	postDiscoveryListsResponseSchema,
	postDiscoveryPeopleSchema,
	postDiscoveryResultsResponseSchema,
	postDiscoverySpotsResponseSchema,
	spotDiscoverySchema,
	spotListDiscoverySchema,
	spotNearbySchema,
} from '../schemas/discovery';
import { viewMoreCategories, viewMorePopularLists } from '../schemas/viewMore';

import type { TypeQueriesMutateDestination } from './queries';

export type TypeDiscoveryTabOption =
	| 'all'
	| 'user'
	| 'spot'
	| 'spotList'
	| 'categories';

export type TypeDiscoveryFilterFormSchema = z.infer<
	typeof discoveryFilterFormSchema
>;

export type TypePostSearchDiscovery = {
	search_content: string;
};

export type TypePostSpotsNearby = {
	city: string | null;
	latitude: string | null;
	longitude: string | null;
};

export type TypeDiscoveryResponse = z.infer<
	typeof postDiscoveryResultsResponseSchema
>;
export type TypeDiscoverySpotsResponse = z.infer<
	typeof postDiscoverySpotsResponseSchema
>;

export type TypeDiscoveryResults = z.infer<typeof discoveriesSchema>;
export type TypeDiscoveryCategoriesResults = z.infer<
	typeof categoriesDiscoverySchema
>;
export type TypeSpotListFromDiscovery = z.infer<typeof spotListDiscoverySchema>;
export type TypeSpotFromDiscovery = z.infer<typeof spotDiscoverySchema>;
export type TypePopularSpotsFromDiscovery = z.infer<
	typeof popularSpotDiscoverySchema
>;
export type TypeSpotNearby = z.infer<typeof spotNearbySchema>;
export type TypePersonFromDiscovery = z.infer<typeof personDiscoverySchema>;

export type TypeDiscoveryViewMoreCategoriesListsResponse = z.infer<
	typeof viewMoreCategories
>;
export type TypeDiscoveryViewMorePopularListsResponse = z.infer<
	typeof viewMorePopularLists
>;

export type TypeDiscoveryCategoriesResponseSchema = z.infer<
	typeof postDiscoveryCategoriesResponseSchema
>;

export type TypeDiscoveryListsResponseSchema = z.infer<
	typeof postDiscoveryListsResponseSchema
>;

export type TypeDiscoveryCard<T> = {
	item: T;
	index: number;
	containerStyles?: string;
};

export type TypeDiscoveryCardWithCategory<T> = TypeDiscoveryCard<T> & {
	categoryName: string;
};

export type TypeDiscoveryPersonCard =
	TypeDiscoveryCardWithCategory<TypePersonFromDiscovery> & {
		queryMutateDestination: TypeQueriesMutateDestination;
		isSmallVariant?: boolean;
	};

export type TypePopularSpotCard =
	TypeDiscoveryCard<TypePopularSpotsFromDiscovery>;

export type TypeSpotFromDiscoveryCard =
	TypeDiscoveryCard<TypeSpotFromDiscovery> & {
		queryMutateDestination: 'spotDiscovery' | 'allSpotDiscovery';
		isFlashList?: boolean;
	};

export type TypeSpotListFromDiscoveryCard =
	TypeDiscoveryCardWithCategory<TypeSpotListFromDiscovery> & {
		queryMutateDestination: TypeQueriesMutateDestination;
		isHorizontal?: boolean;
	};

export type TypeViewMoreDataForHome = {
	type: 'home';
	categoryName: string;
};

export type TypeViewMoreDataForFeaturedLists = {
	type: 'featuredLists';
	spotId: number;
};

export type TypeViewMoreDataForUserSpots = {
	type: 'userSpots';
	userId: number;
	categoryName: string;
};

export type TypeViewMoreDataForPopularLists = {
	type: 'popularLists';
	querySearch: string;
};

export type TypeViewMoreDataForPopularPeople = {
	type: 'popularPeople';
	querySearch: string;
};

export type TypeViewMoreDataForPopularSpots = {
	type: 'popularSpots';
	querySearch: string;
};

export type TypeViewMoreDataForSearchSpots = {
	type: 'searchSpots';
	querySearch: string;
	area: string;
};

export type TypeViewMoreDataForCategories = {
	type: 'categories';
	categoryName: string;
	querySearch: string;
};

export type TypeViewMoreDataForSpotsNearby = {
	type: 'spotsNearby';
	latitude: string;
	longitude: string;
};

export type TypeViewMoreData =
	| TypeViewMoreDataForHome
	| TypeViewMoreDataForFeaturedLists
	| TypeViewMoreDataForUserSpots
	| TypeViewMoreDataForPopularLists
	| TypeViewMoreDataForPopularPeople
	| TypeViewMoreDataForPopularSpots
	| TypeViewMoreDataForCategories
	| TypeViewMoreDataForSpotsNearby
	| TypeViewMoreDataForSearchSpots;

export type TypeViewMoreScreen = {
	city: string;
	title: string;
} & TypeViewMoreData;

export type TypeDiscoveryPeopleResponse = z.infer<
	typeof postDiscoveryPeopleSchema
>;
