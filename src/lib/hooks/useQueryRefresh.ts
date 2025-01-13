import { useCallback, useState } from 'react';

export function useQueryRefresh<T>(refetch?: () => Promise<T>) {
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = useCallback(() => {
		if (!refetch) return;
		setRefreshing(true);
		refetch().then(() => setRefreshing(false));
	}, []);

	return { refreshing, handleRefresh };
}
