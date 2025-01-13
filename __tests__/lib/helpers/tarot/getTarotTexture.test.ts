import { getTarotTexture } from '@/lib/helpers/tarot/getTarotTexture';

describe('getTarotTexture', () => {
	it('returns blue for OAHB, OAHI, OALB, OALI codes', () => {
		expect(getTarotTexture('OAHB')).toBe('blue');
		expect(getTarotTexture('OAHI')).toBe('blue');
		expect(getTarotTexture('OALB')).toBe('blue');
		expect(getTarotTexture('OALI')).toBe('blue');
	});

	it('returns green for OPHB, OPHI, OPLB, OPLI codes', () => {
		expect(getTarotTexture('OPHB')).toBe('green');
		expect(getTarotTexture('OPHI')).toBe('green');
		expect(getTarotTexture('OPLB')).toBe('green');
		expect(getTarotTexture('OPLI')).toBe('green');
	});

	it('returns purple for SAHB, SAHI, SALB, SALI codes', () => {
		expect(getTarotTexture('SAHB')).toBe('purple');
		expect(getTarotTexture('SAHI')).toBe('purple');
		expect(getTarotTexture('SALB')).toBe('purple');
		expect(getTarotTexture('SALI')).toBe('purple');
	});

	it('returns pink for SPHB, SPHI, SPLB, SPLI codes', () => {
		expect(getTarotTexture('SPHB')).toBe('pink');
		expect(getTarotTexture('SPHI')).toBe('pink');
		expect(getTarotTexture('SPLB')).toBe('pink');
		expect(getTarotTexture('SPLI')).toBe('pink');
	});

	it('returns pink for any other codes', () => {
		expect(getTarotTexture('UNKNOWN')).toBe('pink');
	});
});
