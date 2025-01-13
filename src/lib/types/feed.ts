import { z } from 'zod';
import {
	feedEventSchema,
	getFeedEventsResponseSchema,
	singleFeedListSchema,
	singleFeedSpotSchema,
	valuesToAddEmojiToFeedSchema,
	valuesToDeleteEmojiFromFeedSchema,
} from '../schemas/feed';

export type TypeFeedTabFilter = 'community' | 'following' | 'creator';

export type TypeResponseFeed = z.infer<typeof getFeedEventsResponseSchema>;

export type TypeFeedEvent = z.infer<typeof feedEventSchema>;

export type TypeFeedList = z.infer<typeof singleFeedListSchema>;

export type TypeFeedSpot = z.infer<typeof singleFeedSpotSchema>;

export type TypeValuesToAddEmojiToFeed = z.infer<
	typeof valuesToAddEmojiToFeedSchema
>;

export type TypeValuesToDeleteEmojiToFeed = z.infer<
	typeof valuesToDeleteEmojiFromFeedSchema
>;
