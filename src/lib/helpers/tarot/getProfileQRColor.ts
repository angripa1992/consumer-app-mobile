import { getTarotTexture } from './getTarotTexture';

export const getProfileQRColor = (tarotCode: string) => {
	const textureColor = getTarotTexture(tarotCode);

	if (textureColor === 'blue') {
		return '#69E3E4';
	}
	if (textureColor === 'green') {
		return '#B0FD9C';
	}
	if (textureColor === 'purple') {
		return '#D02DE0';
	}
	if (textureColor === 'pink') {
		return '#AB76DD';
	}
};
