import { getDataWithToken } from '../helpers/getData';
import { orderSupplierResponseSchema } from '../schemas/orderSupplier';
import { useAppStore } from '../store/store';
import { useQuery } from '@tanstack/react-query';
import { ORDER_SUPPLIERS_ENDPOINTS } from '../utils/routes';
import { auth } from '../../../config/firebase';
// GET SUPPLIERS

const fetchGetOrderSuppliers = async (userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = ORDER_SUPPLIERS_ENDPOINTS.GET_ALL_ORDER_SUPPLIERS;
	const response = await getDataWithToken(endpoint, idToken, userInfo);
	return orderSupplierResponseSchema.parse(response);
};
export const useGetOrderSuppliers = () => {
	const { setIsLoading, user } = useAppStore();
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['suppliers'],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetOrderSuppliers(userInfo);
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
	return {
		data,
		isLoading,
		isError,
		error,
	};
};
