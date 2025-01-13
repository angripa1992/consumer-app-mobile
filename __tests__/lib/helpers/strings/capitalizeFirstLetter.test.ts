import { capitalizeFirstLetter } from "@/lib/helpers/strings/capitalizeFirstLetter";

describe('capitalizeFirstLetter', () => {

    it('should capitalize the first letter of a word', () => {
        expect(capitalizeFirstLetter('hello')).toBe('Hello');
    });

    it('should not change a word that already has the first letter capitalized', () => {
        expect(capitalizeFirstLetter('Hello')).toBe('Hello');
    });

    it('should handle an empty string', () => {
        expect(capitalizeFirstLetter('')).toBe('');
    });

    it('should handle a single lowercase letter', () => {
        expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('should handle a single uppercase letter', () => {
        expect(capitalizeFirstLetter('A')).toBe('A');
    });

    it('should only capitalize the first letter and leave the rest unchanged', () => {
        expect(capitalizeFirstLetter('hELLO')).toBe('HELLO');
    });

    it('should handle non-alphabetic characters at the start', () => {
        expect(capitalizeFirstLetter('1hello')).toBe('1hello');
    });

    it('should handle whitespace at the beginning', () => {
        expect(capitalizeFirstLetter(' hello')).toBe(' hello');
    });

});