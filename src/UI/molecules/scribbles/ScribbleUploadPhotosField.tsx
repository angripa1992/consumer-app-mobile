import { TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';

import { i18nInstance } from 'config/i18n';

import ScribbleImageItem from '@/UI/atoms/scribble/ScribbleImageItem';
import TextElement from '@/UI/atoms/text/TextElement';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import addPhotosImage from '@/UI/assets/images/scribbles/add-photos.png';

import type { ImagePickerAsset } from 'expo-image-picker';

type TypeScribbleUploadPhotosFieldProps = {
	pickImage: () => Promise<void>;
	scribbleFileImages: ImagePickerAsset[] | null;
	setScribbleFileImages: (value: ImagePickerAsset[] | null) => void;
	partialScribbleImages?: string[];
	setPartialScribbleImages?: (value: string[]) => void;
};

const ScribbleUploadPhotosField = ({
	pickImage,
	scribbleFileImages,
	setScribbleFileImages,
	partialScribbleImages,
	setPartialScribbleImages,
}: TypeScribbleUploadPhotosFieldProps) => {
	const hasImages =
		(scribbleFileImages && scribbleFileImages.length > 0) ||
		(partialScribbleImages && partialScribbleImages.length > 0);

	const handleRemoveFileImage = (imageId?: string | null) => {
		if (!imageId) return;

		setScribbleFileImages(
			scribbleFileImages?.filter((image) => image.assetId !== imageId) ?? null,
		);
	};

	const handleRemoveImage = (imageSrcToRemove: string) => {
		if (setPartialScribbleImages && partialScribbleImages) {
			setPartialScribbleImages(
				partialScribbleImages?.filter((image) => image !== imageSrcToRemove),
			);
		}
	};

	const renderImages = () => {
		let iteration = 0;
		let imagesToRender = [];

		if (partialScribbleImages) {
			for (let i = 0; i < partialScribbleImages?.length; i++) {
				if (iteration < 3) {
					imagesToRender.push(
						<ScribbleImageItem
							key={i}
							imageSrc={partialScribbleImages[i]}
							onPressRemoveIcon={() => {
								handleRemoveImage(partialScribbleImages[i]);
							}}
						/>,
					);
					iteration += 1;
				} else {
					break;
				}
			}
		}
		if (scribbleFileImages && iteration < 3) {
			for (let i = 0; i < scribbleFileImages?.length; i++) {
				if (iteration < 3) {
					imagesToRender.push(
						<ScribbleImageItem
							key={i + 20}
							imageSrc={scribbleFileImages[i].uri}
							onPressRemoveIcon={() => {
								handleRemoveFileImage(scribbleFileImages[i].assetId);
							}}
						/>,
					);
					iteration += 1;
				} else {
					break;
				}
			}
		}

		return imagesToRender;
	};

	return (
		<View className='mt-4'>
			<TextElement textStyles='text-light-white text-sm mb-3'>
				{i18nInstance.t('uploadPhotos')}
			</TextElement>
			{!hasImages && (
				<ButtonPrimary
					buttonStyles='h-[130px] w-full mb-1 border border-[#A3A3A3] border-dashed'
					designVariation='custom'
					isReactNodeContent
					onPress={pickImage}
				>
					<View
						className='flex flex-row justify-between my-2'
						style={{ gap: 5 }}
					>
						<View className='w-full h-full flex justify-center items-center mt-1'>
							<Image source={addPhotosImage} className='w-[40px] h-[40px]' />
							<TextElement className='text-sm mt-4 text-light-white'>
								{i18nInstance.t('uploadPhotos')}
							</TextElement>
						</View>
					</View>
				</ButtonPrimary>
			)}
			<View
				className='flex flex-row justify-start mt-2 px-[6px]'
				style={{ gap: 8 }}
			>
				{renderImages()}
			</View>
			{hasImages && (
				<TouchableOpacity onPress={pickImage} className='ml-auto text-right'>
					<TextElement className='text-light-white text-md mt-2'>
						+ {i18nInstance.t('addPhotos')}
					</TextElement>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default ScribbleUploadPhotosField;
