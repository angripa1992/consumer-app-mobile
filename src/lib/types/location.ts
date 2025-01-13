export type TypeGetLocation = {
	coords: {
		accuracy: number | null;
		altitude: number | null;
		altitudeAccuracy: number | null;
		heading: number | null;
		latitude: number | null;
		longitude: number | null;
		speed: number | null;
	};
	mocked?: boolean | null;
	timestamp?: number | null;
};
