import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';

import { extractTranslationsFromFeed } from '@/lib/helpers/feed/extractTranslationsFromFeed';
import { i18nInstance } from 'config/i18n';

import FeedListCard from './cards/FeedListCard';
import FeedSpotCard from './cards/FeedSpotCard';

import FeedScribbleCard from './cards/FeedScribbleCard';
import FeedGeneralEvents from './FeedGeneralEvents';
import FeedFollowingEvents from './FeedFollowingEvents';
import FeedCreatorEvents from './FeedCreatorEvents';

import type { TypeFeedEvent, TypeFeedTabFilter } from '@/lib/types/feed';
import type {
	AppStackNavigationProp,
	AppStackParamList,
} from '@/lib/types/tabScreenParams';
import type { ListRenderItemInfo } from '@shopify/flash-list';

type TypeFeedCardsRenderProps = {
	feedFilterValue: TypeFeedTabFilter;
};

const FeedCardsRender = React.memo(
	({ feedFilterValue }: TypeFeedCardsRenderProps) => {
		const navigation = useNavigation<AppStackNavigationProp>();

		const handleRedirect = useCallback(
			(route: keyof AppStackParamList, params: object) => {
				navigation.navigate(route, params as never);
			},
			[navigation],
		);

		const handleEventMessage = useCallback(
			(creatorName: string, eventMessage: string, timeUpdated: string) => {
				return `${creatorName} ${i18nInstance.t(
					extractTranslationsFromFeed(eventMessage),
				)} · ${timeUpdated}`;
			},
			[],
		);

		const renderCard = useCallback(
			(singleEvent: TypeFeedEvent, index: number) => {
				const isFirstItem = index === 0;
				const eventType = singleEvent.event_type;
				const eventMessage =
					'event_message' in singleEvent ? singleEvent.event_message : '';
				const commonProps = {
					eventId: singleEvent.event_id,
					userImageUrl: singleEvent.creator_image,
					eventMessage: handleEventMessage(
						singleEvent.creator_name,
						eventMessage,
						singleEvent.time_event_update,
					),
					emojis: singleEvent.emojis,
					tarotColors: singleEvent.tarot_color,
					feedFilterValue,
					testID: `feed-card-${index}`,
					handleRedirectProfile: (userId: number) =>
						handleRedirect('ProfileScreen', { userId }),
				};

				switch (eventType) {
					case 'following_spotList':
					case 'spotList':
						return (
							<FeedListCard
								{...commonProps}
								tags={singleEvent.tags}
								listName={singleEvent?.name}
								isLikeList={singleEvent.is_following_spot_list}
								listId={singleEvent.id}
								listLikeCounter={singleEvent.followers_counter}
								listCreator={singleEvent.creator_name}
								listCreatorId={singleEvent.list_creator_id}
								handleRedirectList={(listId: number) =>
									handleRedirect('SingleList', { spotListId: listId })
								}
								userCreatorId={singleEvent.user_id}
							/>
						);

					case 'spot': {
						return (
							<FeedSpotCard
								{...commonProps}
								spotImageUrl={singleEvent.spot_image}
								smallImageUrl={singleEvent.small_image}
								spotName={singleEvent.name}
								location={`${singleEvent.city}, ${singleEvent.country}`}
								spotLikeCounter={singleEvent.spot_like_counter}
								isLikeSpot={singleEvent.is_like_spot}
								isSavedSpot={singleEvent.is_saved}
								spotId={singleEvent.id}
								handleRedirectSpot={(spotId: number) =>
									handleRedirect('SingleSpot', { spotId })
								}
								userCreatorId={singleEvent.user_id}
								googlePlaceLocationId={singleEvent.google_place_location_id}
								tripAdvisorLocationId={singleEvent.tripadvisor_location_id}
								isFirstItem={isFirstItem}
							/>
						);
					}
					case 'spot_scribble_added': {
						return (
							<FeedScribbleCard
								{...commonProps}
								creatorName={singleEvent.creator_name}
								scribbleId={singleEvent.id}
								spotId={singleEvent.spot_id}
								username={singleEvent.creator_username}
								reviewDescription={singleEvent.review_description}
								spotName={singleEvent.spot_name}
								isPositive={singleEvent.is_positive}
								visitedDate={singleEvent.visit_date || ''}
								profilePictureUrl={singleEvent.creator_image}
								handleRedirectSpot={(spotId: number) =>
									handleRedirect('SingleSpot', { spotId })
								}
								creatorId={singleEvent.creator_user_id}
								scribbleImages={singleEvent.scribble_images}
							/>
						);
					}
					default:
						return null;
				}
			},
			[feedFilterValue, handleEventMessage, handleRedirect],
		);

		const renderItem = useCallback(
			({ item: event, index }: ListRenderItemInfo<TypeFeedEvent>) =>
				renderCard(event, index),
			[renderCard],
		);

		if (feedFilterValue === 'community') {
			return <FeedGeneralEvents renderItem={renderItem} />;
		}

		if (feedFilterValue === 'creator') {
			return <FeedCreatorEvents renderItem={renderItem} />;
		}

		return <FeedFollowingEvents renderItem={renderItem} />;
	},
);

export default FeedCardsRender;
