import { z } from 'zod';
import {
	spotListViewMoreHomeSchema,
	spotUserViewMoreSchema,
	viewMorePopularPeople,
	viewMorePopularSpots,
	viewMoreUserSpotsResponseSchema,
} from '../schemas/viewMore';

export type TypeSpotListViewMoreHome = z.infer<
	typeof spotListViewMoreHomeSchema
>;

export type TypeSpotUserViewMore = z.infer<typeof spotUserViewMoreSchema>;

export type TypeResponseViewMorePopularPeople = z.infer<
	typeof viewMorePopularPeople
>;

export type TypeResponseViewMorePopularSpotsFromDiscovery = z.infer<
	typeof viewMorePopularSpots
>;

export type TypeResponseViewMoreUserSpotsResponseSchema = z.infer<
	typeof viewMoreUserSpotsResponseSchema
>;
