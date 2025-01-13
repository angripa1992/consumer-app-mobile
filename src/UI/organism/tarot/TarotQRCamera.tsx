import BackIcon from '@/UI/assets/svg/BackIcon';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { i18nInstance } from 'config/i18n';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import {
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

interface QRProps {
	onScanQR: (data: string) => void;
	onCancel: () => void;
}

const TarotQRCamera = ({ onScanQR, onCancel }: QRProps) => {
	const [permission, requestPermission] = useCameraPermissions();

	if (!permission) {
		return <View />;
	}

	if (!permission.granted) {
		return (
			<SafeAreaView className='flex-1 justify-center items-center relative'>
				<TextElement textStyles='text-center'>
					{i18nInstance.t('cameraPermission')}
				</TextElement>
				<ButtonPrimary buttonStyles='w-[70%] mb-3' onPress={requestPermission}>
					{i18nInstance.t('grantPermission')}
				</ButtonPrimary>
				<ButtonPrimary onPress={onCancel}>
					{i18nInstance.t('back')}
				</ButtonPrimary>
			</SafeAreaView>
		);
	}

	return (
		<View className='flex-1 justify-center relative'>
			<CameraView
				style={styles.camera}
				onBarcodeScanned={(data) => onScanQR(data.data)}
				barcodeScannerSettings={{
					barcodeTypes: ['qr'],
				}}
				facing='back'
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity style={styles.button} onPress={onCancel}>
						<BackIcon color='#fff' />
						<Text style={styles.text}>{i18nInstance.t('back')}</Text>
					</TouchableOpacity>
				</View>
			</CameraView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		margin: 40,
		marginLeft: 20,
		marginRight: 20,
	},
	button: {
		flex: 1,
		flexDirection: 'row',
		columnGap: 8,
		alignSelf: 'flex-end',
		alignItems: 'center',
		padding: 10,
		borderRadius: 30,
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
	},
});

export default TarotQRCamera;
