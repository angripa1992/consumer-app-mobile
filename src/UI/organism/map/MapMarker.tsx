import MarkerIcon from '@/UI/assets/svg/MarkerIcon';
import { TypeSpotSingleToSpotList } from '@/lib/types/spot';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { Marker } from 'react-native-maps';

type MarkerColor = '#FFFFFF' | '#FE2EFF';

interface MapMarkerProps {
	spotCoordinate: {
		latitude: number;
		longitude: number;
	};
	spotModalRef: React.RefObject<BottomSheetModal>;

	spotToShow: TypeSpotSingleToSpotList | null;
	setSpotCoordinatesToShow: (arg0: string) => void;
}

const MapMarker = ({
	spotCoordinate,
	spotModalRef,
	spotToShow,
	setSpotCoordinatesToShow,
}: MapMarkerProps) => {
	const spotCoordinates = `${spotCoordinate.latitude},${spotCoordinate.longitude}`;
	const areSameCoordinates = spotCoordinates === spotToShow?.coordinates;

	const markerColor = useMemo<MarkerColor>(() => {
		if (areSameCoordinates) {
			return '#FE2EFF';
		}

		return '#FFFFFF';
	}, [spotModalRef.current, spotToShow]);

	const onPressMarker = () => {
		setSpotCoordinatesToShow(spotCoordinates);
		spotModalRef.current?.present();
	};

	return (
		<Marker
			coordinate={{
				latitude: spotCoordinate.latitude,
				longitude: spotCoordinate.longitude,
			}}
			onPress={onPressMarker}
			identifier={spotCoordinates}
			tracksInfoWindowChanges={false}
		>
			<MarkerIcon stroke={markerColor} />
		</Marker>
	);
};

export default MapMarker;
