import { getImageUriInformation } from '@/lib/helpers/strings/getImageUriInformation';

describe('getImageUriInformation', () => {
	it('should extract file information from a URI', () => {
		const uri = 'https://example.com/images/photo.jpg';
		const result = getImageUriInformation(uri);

		expect(result).toEqual({
			fileType: 'image/jpg',
			fileName: 'photo.jpg',
		});
	});

	it('should handle URIs with complex paths', () => {
		const uri = 'https://example.com/images/subdir/photo.jpg';
		const result = getImageUriInformation(uri);

		expect(result).toEqual({
			fileType: 'image/jpg',
			fileName: 'photo.jpg',
		});
	});

	it('should handle URIs with multiple dots in the filename', () => {
		const uri = 'https://example.com/images/photo.name.jpg';
		const result = getImageUriInformation(uri);

		expect(result).toEqual({
			fileType: 'image/jpg',
			fileName: 'photo.name.jpg',
		});
	});
});
