import React, { useCallback, useMemo } from 'react';
import { Platform, StyleSheet } from 'react-native';
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	type BottomSheetBackdropProps,
	type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';

interface CustomBottomSheetModalProps extends BottomSheetModalProps {
	children: React.ReactNode;
	bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const CustomBottomSheetModal = ({
	children,
	bottomSheetModalRef,
	containerStyle,
	...props
}: CustomBottomSheetModalProps) => {
	const snapPoints = useMemo(() => {
		if (props.snapPoints) {
			return props.snapPoints;
		}
		return ['25%'];
	}, []);

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				disappearsOnIndex={-1}
				appearsOnIndex={0}
			/>
		),
		[],
	);

	const defaultKeyboardBehavior =
		Platform.OS === 'android' ? 'extend' : 'interactive';

	return (
		<BottomSheetModal
			ref={bottomSheetModalRef}
			index={0}
			snapPoints={snapPoints}
			containerStyle={[styles.contentContainer, containerStyle]}
			backdropComponent={renderBackdrop}
			backgroundStyle={styles.backgroundStyle}
			handleIndicatorStyle={styles.handleIndicatorStyle}
			style={styles.contentContainer}
			keyboardBlurBehavior='restore'
			keyboardBehavior={
				props.keyboardBehavior
					? props.keyboardBehavior
					: defaultKeyboardBehavior
			}
			{...props}
		>
			{children}
		</BottomSheetModal>
	);
};

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		padding: 16,
	},
	backgroundStyle: {
		backgroundColor: '#000',
	},
	handleIndicatorStyle: {
		backgroundColor: '#fff',
	},
});

export default CustomBottomSheetModal;
