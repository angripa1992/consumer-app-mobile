import React, { useRef } from 'react';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useQueryClient } from '@tanstack/react-query';

import {
	useGetAllTarotShapes,
	useGetSingleTarotUser,
} from '@/lib/hooks/useQueryTarot';
import { useAppStore } from '@/lib/store/store';

import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import TarotNotFoundErrorView from '@/UI/organism/tarot/error/TarotNotFoundErrorView';
import TarotQRInfo from '@/UI/organism/tarot/TarotQRInfo';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';
import EditTarotQRModal from './EditTarotQRModal';

import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

interface TarotQRModalProps {
	tarotQRModalRef: React.RefObject<BottomSheetModalMethods>;
	userId: number;
	onCustomDismiss?: () => void;
}

const TarotQRModal = ({
	tarotQRModalRef,
	userId,
	onCustomDismiss,
}: TarotQRModalProps) => {
	useGetAllTarotShapes();

	const snapPoints = ['85%'];
	const editTarotQRModalRef = useRef<BottomSheetModal>(null);
	const {
		singleTarotUser,
		isError,
		isLoading: isLoadingSingleTarotUser,
	} = useGetSingleTarotUser(userId);

	const currentQueryClient = useQueryClient();
	const { user: appUser } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);

	const isAuthenticateUser = appUser?.id === userId;

	const scrollViewRef = useRef<any>(null);

	const onBackPress = () => {
		if (onCustomDismiss) {
			onCustomDismiss();
		}
		currentQueryClient.removeQueries(['singleTarotUser', userId]);
	};

	return (
		<>
			<CustomBottomSheetModal
				snapPoints={snapPoints}
				bottomSheetModalRef={tarotQRModalRef}
				onDismiss={onBackPress}
			>
				{isLoadingSingleTarotUser && <SpinnerCup />}
				<View className='pt-5 px-8'>
					{!isLoadingSingleTarotUser && singleTarotUser && (
						<TarotQRInfo
							singleTarotUser={singleTarotUser}
							scrollViewRef={scrollViewRef}
							isAuthenticateUser={isAuthenticateUser}
							editTarotQRModalRef={editTarotQRModalRef}
						/>
					)}
					{isError && <TarotNotFoundErrorView />}
				</View>
			</CustomBottomSheetModal>
			{!isLoadingSingleTarotUser && singleTarotUser && (
				<EditTarotQRModal
					editTarotQRModalRef={editTarotQRModalRef}
					singleTarotUser={singleTarotUser}
					tarotQRModalRef={tarotQRModalRef}
				/>
			)}
		</>
	);
};

export default TarotQRModal;
