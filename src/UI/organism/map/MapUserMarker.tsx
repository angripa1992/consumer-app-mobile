import MarkerUser from '@/UI/assets/svg/MarkerUser';
import { Marker } from 'react-native-maps';

interface MapUserMarkerProps {
	latitude: number;
	longitude: number;
}

const MapUserMarker = ({ latitude, longitude }: MapUserMarkerProps) => {
	return (
		<Marker
			coordinate={{
				latitude,
				longitude,
			}}
			tracksViewChanges={false}
		>
			<MarkerUser />
		</Marker>
	);
};

export default MapUserMarker;
