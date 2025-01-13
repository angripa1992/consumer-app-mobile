import { useEffect, useState } from 'react';
import { TouchableOpacity, Text, View, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Header from '../../layouts/Header';
import BackIcon from '../../assets/svg/BackIcon';
import { i18nInstance } from 'config/i18n';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';

import type { AppStackNavigationProp } from '@/lib/types/tabScreenParams';

type CreateListHeaderForCreate = {
	viewType: 'create';
};

type CreateListHeaderForEdit = {
	viewType: 'edit';
};

type CreateListHeaderProps = {
	isFormDirty: boolean;
	resetForm: () => void;
} & (CreateListHeaderForCreate | CreateListHeaderForEdit);

const CreateListHeader = ({
	isFormDirty,
	resetForm,
	...props
}: CreateListHeaderProps) => {
	const { viewType } = props;
	const navigation = useNavigation<AppStackNavigationProp>();
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const headerTitle = () => {
		if (viewType === 'edit') {
			return 'editList';
		}

		return 'createList';
	};

	const confirmModalQuestionText = () => {
		if (viewType === 'edit') {
			return `${i18nInstance.t('discardChanges')}?`;
		}

		return i18nInstance.t('wouldYouLikeToDiscardThisList?');
	};

	const onGoBack = () => {
		resetForm();

		if (navigation.canGoBack()) {
			navigation.goBack();
			return;
		}

		navigation.navigate('TabScreens');
	};

	const onPressGoBack = () => {
		if (isFormDirty) {
			setShowConfirmModal(true);
			return;
		}

		onGoBack();
	};

	const onConfirmGoBack = () => {
		setShowConfirmModal(false);
		onGoBack();
	};

	useEffect(() => {
		const backAction = () => {
			onPressGoBack();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, [isFormDirty]);

	return (
		<>
			<Header showDefaultHeader={false}>
				<View className=' w-full flex-row items-center relative'>
					<Text className='w-full text-gray text-center text-base font-semibold'>
						{i18nInstance.t(headerTitle())}
					</Text>
					<TouchableOpacity
						activeOpacity={1}
						onPress={onPressGoBack}
						className='absolute  justify-center py-2'
						hitSlop={10}
					>
						<BackIcon />
					</TouchableOpacity>
				</View>
			</Header>
			<ConfirmModal
				showConfirmModal={showConfirmModal}
				setShowConfirmModal={setShowConfirmModal}
				onConfirm={onConfirmGoBack}
				questionText={confirmModalQuestionText()}
				confirmButtonText={i18nInstance.t('discard')}
				cancelButtonText={i18nInstance.t('cancel')}
			/>
		</>
	);
};

export default CreateListHeader;
