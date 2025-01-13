export const randomNumber = (
	min: number,
	max: number,
	excludedNumbers?: number[],
) => {
	let randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
	if (excludedNumbers && excludedNumbers?.length < max) {
		let isRepeatNumber = false;
		do {
			isRepeatNumber = excludedNumbers.some((n) => n === randomValue);
			if (isRepeatNumber) {
				randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
			}
		} while (isRepeatNumber);
	}

	return randomValue;
};

export const randomString = (length: number) => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}
	return result;
};
