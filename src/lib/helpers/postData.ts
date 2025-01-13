import type { AxiosError, AxiosResponse } from 'axios';
import { api } from '../utils/axios';
import { submitErrorToSlack } from './slackMessage';
import { useAppStore } from '../store/store';
import { APP_VERSION } from '../utils/constants';

export const postData = async (
	endpoint: string,
	values: Record<string, any>,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		'X-App-Version': APP_VERSION,
	};

	return api
		.post(endpoint, values, { headers })
		.then((res: AxiosResponse) => {
			if (res.status === 200 || res.status === 201 || res.status === 202) {
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
					'POST',
					'',
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};

export const postDataWithToken = async (
	endpoint: string,
	values: Record<string, any>,
	token: string,
	userInfo: string,
): Promise<any> => {
	const { setIsOutdateAppError } = useAppStore.getState();

	const headers = {
		Authorization: `Bearer ${token}`,
		'X-App-Version': APP_VERSION,
	};

	return api
		.post(endpoint, values, { headers })
		.then((res: AxiosResponse) => {
			if (res.status === 200 || res.status === 201 || res.status === 202) {
				return res.data;
			}
			throw new Error(JSON.stringify(res));
		})
		.catch((error: AxiosError | any) => {
			console.error(error);

			console.error(`${error}: ${endpoint}`);

			const errorFormatted = error.toJSON();

			if (errorFormatted.status === 426) {
				setIsOutdateAppError(true);
			}
			if (errorFormatted.status >= 500) {
				submitErrorToSlack(
					endpoint,
					error,
					'POST',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};

export const postFormData = async (
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
		.post(endpoint, formData, axiosOptions)
		.then((res: AxiosResponse) => {
			if (res.status === 200 || res.status === 201) {
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
					'POST',
					userInfo,
					error.response?.data.data,
					error.response?.data.context,
					error.response?.data.message,
				);
			}
			throw error;
		});
};
