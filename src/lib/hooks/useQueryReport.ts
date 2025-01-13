import { getDataWithToken } from '../helpers/getData';
import { REPORT_ENDPOINTS } from '../utils/routes';
import { useAppStore } from '../store/store';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
	reportReasonTypeResponseSchema,
	createReportResponseSchema,
} from '../schemas/report';
import { postDataWithToken } from '../helpers/postData';
import { TypeCreateReport } from '../types/report';
import { auth } from '../../../config/firebase';
import { useShallow } from 'zustand/react/shallow';

// GET ALL REPORT REASON TYPES
const fetchGetAllReportReasons = async (userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = REPORT_ENDPOINTS.GET_ALL_REPORT_REASON;
	const response = await getDataWithToken(endpoint, idToken, userInfo);

	return reportReasonTypeResponseSchema.parse(response);
};
export const useGetAllReportReasons = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['allReportReasons'],
		queryFn: async () => {
			setIsLoading(true);
			return fetchGetAllReportReasons(userInfo);
		},
		onError: (err) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		refetchOnWindowFocus: false,
	});
	return {
		allReportReasons: data?.report_reason_types,
		isLoading,
		isError,
		error,
	};
};

// POST REPORT
const fetchPostReport = async (values: TypeCreateReport, userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = REPORT_ENDPOINTS.POST_REPORT;
	const response = await postDataWithToken(endpoint, values, idToken, userInfo);

	return createReportResponseSchema.parse(response);
};
export const usePostReport = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';
	return useMutation({
		mutationFn: (values: TypeCreateReport) => {
			setIsLoading(true);
			return fetchPostReport(values, userInfo);
		},
		onError: (err: Error) => {
			setIsLoading(false);
			console.error(err);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};
