import perf from '@react-native-firebase/perf';

import { getDataWithToken } from '../getData';

export const getDataMeasuringPerfWithToken = async (
	endpoint: string,
	token: string,
	userInfo: string,
) => {
	const url = `${process.env.EXPO_PUBLIC_API_URL}${endpoint}`;
	const metric = await perf().newHttpMetric(url, 'GET');

	metric.putAttribute('user', userInfo);

	await metric.start();

	const response = await getDataWithToken(endpoint, token, userInfo, true);

	metric.setHttpResponseCode(response?.status);
	metric.setResponseContentType(response.headers.get('Content-Type'));
	metric.setResponsePayloadSize(
		response.headers.get('Content-Length')
			? Number(response.headers.get('Content-Length'))
			: null,
	);

	await metric.stop();

	return response.data;
};
