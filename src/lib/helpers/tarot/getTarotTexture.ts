export const getTarotTexture = (tarotCode: string) => {
	if (
		tarotCode === 'OAHB' ||
		tarotCode === 'OAHI' ||
		tarotCode === 'OALB' ||
		tarotCode === 'OALI'
	) {
		return 'blue';
	}
	if (
		tarotCode === 'OPHB' ||
		tarotCode === 'OPHI' ||
		tarotCode === 'OPLB' ||
		tarotCode === 'OPLI'
	) {
		return 'green';
	}
	if (
		tarotCode === 'SAHB' ||
		tarotCode === 'SAHI' ||
		tarotCode === 'SALB' ||
		tarotCode === 'SALI'
	) {
		return 'purple';
	}
	if (
		tarotCode === 'SPHB' ||
		tarotCode === 'SPHI' ||
		tarotCode === 'SPLB' ||
		tarotCode === 'SPLI'
	) {
		return 'pink';
	}

	return 'pink';
};
