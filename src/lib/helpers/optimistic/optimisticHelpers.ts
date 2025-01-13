import { QueryClient } from '@tanstack/react-query';

export const updateOptimisticInQueryData = async <T>({
	currentQueryClient,
	queryKey,
	getUpdatedData,
}: {
	currentQueryClient: QueryClient;
	queryKey: any[];
	getUpdatedData: (oldData: T) => T;
}) => {
	await currentQueryClient.cancelQueries(queryKey);

	const previousData = currentQueryClient.getQueryData(queryKey);
	currentQueryClient.setQueryData(queryKey, (oldData) => {
		const updatedData = getUpdatedData(oldData as T);
		return updatedData;
	});

	return { previousData };
};

export const updateFollowCounter = (counter: number, isFollowing?: boolean) => {
	return isFollowing ? counter - 1 : counter + 1;
};
