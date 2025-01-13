import { isPhoneNumber } from './isPhoneNumber';

const isValidUrlRegexTest = (urlToTest: string) => {
	const urlRegex =
		/((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
	return urlRegex.test(urlToTest);
};

export const isValidUrl = async (url: string) => {
	const isUrlPhone = isPhoneNumber(url);
	if (isUrlPhone) return true;

	const isValidRegex = isValidUrlRegexTest(url);

	return isValidRegex;
};
