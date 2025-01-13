import * as Linking from 'expo-linking';
import { Toast } from 'react-native-toast-notifications';

import { handleLinkPress } from '@/lib/helpers/handleLinkPress';
import { isEmail } from '@/lib/helpers/strings/isEmail';
import { isPhoneNumber } from '@/lib/helpers/isPhoneNumber';

jest.mock('expo-linking', () => ({
	openURL: jest.fn(),
}));

jest.mock('react-native-toast-notifications', () => ({
	Toast: {
		show: jest.fn(),
	},
}));

jest.mock('../../../src/lib/helpers/isPhoneNumber', () => ({
	isPhoneNumber: jest.fn(),
}));

jest.mock('../../../src/lib/helpers/strings/isEmail', () => ({
	isEmail: jest.fn(),
}));

const mockIsPhoneNumber = isPhoneNumber as jest.MockedFunction<
	typeof isPhoneNumber
>;
const mockIsEmail = isEmail as jest.MockedFunction<typeof isEmail>;

describe('handleLinkPress', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('returns early if url is falsy', async () => {
		await handleLinkPress(null);
		expect(Linking.openURL).not.toHaveBeenCalled();
		expect(Toast.show).not.toHaveBeenCalled();
	});

	test('opens regular URL', async () => {
		const url = 'https://example.com';
		await handleLinkPress(url);
		expect(Linking.openURL).toHaveBeenCalledWith(url);
		expect(Toast.show).not.toHaveBeenCalled();
	});

	test('opens phone number URL', async () => {
		const phoneNumber = '123 456 7890';
		const formattedPhoneNumber = '1234567890';
		mockIsPhoneNumber.mockReturnValueOnce(true);
		await handleLinkPress(phoneNumber);
		expect(isPhoneNumber).toHaveBeenCalledWith(phoneNumber);
		expect(Linking.openURL).toHaveBeenCalledWith(`tel:${formattedPhoneNumber}`);
		expect(Toast.show).not.toHaveBeenCalled();
	});

	test('opens email URL', async () => {
		const email = 'user@example.com';
		mockIsEmail.mockReturnValueOnce(true);
		await handleLinkPress(email);
		expect(isEmail).toHaveBeenCalledWith(email);
		expect(Linking.openURL).toHaveBeenCalledWith(`mailto:${email}`);
		expect(Toast.show).not.toHaveBeenCalled();
	});
});
