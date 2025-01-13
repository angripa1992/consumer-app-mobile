import { z } from 'zod';
import {
	followedSpotSchema,
	userSpotListSchema,
	spotSingleFromAllSpotsSchema,
	spotSearchCandidateSchema,
	spotSingleToUserPageSchema,
	getDetailsSpotCandidateSchema,
	getAllAvailableSpotsSchema,
	spotSingleToSpotListSchema,
	weekdayTextSchema,
	orderSchema,
	getCandidateSpotsResponseSchema,
	userSpotSchema,
	spotStatusTagsEnum,
	spotCandidateToSaveSchema,
	addStatusTagFromDBSchema,
	addStatusTagFromGooglePlacesSchema,
	addSpotToSpotListEventSchema,
	addStatusTagsEventSchema,
	spotImageValuesToSendSchema,
	statusTagsSchema,
	spotSingleToUserPageResponseSchema,
	getDetailsSpotCandidateResponseSchema,
	getAllUserSpotSchemaResponse,
	getAllAvailableSpotsResponseSchema,
	createBasicSpotFormSchema,
	authorizedSpotValuesToSendSchema,
	spotImagesAvailableSchema,
	likesForSpotSchema,
	getGeneralLikesForSpotResponseSchema,
	getFollowingLikesForSpotResponseSchema,
	imageSizeEnum,
	hasRelationshipSpotAndListRequestBody,
} from '../schemas/spot';

import { featuredSpotListInSpotSchema } from '../schemas/viewMore';
import { spotsFromSpotListSinglePageSchema } from '../schemas/spotList';
import { getSpotsNearbyResponseSchema } from '../schemas/discovery';

import type {
	UseMutateAsyncFunction,
	UseMutationResult,
} from '@tanstack/react-query';

import type {
	TypePopularSpotsFromDiscovery,
	TypeSpotFromDiscovery,
	TypeSpotNearby,
} from './discovery';
import type { TypeFeedSpot } from './feed';
import type { TypeAddSpotToSpotList } from './spotList';

export type TypeSpot = z.infer<typeof userSpotListSchema>;

export type TypeFollowedSpot = z.infer<typeof followedSpotSchema>;

export type TypeFeaturedSpotListInSpot = z.infer<
	typeof featuredSpotListInSpotSchema
>;

export type TypeSpotSingleFromAllSpot = z.infer<
	typeof spotSingleFromAllSpotsSchema
>;

export type TypeSpotSearchCandidate = z.infer<typeof spotSearchCandidateSchema>;

export type TypeSpotCandidateToSave = z.infer<typeof spotCandidateToSaveSchema>;

export type TypeResponseSpotsFromSpotList = z.infer<
	typeof spotsFromSpotListSinglePageSchema
>;

export type TypePostSearchCandidate = {
	name: string;
	all_cities?: string;
	city_name?: string;
	spot_list_id: number;
};

export type TypeSpotSingleToUserPage = z.infer<
	typeof spotSingleToUserPageSchema
>;

export type TypeDetailsSpotCandidate = z.infer<
	typeof getDetailsSpotCandidateSchema
>;

export type TypeAllAvailableSpots = z.infer<typeof getAllAvailableSpotsSchema>;

export type TypeSpotSingleToSpotList = z.infer<
	typeof spotSingleToSpotListSchema
>;

export type TypeAddStatusTagsFromDB = z.infer<typeof addStatusTagFromDBSchema>;
export type TypeAddStatusTagsFromGooglePlaces = z.infer<
	typeof addStatusTagFromGooglePlacesSchema
>;

export type TypeAddStatusTagsToSpot =
	| TypeAddStatusTagsFromDB
	| TypeAddStatusTagsFromGooglePlaces;

export type TypeOrderFromSpot = z.infer<typeof orderSchema>;

export type TypeWeekdayText = z.infer<typeof weekdayTextSchema>;

export type TypeGetCandidateSpotsResponse = z.infer<
	typeof getCandidateSpotsResponseSchema
>;

export type TypePostSearchCandidateMutation = UseMutationResult<
	TypeGetCandidateSpotsResponse | null,
	Error,
	TypePostSearchCandidate,
	unknown
>;

