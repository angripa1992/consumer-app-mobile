import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { auth } from '../../../config/firebase';
import { useAppStore } from '../store/store';

import { FEED_ENDPOINTS } from '../utils/routes';

import {
	onErrorOptimisticWhenAddOrRemoveEmojis,
	updateOptimisticWhenAddEmojis,
	updateOptimisticWhenRemoveEmojis,
} from '../helpers/optimistic/optimisticUpdatesForEmojis';
import { postDataWithToken } from '../helpers/postData';
import { deleteDataWithToken } from '../helpers/deleteData';
import { invalidationWhenAddOrRemoveEmojis } from '../helpers/invalidatons/invalidationForEmojis';

import type {
	TypeValuesToAddEmojiToFeed,
	TypeValuesToDeleteEmojiToFeed,
} from '../types/feed';
import type { TypeQueriesMutateDestination } from '../types/queries';

//POST EMOJI TO EVENT
const fetchPostEmojiToEvent = async (
	values: TypeValuesToAddEmojiToFeed,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = FEED_ENDPOINTS.POST_EMOJI_TO_EVENT;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return response;
};

export const usePostEmojiToEvent = (
	queryMutateDestination: TypeQueriesMutateDestination,
	spotId?: number | string,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: TypeValuesToAddEmojiToFeed) => {
			setIsLoading(true);
			return fetchPostEmojiToEvent(values, userInfo);
		},
		onMutate: async (values) => {
			if (!user) return;
			const { event_id, code, slug } = values;

			await updateOptimisticWhenAddEmojis({
				queryMutateDestination,
				currentQueryClient,
				currentUserId: user.id,
				eventId: event_id,
				emojiCode: code,
				slug,
			});
		},
		onError: (err: Error, _, context) => {
			setIsLoading(false);

			if (!user) return;

			onErrorOptimisticWhenAddOrRemoveEmojis({
				queryMutateDestination,
				currentQueryClient,
				context,
				currentUserId: user?.id,
			});
		},
		onSuccess: (data, variables) => {
			if (!user) return;
			const { event_id } = variables;

			invalidationWhenAddOrRemoveEmojis({
				currentQueryClient,
				queryMutateDestination,
				currentUserId: user.id,
				eventId: event_id,
				spotId,
			});

			setIsLoading(false);
		},
	});
};

//POST EMOJI TO EVENT
const fetchDeleteEmojiFromEvent = async (
	values: TypeValuesToDeleteEmojiToFeed,
	userInfo: string,
) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const { event_emoji_id, variations_code_id } = values;
	const endpoint = FEED_ENDPOINTS.DELETE_EMOJI_TO_EVENT(
		event_emoji_id,
		variations_code_id,
	);
	const response = await deleteDataWithToken(endpoint, idToken, userInfo);

	return response;
};

export const useDeleteEmojiFromEvent = (
	queryMutateDestination: TypeQueriesMutateDestination,
	eventId: number,
	spotId?: number | string,
) => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const currentQueryClient = useQueryClient();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	return useMutation({
		mutationFn: (values: TypeValuesToDeleteEmojiToFeed) => {
			setIsLoading(true);
			return fetchDeleteEmojiFromEvent(values, userInfo);
		},
		onMutate: async (values) => {
			if (!user) return;

			await updateOptimisticWhenRemoveEmojis({
				queryMutateDestination,
				currentQueryClient,
				currentUserId: user.id,
				eventId: eventId,
				eventEmojiId: values.event_emoji_id,
			});
		},
		onError: (err: Error, _, context) => {
			setIsLoading(false);

			if (!user) return;

			onErrorOptimisticWhenAddOrRemoveEmojis({
				queryMutateDestination,
				currentQueryClient,
				context,
				currentUserId: user?.id,
			});
		},
		onSuccess: () => {
			if (!user) return;

			invalidationWhenAddOrRemoveEmojis({
				currentQueryClient,
				queryMutateDestination,
				eventId,
				currentUserId: user.id,
				spotId,
			});

			setIsLoading(false);
		},
	});
};
