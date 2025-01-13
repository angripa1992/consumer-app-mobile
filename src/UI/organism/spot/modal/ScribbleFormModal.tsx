import { useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { ScrollView } from 'react-native-gesture-handler';
import { i18nInstance } from 'config/i18n';
import useImagePicker from '@/lib/hooks/useImagePicker';

import ScribbleUploadPhotosField from '@/UI/molecules/scribbles/ScribbleUploadPhotosField';
import InputDatePicker from '@/UI/atoms/input/InputDatePicker';
import InputForm from '@/UI/atoms/input/InputForm';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import CustomBottomSheetModal from '../../modal/CustomBottonSheet';
import TextElement from '@/UI/atoms/text/TextElement';
import LikeScribbleImage from '@/UI/assets/images/scribbles/like-scribble.png';
import LikeScribbleDisableImage from '@/UI/assets/images/scribbles/like-scribble-disable.png';
import UnlikeScribbleImage from '@/UI/assets/images/scribbles/unlike-scribble.png';
import UnlikeScribbleDisableImage from '@/UI/assets/images/scribbles/unlike-scribble-disable.png';

import type { TypeAddOrEditScribbleFormValues } from '@/lib/types/scribbles';
import type { BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import type { ImagePickerAsset } from 'expo-image-picker';
import { type SubmitHandler, UseFormReturn } from 'react-hook-form';

interface ScribbleFormModalProps {
	isLoadingPostScribble: boolean;
	onSubmit: SubmitHandler<TypeAddOrEditScribbleFormValues>;
	scribbleFormModalRef: React.RefObject<BottomSheetModalMethods>;
	scribbleImagesToSave: ImagePickerAsset[] | null;
	setScribbleImagesToSave: (value: ImagePickerAsset[] | null) => void;
	partialScribbleImages?: string[];
	setPartialScribbleImages?: (value: string[]) => void;
	formMethods: UseFormReturn<TypeAddOrEditScribbleFormValues>;
}

const ScribbleFormModal = ({
	isLoadingPostScribble,
	onSubmit,
	scribbleFormModalRef,
	scribbleImagesToSave,
	setScribbleImagesToSave,
	partialScribbleImages,
	setPartialScribbleImages,
	formMethods,
}: ScribbleFormModalProps) => {
	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitSuccessful },
		watch,
		setValue,
		reset,
	} = formMethods;
	const { imagePicked: scribbleImages, pickImage } = useImagePicker({
		allowsMultipleSelection: true,
		allowsEditing: false,
		selectionLimit: 3,
	});

	const snapPointsForEditForm = ['80%'];

	const isPositiveValue = watch('is_positive');

	const onPressSubmit = () => {
		handleSubmit(onSubmit)();
	};

	const onPressCancel = () => {
		scribbleFormModalRef.current?.close();
	};

	const onPressIsPositive = () => {
		setValue('is_positive', true);
	};

	const onPressIsNegative = () => {
		setValue('is_positive', false);
	};

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset();
		}
	}, [isSubmitSuccessful, reset]);

	useEffect(() => {
		setScribbleImagesToSave(scribbleImages);
	}, [scribbleImages]);

	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={scribbleFormModalRef}
			snapPoints={snapPointsForEditForm}
			keyboardBehavior={'interactive'}
			android_keyboardInputMode='adjustResize'
		>
			<ScrollView className='pb-16'>
				<TextElement
					textStyles='text-light-white text-base mb-6'
					testID='scribble-form-title'
				>
					{i18nInstance.t('createScribble')}
				</TextElement>
				<View className='mb-4'>
					<View className='flex-row justify-center items-center gap-x-10'>
						<TouchableOpacity
							onPress={onPressIsPositive}
							activeOpacity={1}
							testID='scribble-form-is-positive'
						>
							{isPositiveValue ? (
								<Image
									className='w-[85px] h-[85px]'
									source={LikeScribbleImage}
								/>
							) : (
								<Image
									className='w-[85px] h-[85px]'
									source={LikeScribbleDisableImage}
								/>
							)}
						</TouchableOpacity>
						<TextElement
							textStyles='text-light-white text-xs mb-3 '
							fontFamily='pachang'
						>
							{i18nInstance.t('or')}
						</TextElement>
						<TouchableOpacity
							activeOpacity={1}
							testID='scribble-form-is-negative'
							onPress={onPressIsNegative}
						>
							{isPositiveValue === false ? (
								<Image
									className='w-[85px] h-[85px]'
									source={UnlikeScribbleImage}
								/>
							) : (
								<Image
									className='w-[85px] h-[85px]'
									source={UnlikeScribbleDisableImage}
								/>
							)}
						</TouchableOpacity>
					</View>
					{errors.is_positive && (
						<TextElement textStyles='text-error mb-3'>
							{i18nInstance.t(String(errors.is_positive.message))}
						</TextElement>
					)}
				</View>
				<InputDatePicker
					control={control}
					name='visit_date'
					label='Visited Date'
					error={errors.visit_date}
					containerStyles='mb-4'
				/>

				<InputForm
					testID='scribble-form-description'
					control={control}
					name='review_description'
					label={i18nInstance.t('whatWereYourThoughts')}
					placeholder={`${i18nInstance.t('enterDescription')}...`}
					error={errors.review_description}
					multiline
					maxLength={280}
					isBottomSheetTextInput
					style={{ height: 157, fontSize: 14 }}
					showCounter
					placeholderTextColor={'#666666'}
				/>
				<ScribbleUploadPhotosField
					pickImage={pickImage}
					scribbleFileImages={scribbleImagesToSave}
					setScribbleFileImages={setScribbleImagesToSave}
					partialScribbleImages={partialScribbleImages}
					setPartialScribbleImages={setPartialScribbleImages}
				/>
			</ScrollView>
			<View className='mb-12 items-center gap-x-5 flex-row'>
				<ButtonPrimary
					onPress={onPressCancel}
					designVariation='white-transparent'
					buttonStyles={`flex-1 ${isLoadingPostScribble ? 'opacity-50' : ''}`}
					testID='scribble-form-cancel-button'
				>
					{i18nInstance.t('cancel')}
				</ButtonPrimary>
				<ButtonPrimary
					disabled={isLoadingPostScribble}
					onPress={onPressSubmit}
					buttonStyles={`mb-5 mt-5 flex-1 ${isLoadingPostScribble ? 'opacity-50' : ''}`}
					testID='scribble-form-submit-button'
					designVariation='green'
				>
					{i18nInstance.t('submit')}
				</ButtonPrimary>
			</View>
		</CustomBottomSheetModal>
	);
};

export default ScribbleFormModal;
