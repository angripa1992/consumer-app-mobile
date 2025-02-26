import { auth } from 'config/firebase';
import {
	postPlayPeopleSchema,
    TypePostSearchPeople,
} from '../schemas/play';
import { PLAY_ENDPOINTS } from '../utils/routes';
import { LIMIT_PEOPLE } from '../utils/constants';
import { postDataWithToken } from '../helpers/postData';
import { useAppStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/react-native';

// POST PEOPLE FROM PLAY
export const fetchPostPlayPeople = async (
    userInfo: string,
    offset: number,
    values: TypePostSearchPeople,
) => {
    const idToken = await auth.currentUser?.getIdToken();

    if (!idToken) return null;

    const endpoint = PLAY_ENDPOINTS.POST_PEOPLE(LIMIT_PEOPLE, offset);
    const response = await postDataWithToken(endpoint, values, idToken, userInfo);

    return postPlayPeopleSchema.parse(response);
};
export const usePostPlayPeople = (values: TypePostSearchPeople) => {
    const { setIsLoading, user } = useAppStore(
        useShallow((state) => ({
            setIsLoading: state.setIsLoading,
            user: state.user,
        })),
    );
    const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
    const {
        data,
        isError,
        error,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['playPeople', values.search_content],
        queryFn: async ({ pageParam }) => {
            setIsLoading(true);
            return fetchPostPlayPeople(userInfo, pageParam ?? 0, values);
        },
        getNextPageParam: (lastPage, allPages) => {
            const lastPageLength = lastPage?.peoples?.length ?? 0;
            if (lastPageLength < LIMIT_PEOPLE) return undefined;
            return allPages.flatMap((page) => page?.peoples ?? []).length;
        },
        onError: (err) => {
            setIsLoading(false);
            if (err instanceof ZodError) {
                Sentry.captureException(err);
            }
            console.error(err);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    return {
        playPeople: data?.pages.flatMap((page) => page?.peoples ?? []),
        isLoadingPlayPeople: isLoading,
        isErrorPlayPeople: isError,
        errorPlayPeople: error,
        hasNextPagePlayPeople: hasNextPage,
        fetchNextPagePlayPeople: fetchNextPage,
        isFetchingNextPagePlayPeople: isFetchingNextPage,
        refetchPlayPeople: refetch,
    };
};