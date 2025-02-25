import { DISCOVERY_ENDPOINTS } from "../utils/routes";
import { postDataWithToken } from "../helpers/postData";
import { useAppStore } from "../store/store";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";

import type {
  TypePostSearchDiscovery,
  TypePostSpotsNearby,
} from "../types/discovery";
import {
  getSpotsNearbyResponseSchema,
  postDiscoveryCategoriesResponseSchema,
  postDiscoveryListsResponseSchema,
  postDiscoveryPeopleSchema,
  postDiscoveryResultsResponseSchema,
  postDiscoverySpotsResponseSchema,
} from "../schemas/discovery";
import { auth } from "../../../config/firebase";
import { AxiosError } from "axios";
import { ZodError } from "zod";
import { useShallow } from "zustand/react/shallow";
import { LIMIT_DISCOVERY, LIMIT_DISCOVERY_SPOTS } from "../utils/constants";

// POST SEARCH DISCOVERY
const fetchPostSearchDiscovery = async (
  city: string | null,
  offset: number,
  values: TypePostSearchDiscovery,
  userInfo: string
) => {
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken || !city) return undefined;

  const endpoint = DISCOVERY_ENDPOINTS.POST_SEARCH(
    city,
    LIMIT_DISCOVERY,
    offset
  );
  const response = await postDataWithToken(endpoint, values, idToken, userInfo);

  return postDiscoveryResultsResponseSchema.parse(response);
};
export const usePostSearchDiscovery = (
  city: string | null,
  values: TypePostSearchDiscovery
) => {
  const { setIsLoading, user, setIsErrorScreen } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
      setIsErrorScreen: state.setIsErrorScreen,
    }))
  );

  const { search_content } = values;
  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["postSearchDiscovery", search_content, city],
    queryFn: async ({ pageParam }) => {
      setIsLoading(true);
      return fetchPostSearchDiscovery(city, pageParam, values, userInfo);
    },
    onError: (err: any) => {
      setIsLoading(false);
      setIsErrorScreen(true);

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
    discoveryResults: data?.discoveries,
    isError,
    error,
    isLoading,
    refetch,
  };
};

// POST SPOTS FROM DISCOVERY
export const fetchPostDiscoverySpots = async (
  userInfo: string,
  city: string | null,
  areas: string,
  values: TypePostSearchDiscovery,
  offset: number
) => {
  const idToken = await auth.currentUser?.getIdToken();
  if (!idToken || !city) return null;

  const searchLocation = areas || city;
  
  const endpoint = DISCOVERY_ENDPOINTS.POST_SPOTS(
    city,
    searchLocation,
    LIMIT_DISCOVERY_SPOTS,
    offset
  );
  const response = await postDataWithToken(endpoint, values, idToken, userInfo);

  return postDiscoverySpotsResponseSchema.parse(response);
};
export const usePostDiscoverySpots = (
  city: string | null,
  areas: string,
  values: TypePostSearchDiscovery
) => {
  const { setIsLoading, user } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
    }))
  );

  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";
  const { search_content } = values;

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["spotsDiscovery", search_content, city, areas],
    queryFn: () => {
      setIsLoading(isLoading);
      return fetchPostDiscoverySpots(userInfo, city, areas, values, 0);
    },
    onSuccess: (data) => {
      setIsLoading(false);
    },
    onError: (err: AxiosError) => {
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
    discoverySpots: data?.spots,
    discoverySpotsMessage: data?.message,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// POST SPOTS FROM DISCOVERY WITH INFINITE SCROLL

export const usePostDiscoverySpotsWithInfiniteScroll = (
  city: string | null,
  areas: string,
  values: TypePostSearchDiscovery
) => {
  const { setIsLoading, user } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
    }))
  );

  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";
  const { search_content } = values;

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
    queryKey: ["allSpotsDiscovery", search_content, city, areas],
    queryFn: async ({ pageParam }) => {
      setIsLoading(isLoading);
      return fetchPostDiscoverySpots(userInfo, city, areas, values, pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      const isLastPage = lastPage?.api_spots ?? false;

      if (isLastPage) return undefined;
      return allPages.flatMap((page) => page?.spots ?? []).length;
    },
    onSuccess: (data) => {
      setIsLoading(false);
    },
    onError: (err: AxiosError) => {
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
    allDiscoverySpots: data?.pages.flatMap((page) => page?.spots ?? []),
    fetchNextPageAllDiscoverySpots: fetchNextPage,
    hasNextPageAllDiscoverySpots: hasNextPage,
    isFetchingNextPageAllDiscoverySpots: isFetchingNextPage,
    isLoadingAllDiscoverySpots: isLoading,
    refetchAllDiscoverySpots: refetch,
  };
};

