import CustomBottomSheetModal from '../modal/CustomBottonSheet';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { tarotCardFormSchema } from '@/lib/schemas/tarot';
import {
	findTarotEmojiByOrder,
	getDefaultTarotEmoji,
	updateTarotEmojiValueToSend,
} from '@/lib/helpers/tarotHelpers';
import {
	useGetAllTarotShapes,
	usePutSingleTarotUser,
} from '@/lib/hooks/useQueryTarot';
import { i18nInstance } from 'config/i18n';
import { convertStringToLowerCaseWithoutSpaces } from '@/lib/helpers/translations/convertStringToLowerCaseWithoutSpaces';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import EmojiInputForm from '@/UI/atoms/input/EmojiInputForm';
import SelectForm from '@/UI/atoms/select/SelectForm';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import TextElement from '@/UI/atoms/text/TextElement';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';
import SwitchInput from '@/UI/atoms/switch/SwitchInput';

import type {
	TypeSingleTarotUser,
	TypeTarotCardForm,
	TypeUpdateTarotCardValues,
} from '@/lib/types/tarot';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

interface EditTarotQRModalProps {
	editTarotQRModalRef: React.RefObject<BottomSheetModalMethods>;
	tarotQRModalRef: React.RefObject<BottomSheetModalMethods>;
	singleTarotUser: TypeSingleTarotUser;
}