export type TypeAddSpotToSpotListMutation = UseMutateAsyncFunction<
	any,
	unknown,
	TypeAddSpotToSpotList
>;

export type TypeUserSpot = z.infer<typeof userSpotSchema>;

export type TypeSpotStatusTagsEnum = z.infer<typeof spotStatusTagsEnum>;

export type TypeAddSpotToSpotListEvent = z.infer<
	typeof addSpotToSpotListEventSchema
>;

export type TypeAddStatusTagsEvent = z.infer<typeof addStatusTagsEventSchema>;

export type TypeSpotImageValuesToSend = z.infer<
	typeof spotImageValuesToSendSchema
>;

export type TypeSpotImageSizeEnum = z.infer<typeof imageSizeEnum>;

export type TypeSpotImageValues = {
	tripAdvisorLocationId?: number | null;
	spotGooglePlacesId?: string | null;
	googleImageName?: string | null;
	imageSize: TypeSpotImageSizeEnum;
};

export type TypeStatusTagsSchema = z.infer<typeof statusTagsSchema>;

export type TypeResponseSpotSingleResponseSchema = z.infer<
	typeof spotSingleToUserPageResponseSchema
>;

export type TypeResponseDetailsSpotCandidate = z.infer<
	typeof getDetailsSpotCandidateResponseSchema
>;

export type TypeResponseAllUserSpotSchemaResponse = z.infer<
	typeof getAllUserSpotSchemaResponse
>;

export type TypeResponseSpotsNearbyResponseSchema = z.infer<
	typeof getSpotsNearbyResponseSchema
>;

export type TypeResponseAllAvailableSpotsResponseSchema = z.infer<
	typeof getAllAvailableSpotsResponseSchema
>;

export type TypeCreateBasicSpotForm = z.infer<typeof createBasicSpotFormSchema>;

export type TypeOpeningHoursOption = 'none' | 'weekdays' | 'weekend' | 'custom';

export type TypeAuthorizedSpotValuesToSend = z.infer<
	typeof authorizedSpotValuesToSendSchema
>;

export type TypeSpotForOptimisticUpdate =
	| TypeDetailsSpotCandidate
	| TypeUserSpot
	| TypeSpotSingleToSpotList
	| TypePopularSpotsFromDiscovery
	| TypeSpotFromDiscovery
	| TypeSpotNearby
	| TypeSpotSearchCandidate
	| TypeFeedSpot
	| TypeAllAvailableSpots;

export type TypeSpotInteractionsTitle = 'likes' | 'scribbles' | 'lists';

export type TypeSpotInteractionsDataToShow = {
	title: TypeSpotInteractionsTitle;
	count: number;
};

// types for spot candidate card

type TypeSpotFromDb = {
	id: number;
	googlePlaceLocationId: string | null;
	name: string;
	spotLikeCounter?: number;
	spotScribblesCount?: number;
	spotType: 'db';
};

type TypeSpotFromTripAdvisor = {
	id: number | null;
	address: string;
	city: string;
	country: string;
	name: string;
	googlePlaceLocationId: string;
	state: string | null;
	spotType: 'googlePlaces';
};

type TypeSpotFromSearchSpots = (TypeSpotFromDb | TypeSpotFromTripAdvisor) & {
	spotListId: number;
	relationshipWithSpotList: boolean;
	screen: 'searchSpots';
	spotSpotListId: number | null;
};

type TypeSpotFromNotSearchSpots = (TypeSpotFromDb | TypeSpotFromTripAdvisor) & {
	screen: 'notSearchSpots';
};

export type TypeSpotCandidateCard =
	| TypeSpotFromSearchSpots
	| TypeSpotFromNotSearchSpots;

export type TypeSpotImagesAvailable = z.infer<typeof spotImagesAvailableSchema>;

export type TypeGetLikesForSpotResponse = z.infer<
	typeof getGeneralLikesForSpotResponseSchema
>;

export type TypeGetFollowingLikesForSpotResponse = z.infer<
	typeof getFollowingLikesForSpotResponseSchema
>;

export type TypeLikeForSpotSchema = z.infer<typeof likesForSpotSchema>;

export type TypeHasRelationshipSpotAndListRequestBody = z.infer<
	typeof hasRelationshipSpotAndListRequestBody
>;
