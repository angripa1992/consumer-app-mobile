import { View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { mapCustomStyle } from '../../assets/styles/MapStyles';
import MarkerIcon from '@/UI/assets/svg/MarkerIcon';

type TypeMapSingleProps = {
	latitude?: number | null;
	longitude?: number | null;
	containerStyles?: string;
};

const MapSingle = ({
	latitude,
	longitude,
	containerStyles,
}: TypeMapSingleProps) => {
	return (
		<View className={`${containerStyles ?? ''}`}>
			{latitude && longitude ? (
				<MapView
					testID='spot-screen-map'
					className='w-full h-full'
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: latitude,
						longitude: longitude,
						latitudeDelta: 0.03,
						longitudeDelta: 0.03,
					}}
					customMapStyle={mapCustomStyle}
				>
					<Marker
						coordinate={{
							latitude: latitude,
							longitude: longitude,
						}}
					>
						<MarkerIcon stroke='#FE2EFF' />
					</Marker>
				</MapView>
			) : null}
		</View>
	);
};

export default MapSingle;
