import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

type TypeImagePickerProps = {
	allowsMultipleSelection?: boolean;
	allowsEditing?: boolean;
	selectionLimit?: number;
};

const useImagePicker = ({
	allowsMultipleSelection,
	allowsEditing = true,
	selectionLimit = 0,
}: TypeImagePickerProps) => {
	const [imagePicked, setImageToPicked] = useState<
		ImagePicker.ImagePickerAsset[] | null
	>(null);

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: allowsEditing,
			aspect: [4, 3],
			quality: 1,
			allowsMultipleSelection,
			selectionLimit,
		});

		if (!result.canceled) {
			setImageToPicked(result.assets);
		}
	};

	return {
		imagePicked,
		pickImage,
		setImageToPicked,
	};
};

export default useImagePicker;