const EditTarotQRModal = ({
	editTarotQRModalRef,
	singleTarotUser,
}: EditTarotQRModalProps) => {
	const snapPoints = ['55%'];
	const [showConfirmModal, setShowConfirmModal] = useState(false);

	const { allTarotShapes } = useGetAllTarotShapes();
	const {
		mutateAsync: updateSingleTarotUser,
		isLoading: isLoadingUpdateSingleTarotUser,
	} = usePutSingleTarotUser();

	const singleTarotUserEmojis = singleTarotUser.emojis;
	const singleTarotUserEmojiOne = findTarotEmojiByOrder(
		singleTarotUserEmojis,
		1,
	);
	const singleTarotUserEmojiTwo = findTarotEmojiByOrder(
		singleTarotUserEmojis,
		2,
	);
	const singleTarotUserEmojiThree = findTarotEmojiByOrder(
		singleTarotUserEmojis,
		3,
	);

	const defaultEmojiOne = getDefaultTarotEmoji(singleTarotUserEmojiOne);
	const defaultEmojiTwo = getDefaultTarotEmoji(singleTarotUserEmojiTwo);
	const defaultEmojiThree = getDefaultTarotEmoji(singleTarotUserEmojiThree);

	const {
		control,
		handleSubmit,
		formState: { errors, isDirty: isFormDirty },
		reset: resetForm,
	} = useForm<TypeTarotCardForm>({
		resolver: zodResolver(tarotCardFormSchema),
		defaultValues: {
			show_name: singleTarotUser.show_name,
			show_avatar: singleTarotUser.show_avatar,
			shape: singleTarotUser.shape,
			emoji_one: defaultEmojiOne,
			emoji_two: defaultEmojiTwo,
			emoji_three: defaultEmojiThree,
		},
	});

	const shapesOptions =
		allTarotShapes?.map((shape) => {
			return {
				label: i18nInstance.t(
					convertStringToLowerCaseWithoutSpaces(shape.name),
				),
				value: i18nInstance.t(
					convertStringToLowerCaseWithoutSpaces(shape.name),
				),
			};
		}) ?? [];

	const onSubmit: SubmitHandler<TypeTarotCardForm> = async (data) => {
		const {
			shape: shapeOption,
			emoji_one,
			emoji_two,
			emoji_three,
			...restData
		} = data;

		let tarotCardDataValuesToSend: TypeUpdateTarotCardValues = {
			...restData,
			emojis: [
				updateTarotEmojiValueToSend(
					singleTarotUserEmojiOne?.tarot_emoji_id,
					emoji_one,
				),
				updateTarotEmojiValueToSend(
					singleTarotUserEmojiTwo?.tarot_emoji_id,
					emoji_two,
				),
				updateTarotEmojiValueToSend(
					singleTarotUserEmojiThree?.tarot_emoji_id,
					emoji_three,
				),
			],
		};

		const shapeIdToSend = allTarotShapes?.find(
			(shape) => shape.name === shapeOption,
		)?.id;

		if (!shapeIdToSend) {
			await updateSingleTarotUser(tarotCardDataValuesToSend);
			editTarotQRModalRef.current?.close();
			return;
		}

		tarotCardDataValuesToSend = {
			...tarotCardDataValuesToSend,
			tarot_shape_id: shapeIdToSend,
		};
		await updateSingleTarotUser(tarotCardDataValuesToSend);
		editTarotQRModalRef.current?.close();
	};

	const onPressGoBack = () => {
		if (isLoadingUpdateSingleTarotUser) return;
		if (isFormDirty) {
			setShowConfirmModal(true);
			return;
		}

		editTarotQRModalRef.current?.close();

		resetForm();
	};

	const onConfirmGoBack = () => {
		setShowConfirmModal(false);
		editTarotQRModalRef.current?.close();
		resetForm();
	};

	return (
		<CustomBottomSheetModal
			snapPoints={snapPoints}
			bottomSheetModalRef={editTarotQRModalRef}
		>
			<View className='py-5 px-2'>
				{isLoadingUpdateSingleTarotUser && (
					<View className='w-full h-full'>
						<SpinnerCup />
					</View>
				)}
				{!isLoadingUpdateSingleTarotUser && (
					<View>
						<View>
							<TextElement
								textStyles='text-white font-semibold text-xl mb-3'
								testID='tarot-username'
								numberOfLines={1}
							>
								{i18nInstance.t('customizeCard')}
							</TextElement>
							<SwitchInput
								containerStyles='flex-row items-center justify-between'
								control={control}
								name='show_name'
								label={i18nInstance.t('showTasteTarotArchetype')}
								error={errors.show_name}
								testID='input-show-name'
							/>
							<SwitchInput
								containerStyles='flex-row items-center justify-between mt-4'
								control={control}
								name='show_avatar'
								label={i18nInstance.t('showCharacterAvatar')}
								error={errors.show_avatar}
								testID='input-show-avatar'
							/>

							<View className=''>
								<SelectForm
									containerStyles='mt-4 flex-row items-center justify-between'
									label={i18nInstance.t('selectShape')}
									labelStyles='mr-5 text-neutral-gray'
									options={shapesOptions}
									name='shape'
									control={control}
									error={errors.shape}
									testID='input-shape'
									buttonStyles={{
										width: 'auto',
										flex: 1,
									}}
								/>
							</View>
							<View className='flex-row items-center my-5'>
								<TextElement textStyles={`text-neutral-gray mr-10 `}>
									{i18nInstance.t('selectEmojis')}
								</TextElement>
								<View className='flex-row justify-between items-center py-4 flex-1 '>
									<EmojiInputForm
										containerStyles='flex-1'
										control={control}
										name='emoji_one'
										labelStyles='text-gray'
										inputStyles='items-start'
										testID='input-emoji-one'
									/>
									<EmojiInputForm
										control={control}
										containerStyles='flex-1'
										name='emoji_two'
										labelStyles='text-gray'
										inputStyles='items-center'
										testID='input-emoji-two'
									/>
									<EmojiInputForm
										control={control}
										containerStyles='flex-1'
										name='emoji_three'
										labelStyles='text-gray'
										inputStyles='items-end'
										testID='input-emoji-three'
									/>
								</View>
							</View>
						</View>
						<View className='flex-row gap-x-5 mt-5'>
							<ButtonPrimary
								onPress={onPressGoBack}
								buttonStyles='py-3 flex-1'
								designVariation='white-transparent'
								testID='button-cancel'
							>
								{i18nInstance.t('cancel')}
							</ButtonPrimary>
							<ButtonPrimary
								onPress={handleSubmit(onSubmit)}
								buttonStyles='py-3  flex-1'
								designVariation='green'
								testID='button-save'
							>
								{i18nInstance.t('save')}
							</ButtonPrimary>
						</View>
					</View>
				)}
				<ConfirmModal
					showConfirmModal={showConfirmModal}
					setShowConfirmModal={setShowConfirmModal}
					onConfirm={onConfirmGoBack}
					questionText={i18nInstance.t('discardChanges')}
					confirmButtonText={i18nInstance.t('discard')}
					cancelButtonText={i18nInstance.t('cancel')}
				/>
			</View>
		</CustomBottomSheetModal>
	);
};

export default EditTarotQRModal;