// POST PEOPLE FROM DISCOVERY
export const fetchPostDiscoveryPeople = async (
  userInfo: string,
  offset: number,
  values: TypePostSearchDiscovery
) => {
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken) return null;

  const endpoint = DISCOVERY_ENDPOINTS.POST_PEOPLE(LIMIT_DISCOVERY, offset);
  const response = await postDataWithToken(endpoint, values, idToken, userInfo);

  return postDiscoveryPeopleSchema.parse(response);
};
export const usePostDiscoveryPeople = (values: TypePostSearchDiscovery) => {
  const { setIsLoading, user } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
    }))
  );
  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";
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
    queryKey: ["discoveryPeople", values.search_content],
    queryFn: async ({ pageParam }) => {
      setIsLoading(true);
      return fetchPostDiscoveryPeople(userInfo, pageParam ?? 0, values);
    },
    getNextPageParam: (lastPage, allPages) => {
      const lastPageLength = lastPage?.peoples?.length ?? 0;
      if (lastPageLength < LIMIT_DISCOVERY) return undefined;
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
    discoveryPeople: data?.pages.flatMap((page) => page?.peoples ?? []),
    isLoadingDiscoveryPeople: isLoading,
    isErrorDiscoveryPeople: isError,
    errorDiscoveryPeople: error,
    hasNextPageDiscoveryPeople: hasNextPage,
    fetchNextPageDiscoveryPeople: fetchNextPage,
    isFetchingNextPageDiscoveryPeople: isFetchingNextPage,
    refetchDiscoveryPeople: refetch,
  };
};

// POST LIST FROM DISCOVERY
export const fetchPostDiscoveryLists = async (
  city: string | null,
  offset: number,
  values: TypePostSearchDiscovery,
  userInfo: string
) => {
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken || !city) return undefined;

  const endpoint = DISCOVERY_ENDPOINTS.POST_LISTS(
    city,
    LIMIT_DISCOVERY,
    offset
  );
  const response = await postDataWithToken(endpoint, values, idToken, userInfo);

  return postDiscoveryListsResponseSchema.parse(response);
};
export const usePostDiscoveryLists = (
  city: string | null,
  values: TypePostSearchDiscovery
) => {
  const { setIsLoading, user } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
    }))
  );
  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";
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
    queryKey: ["discoveryLists", values.search_content, city],
    queryFn: async ({ pageParam }) => {
      setIsLoading(true);
      return fetchPostDiscoveryLists(city, pageParam ?? 0, values, userInfo);
    },
    getNextPageParam: (lastPage, allPages) => {
      const lastPageLength = lastPage?.spot_lists?.length ?? 0;
      if (lastPageLength < LIMIT_DISCOVERY) return undefined;
      return allPages.flatMap((page) => page?.spot_lists ?? []).length;
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
    discoveryLists: data?.pages.flatMap((page) => page?.spot_lists ?? []),
    isLoadingDiscoveryLists: isLoading,
    isErrorDiscoveryLists: isError,
    errorDiscoveryLists: error,
    hasNextPageDiscoveryLists: hasNextPage,
    fetchNextPageDiscoveryLists: fetchNextPage,
    isFetchingNextPageDiscoveryLists: isFetchingNextPage,
    refetchDiscoveryLists: refetch,
  };
};

// POST LIST FROM DISCOVERY
export const fetchPostDiscoveryCategories = async (
  city: string | null,
  values: TypePostSearchDiscovery,
  userInfo: string
) => {
  const idToken = await auth.currentUser?.getIdToken();

  if (!idToken || !city) return undefined;

  const endpoint = DISCOVERY_ENDPOINTS.POST_CATEGORIES(city);

  const response = await postDataWithToken(endpoint, values, idToken, userInfo);

  return postDiscoveryCategoriesResponseSchema.parse(response);
};
export const usePostDiscoveryCategories = (
  city: string | null,
  values: TypePostSearchDiscovery
) => {
  const { setIsLoading, user } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
    }))
  );
  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";
  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["discoveryCategories", values.search_content, city],
    queryFn: async () => {
      setIsLoading(true);

      return fetchPostDiscoveryCategories(city, values, userInfo);
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
    discoveryCategories: data?.categories,
    isLoadingDiscoveryCategories: isLoading,
    isErrorDiscoveryCategories: isError,
    errorDiscoveryCategories: error,
    refetchDiscoveryCategories: refetch,
  };
};

// GET DISCOVERY SPOTS NEARBY
export const fetchGetSpotsNearby = async (
  userInfo: string,
  values: TypePostSpotsNearby
) => {
  const idToken = await auth.currentUser?.getIdToken();
  const { city, latitude, longitude } = values;

  if (!idToken || !city || !latitude || !longitude) return null;

  const endpoint = DISCOVERY_ENDPOINTS.GET_SPOTS_NEARBY;
  const response = await postDataWithToken(endpoint, values, idToken, userInfo);

  return getSpotsNearbyResponseSchema.parse(response);
};
export const useGetSpotsNearby = (values: TypePostSpotsNearby) => {
  const { setIsLoading, user } = useAppStore(
    useShallow((state) => ({
      setIsLoading: state.setIsLoading,
      user: state.user,
    }))
  );

  const userInfo = user ? `${user.username} - ${user.email}` : "Not exists";
  const { city, latitude, longitude } = values;

  const { data, isError, error, isLoading, refetch } = useQuery({
    queryKey: ["spotsNearby", city],
    queryFn: () => {
      setIsLoading(isLoading);
      return fetchGetSpotsNearby(userInfo, values);
    },
    onSuccess: (data) => {
      setIsLoading(false);
    },
    onError: (err: AxiosError) => {
      setIsLoading(false);

      if (err instanceof ZodError) {
        Sentry.captureException(err);
      }
      console.error(err);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    enabled: !!city && !!latitude && !!longitude,
  });

  return {
    spotsNearby: data?.spots,
    isLoading,
    isError,
    error,
    refetch,
  };
};
