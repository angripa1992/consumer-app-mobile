import React, { Dispatch, SetStateAction } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { View } from 'react-native';
import { TypeSpotSingleToSpotList } from '@/lib/types/spot';
import TextElement from '@/UI/atoms/text/TextElement';
import MainLayout from '@/UI/layouts/MainLayout';
import { mapCustomStyle } from '@/UI/assets/styles/MapStyles';
import MapMarker from './MapMarker';
import useUserLocation from '@/lib/hooks/useUserLocation';
import MapUserMarker from './MapUserMarker';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { i18nInstance } from 'config/i18n';

type MapProps = {
	spots: TypeSpotSingleToSpotList[];
	spotModalRef: React.RefObject<BottomSheetModal>;

	spotToShow: TypeSpotSingleToSpotList | null;
	setSpotCoordinatesToShow: Dispatch<SetStateAction<string | null>>;
	viewStyles?: string;
};

export default function MapSpots({
	viewStyles,
	spots,
	spotModalRef,
	spotToShow,
	setSpotCoordinatesToShow,
}: MapProps) {
	const { location } = useUserLocation();

	const spotsCoordinates = spots.map((spot) => {
		const coordinatesSeparated = spot?.coordinates?.split(',') ?? null;

		if (
			coordinatesSeparated &&
			coordinatesSeparated[0] !== 'None' &&
			coordinatesSeparated[1] !== 'None'
		) {
			return {
				latitude: Number(coordinatesSeparated[0]),
				longitude: Number(coordinatesSeparated[1]),
			};
		}
	});

	const coordinatesBaseToRenderInMap = spotsCoordinates.find(
		(spotCoordinates) =>
			spotCoordinates !== null && spotCoordinates !== undefined,
	);
	return (
		<View className={`${viewStyles ?? ''}`}>
			{coordinatesBaseToRenderInMap ? (
				<MapView
					className='w-full h-full'
					provider={PROVIDER_GOOGLE}
					initialRegion={{
						latitude: coordinatesBaseToRenderInMap.latitude,
						longitude: coordinatesBaseToRenderInMap.longitude,
						latitudeDelta: 0.03,
						longitudeDelta: 0.03,
					}}
					customMapStyle={mapCustomStyle}
				>
					{spotsCoordinates.map(
						(spotCoordinate, index) =>
							spotCoordinate && (
								<MapMarker
									key={index}
									spotCoordinate={spotCoordinate}
									setSpotCoordinatesToShow={setSpotCoordinatesToShow}
									spotToShow={spotToShow}
									spotModalRef={spotModalRef}
								/>
							),
					)}
					{!!location && (
						<MapUserMarker
							latitude={location.coords.latitude}
							longitude={location.coords.longitude}
						/>
					)}
				</MapView>
			) : (
				<MainLayout mainLayoutStyles='flex items-center justify-center'>
					<TextElement textStyles='text-light-white text-center mt-48'>
						{i18nInstance.t('noSpotsWithCoordinates')}
					</TextElement>
				</MainLayout>
			)}
		</View>
	);
}
