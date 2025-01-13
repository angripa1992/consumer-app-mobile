import { useCallback, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { auth } from '../../../config/firebase';
import { useAppStore } from '../store/store';

import { FEED_ENDPOINTS } from '../utils/routes';

import { getDataWithToken } from '../helpers/getData';
import { getFeedEventsResponseSchema } from '../schemas/feed';
import { LIMIT_FEED } from '../utils/constants';

import type { AxiosError } from 'axios';

// GET GENERAL FEED
const fetchGetGeneralFeed = async (userInfo: string, offset: number) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return undefined;
	const endpoint = FEED_ENDPOINTS.GET_GENERAL_FEED(LIMIT_FEED, offset);

	const response = await getDataWithToken(
		endpoint,
		idToken,
		userInfo,
		false,
		20000,
	);

	return getFeedEventsResponseSchema.parse(response);
};

export const useGetGeneralFeed = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const [hasNewGeneralEvents, setHasNewGeneralEvents] = useState(false);
	const previousFirstEventIdRef = useRef<number | undefined>(undefined);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['feed', user?.id],
		enabled: !!user?.id && !!userInfo,
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetGeneralFeed(userInfo, pageParam);
		},
		getNextPageParam: (lastPage) => {
			const hasMoreEvents = lastPage?.has_more_events ?? false;
			return hasMoreEvents ? lastPage?.new_offset : undefined;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		retry: true,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		onSuccess: (newData) => {
			const newFirstEventId = newData?.pages[0]?.events[0]?.event_id;
			if (
				previousFirstEventIdRef.current &&
				newFirstEventId &&
				previousFirstEventIdRef.current !== newFirstEventId
			) {
				setHasNewGeneralEvents(true);
			}
			previousFirstEventIdRef.current = newFirstEventId;
		},
	});

	const isErrorGeneralFeed: boolean = Boolean(
		error instanceof Error || (error as AxiosError)?.response?.status === 500,
	);

	const refetchGeneralFeed = useCallback(async () => {
		setHasNewGeneralEvents(false);
		await refetch();
	}, [setHasNewGeneralEvents, refetch]);

	return {
		generalEvents: data?.pages.flatMap((page) => page?.events ?? []),
		isLoadingGeneralFeed: isLoading,
		isErrorGeneralFeed,
		refetchGeneralFeed,
		hasNextPageGeneral: hasNextPage,
		fetchNextPageGeneral: fetchNextPage,
		isFetchingNextPageGeneral: isFetchingNextPage,
		hasNewGeneralEvents: hasNewGeneralEvents,
	};
};

const fetchGetFollowingFeed = async (userInfo: string, offset: number) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const endpoint = FEED_ENDPOINTS.GET_FOLLOWING_FEED(LIMIT_FEED, offset);

	const response = await getDataWithToken(
		endpoint,
		idToken,
		userInfo,
		false,
		20000,
	);

	return getFeedEventsResponseSchema.parse(response);
};

// GET FOLLOWING FEED
export const useGetFollowingFeed = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const [hasNewFollowingEvents, setHasNewFollowingEvents] = useState(false);
	const previousFirstEventIdRef = useRef<number | undefined>(undefined);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['followingFeed', user?.id],
		enabled: !!user?.id && !!userInfo,
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetFollowingFeed(userInfo, pageParam);
		},
		getNextPageParam: (lastPage) => {
			const lastPageLength = lastPage?.has_more_events ?? false;

			if (!lastPageLength) return undefined;
			return lastPage?.new_offset;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		retry: true,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		onSuccess: (newData) => {
			const newFirstEventId = newData?.pages[0]?.events[0]?.event_id;
			if (
				previousFirstEventIdRef.current &&
				newFirstEventId &&
				previousFirstEventIdRef.current !== newFirstEventId
			) {
				setHasNewFollowingEvents(true);
			}
			previousFirstEventIdRef.current = newFirstEventId;
		},
	});

	const isErrorFollowingFeed: boolean = Boolean(
		error instanceof Error || (error as AxiosError)?.response?.status === 500,
	);

	const refetchGeneralFollowing = useCallback(async () => {
		setHasNewFollowingEvents(false);
		await refetch();
	}, [setHasNewFollowingEvents, refetch]);

	return {
		followingEvents: data?.pages.flatMap((page) => page?.events ?? []),
		isLoadingFollowingFeed: isLoading,
		isErrorFollowingFeed,
		hasNextPageFollowing: hasNextPage,
		fetchNextPageFollowing: fetchNextPage,
		isFetchingNextPageFollowing: isFetchingNextPage,
		refetchGeneralFollowing,
		hasNewFollowingEvents,
	};
};

// GET CREATOR FEED

const fetchGetCreatorFeed = async (userInfo: string, offset: number) => {
	const idToken = await auth.currentUser?.getIdToken();

	if (!idToken) return undefined;

	const endpoint = FEED_ENDPOINTS.GET_CREATOR_FEED(LIMIT_FEED, offset);

	const response = await getDataWithToken(
		endpoint,
		idToken,
		userInfo,
		false,
		20000,
	);

	return getFeedEventsResponseSchema.parse(response);
};

export const useGetCreatorFeed = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);
	const [hasNewCreatorEvents, setHasNewCreatorEvents] = useState(false);
	const previousFirstEventIdRef = useRef<number | undefined>(undefined);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const {
		data,
		error,
		isLoading,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['creatorFeed', user?.id],
		enabled: !!user?.id && !!userInfo,
		queryFn: async ({ pageParam = 0 }) => {
			setIsLoading(true);
			return fetchGetCreatorFeed(userInfo, pageParam);
		},
		getNextPageParam: (lastPage) => {
			const lastPageLength = lastPage?.has_more_events ?? false;

			if (!lastPageLength) return undefined;
			return lastPage?.new_offset;
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		retry: true,
		refetchInterval: false,
		refetchIntervalInBackground: false,
		onSuccess: (newData) => {
			const newFirstEventId = newData?.pages[0]?.events[0]?.event_id;
			if (
				previousFirstEventIdRef.current &&
				newFirstEventId &&
				previousFirstEventIdRef.current !== newFirstEventId
			) {
				setHasNewCreatorEvents(true);
			}
			previousFirstEventIdRef.current = newFirstEventId;
		},
	});

	const isErrorCreatorFeed: boolean = Boolean(
		error instanceof Error || (error as AxiosError)?.response?.status === 500,
	);

	const refetchGeneralCreator = useCallback(async () => {
		setHasNewCreatorEvents(false);
		await refetch();
	}, [setHasNewCreatorEvents, refetch]);

	return {
		creatorEvents: data?.pages.flatMap((page) => page?.events ?? []),
		isLoadingCreatorFeed: isLoading,
		isErrorCreatorFeed,
		hasNextPageCreator: hasNextPage,
		fetchNextPageCreator: fetchNextPage,
		isFetchingNextPageCreator: isFetchingNextPage,
		refetchGeneralCreator,
		hasNewCreatorEvents,
	};
};
