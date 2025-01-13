export const getImageUriInformation = (uri: string) => {
	const fileName = String(uri.split('/').pop());
	const fileExtension = String(uri.split('.').pop());
	const fileType = `image/${fileExtension}`;

	return {
		fileType,
		fileName,
	};
};
