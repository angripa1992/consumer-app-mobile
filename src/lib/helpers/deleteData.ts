import type { AxiosError, AxiosResponse } from 'axios';

import { api } from '../utils/axios';
import { submitErrorToSlack } from './slackMessage';
import { useAppStore } from '../store/store';
import { APP_VERSION } from '../utils/constants';

export const deleteData = async (
	endpoint: string,
	userInfo: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		'X-App-Version': APP_VERSION,
	};

	return api
		.delete(endpoint, { headers })
		.then((res: AxiosResponse) => {
			if (res.status === 200) {
				return res.data;
			}
			throw new Error(JSON.stringify(res));
		})
		.catch((error: AxiosError | any) => {
			console.error(error);
			const errorFormatted = error.toJSON();

			if (errorFormatted.status === 426) {
				setIsOutdateAppError(true);
			}
			if (errorFormatted.status >= 500) {
				submitErrorToSlack(
					endpoint,
					error,
					'DELETE',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}

			throw error;
		});
};

export const deleteDataWithToken = async (
	endpoint: string,
	token: string,
	userInfo?: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		Authorization: `Bearer ${token}`,
		'X-App-Version': APP_VERSION,
	};

	return api
		.delete(endpoint, { headers })
		.then((res: AxiosResponse) => {
			if (res.status === 200) {
				return res.data;
			}
			throw new Error(JSON.stringify(res));
		})
		.catch((error: AxiosError | any) => {
			console.error(error);
			const errorFormatted = error.toJSON();

			if (errorFormatted.status === 426) {
				setIsOutdateAppError(true);
			}
			if (errorFormatted.status >= 500) {
				submitErrorToSlack(
					endpoint,
					error,
					'DELETE',
					userInfo ?? '',
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}

			throw error;
		});
};
