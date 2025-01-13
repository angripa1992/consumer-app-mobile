module.exports = ({ config }) => {
	const isProduction = process.env.EXPO_PUBLIC_BUILD_TYPE === 'production';
	const isStaging = process.env.EXPO_PUBLIC_BUILD_TYPE === 'production';

	// if (isStaging) {
	// 	return {
	// 		...config,
	// 		ios: {
	// 			...config.ios,
	// 			googleServicesFile: './GoogleService-Info-staging.plist',
	// 		},
	// 		android: {
	// 			...config.android,
	// 			googleServicesFile: './google-services-staging.json',
	// 		},
	// 	};
	// }

	if (isProduction) {
		return {
			...config,
			ios: {
				...config.ios,
				googleServicesFile: './GoogleService-Info.plist',
			},
			android: {
				...config.android,
				googleServicesFile: './google-services.json',
			},
		};
	}

	return {
		...config,
	};
};
