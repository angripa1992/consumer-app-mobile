import * as Device from 'expo-device';
import * as Application from 'expo-application';

import { useAppStore } from '@/lib/store/store';

const SLACK_URL =
	'https://hooks.slack.com/services/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';

const messageTemplate = (emoji: string, message: string) => {
	const currentDate = new Date(Date.now());
	const deviceType = Device.isDevice ? 'Real' : 'Emulator';
	const messageComplete = `
	${emoji} ${currentDate.toString()}
	 Generated from the Native App!

	 - OS: ${Device.osName} ${Device.osVersion}
	 - OS Build: ${Device.osBuildId}
	 - Android SDK: ${Device.platformApiLevel}
	 - Iphone model: ${Device.modelId}
	 - Device: ${Device.designName} - ${Device.modelName} by ${Device.brand}
	 - Manufacturer: ${Device.manufacturer}
	 - Device type: ${deviceType}${message}
	`;

	return messageComplete;
};

const postMessage = async (message: string) => {
	if (process.env.NODE_ENV === 'production') {
		try {
			await fetch(SLACK_URL, {
				method: 'POST',
				mode: 'no-cors',
				body: JSON.stringify({ text: message }),
				headers: {
					content_type: 'application/json',
				},
			});
		} catch (error) {
			console.error(
				'There is an error sending error log to slack. The error is:',
				error,
			);
		}
	}
};

export const submitErrorToSlack = async (
	endpoint: string,
	error: Error,
	fetchType: string,
	userInfo: string,
	data: any,
	context: string,
	errorMessage?: string,
) => {
	const route = useAppStore.getState().currentRoute;
	const routeString = JSON.stringify(route, null, 2)
		.split('\n')
		.map((line) => `\t${line}`)
		.join('\n');

	const specificMessage = `
	- Endpoint: ${fetchType} : ${endpoint}
	- Error: ${error}
	- User: ${userInfo}
	- Message: ${errorMessage}
	- App version: ${Application.nativeApplicationVersion}
	- Build version: ${Application.nativeBuildVersion}
	- Environment: ${process.env.EXPO_PUBLIC_BUILD_TYPE}
	- Route: \n${routeString}
	- Data: ${JSON.stringify(data)}
	- Context: ${context}
	`;

	const completeMessage = messageTemplate('🚧', specificMessage);
	await postMessage(completeMessage);
};

export const alertErrorToSlack = async (
	error: Error,
	userInfo: string,
): Promise<void> => {
	const route = useAppStore.getState().currentRoute;
	const routeString = JSON.stringify(route, null, 2)
		.split('\n')
		.map((line) => `\t${line}`)
		.join('\n');

	const specificMessage = `
    - Error: ${error.stack ? error.stack.split('(http')[0] : 'N/A'}
    - App Crashed!
	- User: ${userInfo}
	- App version: ${Application.nativeApplicationVersion}
	- Build version: ${Application.nativeBuildVersion}
	- Environment: ${process.env.EXPO_PUBLIC_BUILD_TYPE}
	- Route: ${routeString}
  `;

	const completeMessage = messageTemplate('🚨', specificMessage);

	await postMessage(completeMessage);
};
