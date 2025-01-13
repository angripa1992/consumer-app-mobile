import type { AxiosError, AxiosResponse } from 'axios';

import { api } from '../utils/axios';
import { submitErrorToSlack } from './slackMessage';
import { useAppStore } from '../store/store';
import { APP_VERSION } from '../utils/constants';

export const getData = async (
	endpoint: string,
	userInfo: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		'X-App-Version': APP_VERSION,
	};

	return api
		.get(endpoint, { headers })
		.then((res: AxiosResponse) => {
			if (res.status === 200) {
				return res.data;
			}
			throw new Error(JSON.stringify(res));
		})
		.catch((error: AxiosError | any) => {
			console.error(`${error}: ${endpoint}`);

			const errorFormatted = error.toJSON();

			if (errorFormatted.status === 426) {
				setIsOutdateAppError(true);
			}
			if (errorFormatted.status >= 500) {
				submitErrorToSlack(
					endpoint,
					error,
					'GET',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};

export const getDataWithToken = async (
	endpoint: string,
	token: string,
	userInfo: string,
	isCompleteResponse?: boolean,
	timeout?: number
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		Authorization: `Bearer ${token}`,
		'X-App-Version': APP_VERSION,
	};

	return api
		.get(endpoint, { headers, timeout: timeout ?? 0 })
		.then((res: AxiosResponse) => {
			if (isCompleteResponse) {
				return res;
			} else {
				if (res.status === 200) {
					return res.data;
				}
			}
			throw new Error(JSON.stringify(res));
		})
		.catch((error: AxiosError | any) => {
			console.error(`${error}: ${endpoint}`);

			const errorFormatted = error.toJSON();

			if (errorFormatted.status === 426) {
				setIsOutdateAppError(true);
			}
			if (errorFormatted.status >= 500) {
				submitErrorToSlack(
					endpoint,
					error,
					'GET',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};
