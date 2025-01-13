import * as Updates from 'expo-updates';

const onFetchUpdate = async () => {
	try {
		const update = await Updates.checkForUpdateAsync();
		if (update.isAvailable) {
			await Updates.fetchUpdateAsync();
			await Updates.reloadAsync();
		}
	} catch (error) {
		console.error(`Error fetching latest Expo update: ${error}`);
	}
};

export default onFetchUpdate;
