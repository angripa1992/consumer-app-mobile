import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useUserLocation = () => {
	const [location, setLocation] = useState<Location.LocationObject | null>(
		null,
	);

	useEffect(() => {
		const getLocationPermission = async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== 'granted') return;

			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
			});
			setLocation(location);
		};
		getLocationPermission();
	}, []);

	return {
		location,
	};
};

export default useUserLocation;
