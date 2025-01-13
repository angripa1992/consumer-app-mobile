import type { AxiosError, AxiosResponse } from 'axios';

import { api } from '../utils/axios';
import { submitErrorToSlack } from './slackMessage';
import { useAppStore } from '../store/store';
import { APP_VERSION } from '../utils/constants';

export const putData = async (
	endpoint: string,
	values: Record<string, unknown>,
	userInfo: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		'X-App-Version': APP_VERSION,
	};

	return api
		.put(endpoint, values, { headers })
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
					'PUT',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};

export const putDataWithToken = async (
	endpoint: string,
	values: Record<string, unknown>,
	token: string,
	userInfo: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		Authorization: `Bearer ${token}`,
		'X-App-Version': APP_VERSION,
	};

	return api
		.put(endpoint, values, { headers })
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
					'PUT',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};

export const putFormData = async (
	endpoint: string,
	values: Record<string, any>,
	token: string,
	userInfo: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const axiosOptions = {
		headers: {
			'Content-Type': 'multipart/form-data',
			Authorization: `Bearer ${token}`,
			'X-App-Version': APP_VERSION,
		},
	};

	let formData = new FormData();

	Object.keys(values).forEach((key: string) => {
		const value = values[key];

		if (Array.isArray(value) && key === 'scribble_file_images') {
			value.forEach((val) => {
				formData.append(key, val);
			});
		} else if (Array.isArray(value)) {
			formData.append(key, JSON.stringify(value));
		} else {
			formData.append(key, value);
		}
	});

	return api
		.put(endpoint, formData, axiosOptions)
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
					'PUT',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};
