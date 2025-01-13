import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import SliderScribbleImages from '@/UI/molecules/scribbles/slider/SliderScribbleImages';
import ArrowIcon from '@/UI/assets/svg/Arrow';
import CustomImage from '@/UI/atoms/image/CustomImage';
import ModalTemplate from '@/UI/organism/modal/ModalTemplate';

export const useRenderScribbleImages = (scribbleImages?: string[] | null) => {
	const [showModal, setShowModal] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);

	const imageWidth = 500;
	const imageHeight = 500;
	const arrayLength = Math.min(scribbleImages?.length ?? 0, 3);

	const onPressNextImage = () => {
		if (imageIndex < arrayLength - 1) {
			setImageIndex(imageIndex + 1);
		} else {
			setImageIndex(0);
		}
	};

	const onPressPreviousImage = () => {
		if (imageIndex > 0) {
			setImageIndex(imageIndex - 1);
		} else {
			setImageIndex(arrayLength - 1);
		}
	};

	const onPressImage = (index: number) => {
		setShowModal(true);
		setImageIndex(index);
	};

	const scribbleImagesToSave = useMemo(() => {
		if (!scribbleImages || arrayLength === 0) {
			return [];
		}

		return scribbleImages.slice(0, arrayLength);
	}, [scribbleImages]);

	const scribbleImagesToRender = () => {
		if (!scribbleImages) return null;

		return <SliderScribbleImages imagesUrlToRender={scribbleImages} />;
	};

	const modalToRender = () => {
		return (
			<ModalTemplate setShowModal={setShowModal} showModal={showModal}>
				<CustomImage
					className='w-[90%] h-[350px] rounded-md'
					imageSrc={scribbleImagesToSave[imageIndex]}
					width={imageWidth}
					height={imageHeight}
					transition={200}
					recyclingKey={scribbleImagesToSave[imageIndex]}
					placeholder={undefined}
					contentFit='cover'
				/>
				{arrayLength > 1 && (
					<View className='absolute w-full'>
						<TouchableOpacity
							className='absolute top-1/2 left-5 bg-white border border-black rounded-full p-2 rotate-180'
							onPress={onPressPreviousImage}
							activeOpacity={1}
						>
							<ArrowIcon color='#000' width={20} height={20} />
						</TouchableOpacity>
						<TouchableOpacity
							className='absolute top-1/2 right-5 bg-white border border-black rounded-full p-2'
							onPress={onPressNextImage}
							activeOpacity={1}
						>
							<ArrowIcon color='#000' width={20} height={20} />
						</TouchableOpacity>
					</View>
				)}
			</ModalTemplate>
		);
	};

	return { scribbleImagesToRender, modalToRender, onPressImage };
};
