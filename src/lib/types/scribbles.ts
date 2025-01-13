import { z } from 'zod';
import {
	getGeneralScribblesForSpotResponseSchema,
	getFollowingScribblesForSpotResponseSchema,
	getScribblesRecommendationsResponseSchema,
	addOrEditScribbleFormValuesSchema,
	addOrEditScribbleValuesSchema,
	scribbleSchema,
	singleScribbleWithSpotInfoSchema
} from '../schemas/scribbles';
import { singleFeedScribbleSchema } from '../schemas/feed';

export type TypeAddOrEditScribbleFormValues = z.infer<
	typeof addOrEditScribbleFormValuesSchema
>;

export type TypeGetScribblesForSpotResponse = z.infer<
	typeof getGeneralScribblesForSpotResponseSchema
>;

export type TypeGetFollowingScribblesForSpotResponse = z.infer<
	typeof getFollowingScribblesForSpotResponseSchema
>;

export type TypeAddOrEditScribbleValues = z.infer<
	typeof addOrEditScribbleValuesSchema
>;

export type TypeScribble = z.infer<typeof scribbleSchema>;

export type TypeGetScribblesRecommendationsResponse = z.infer<
	typeof getScribblesRecommendationsResponseSchema
>;

export type TypeScribbleFeed = z.infer<typeof singleFeedScribbleSchema>;

export type TypeScribbleOptionFilter = 'all' | 'negatives' | 'positives';

export type TypeGetAllUserScribblesParams = {
	userId: number;
	scribbleOption: TypeScribbleOptionFilter;
	city?: string
}

export type TypeScribbleWithSpotInfo = z.infer<typeof singleScribbleWithSpotInfoSchema>;