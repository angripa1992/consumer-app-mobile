import { z } from 'zod';
import {
	createSpotListSchema,
	updateSpotListSchema,
	spotListSingleResponseSchema,
	spotListSingleWithTags,
	spotListSingleSchema,
	spotListSinglePageResponseSchema,
	addSpotFromDBToSpotListSchema,
	spotListSinglePageSchema,
	relevantSpotListSchema,
	spotListUserHomeSchema,
	spotListUserHomeCategoriesSchema,
	postSingleListDataResponse,
	addSpotFromGooglePlacesToSpotListSchema,
	spotListDataEvent,
	spotListsHomeResponseSchema,
	getGeneralFeaturedListsFromSpotResponseSchema,
	getFollowingFeaturedListsFromSpotResponseSchema,
} from '../schemas/spotList';
import { viewMoreHomeResponseSchema } from '../schemas/viewMore';
import { userListsResponseSchema } from '../schemas/user';

import type { TypeSpotCandidateToSave } from './spot';
import type { TypeSpotListFromDiscovery } from './discovery';
import type { TypeFeedList } from './feed';

export type TypeCreateSpotList = z.infer<typeof createSpotListSchema>;
export type TypeUpdateSpotList = z.infer<typeof updateSpotListSchema>;

export type TypeResponseSpotListSingle = z.infer<
	typeof spotListSingleResponseSchema
>;

export type TypeResponseSpotListSinglePage = z.infer<
	typeof spotListSinglePageResponseSchema
>;

export type TypeResponseUserListsSchema = z.infer<
	typeof userListsResponseSchema
>;

export type TypeResponseSpotListsHome = z.infer<
	typeof spotListsHomeResponseSchema
>;

export type TypeResponseViewMoreHomeResponse = z.infer<
	typeof viewMoreHomeResponseSchema
>;

export type TypeSpotListSinglePage = z.infer<typeof spotListSinglePageSchema>;

export type TypeSpotListWithTag = z.infer<typeof spotListSingleWithTags>;
export type TypeSpotListSingle = z.infer<typeof spotListSingleSchema>;

export type TypeAddSpotFromDBToSpotList = z.infer<
	typeof addSpotFromDBToSpotListSchema
>;
export type TypeAddSpotFromGooglePlacesToSpotList = z.infer<
	typeof addSpotFromGooglePlacesToSpotListSchema
>;
export type TypeAddSpotToSpotList =
	| TypeAddSpotFromDBToSpotList
	| TypeAddSpotFromGooglePlacesToSpotList;

export type TypeOrderList = {
	id: number;
	order: number;
};

export type TypeReorderSpotListValuesToSend = {
	update_order: TypeOrderList[] | undefined;
};

export type TypeRelevantList = z.infer<typeof relevantSpotListSchema>;

export type TypeUserHomeCategories = z.infer<
	typeof spotListUserHomeCategoriesSchema
>;
export type TypeSpotListUserHomeSchema = z.infer<typeof spotListUserHomeSchema>;

export type TypePostSpotListResponseSchema = z.infer<
	typeof postSingleListDataResponse
>;

export type TypeSpotListDataEvent = z.infer<typeof spotListDataEvent>;

export type TypeSpotListForOptimisticUpdate =
	| TypeSpotListUserHomeSchema
	| TypeSpotListSinglePage
	| TypeSpotListFromDiscovery
	| TypeFeedList;

export type TypeCreateSpotListWithoutSpot = {
	spotType?: undefined;
	spotName?: undefined;
};

export type TypeCreateSpotWithSpotFromDB = {
	prevSpotIdToAdd: number;
	spotType: 'db';
	spotName: string;
};

export type TypeCreateSpotWithSpotFromTripAdvisor = {
	prevCandidateData: TypeSpotCandidateToSave;
	spotType: 'googlePlace';
	spotName: string;
};

export type TypeCreateSpotListScreen =
	| TypeCreateSpotListWithoutSpot
	| TypeCreateSpotWithSpotFromDB
	| TypeCreateSpotWithSpotFromTripAdvisor;

export type TypeResponseFeaturedLists = z.infer<
	typeof getGeneralFeaturedListsFromSpotResponseSchema
>;

export type TypeResponseFollowingFeaturedLists = z.infer<
	typeof getFollowingFeaturedListsFromSpotResponseSchema
>;
