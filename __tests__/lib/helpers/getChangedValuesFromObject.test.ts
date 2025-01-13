import { getChangedValuesFromObject } from '@/lib/helpers/getChangedValuesFromObject';

describe('getChangedValuesFromObject', () => {
	it('should return an empty object if the original and updated objects are the same', () => {
		const originalPerson = {
			name: 'John Doe',
			age: 35,
			email: 'john.doe@example.com',
		};
		const updatedPerson = {
			name: 'John Doe',
			age: 35,
			email: 'john.doe@example.com',
		};

		const changedValues = getChangedValuesFromObject(
			originalPerson,
			updatedPerson,
		);
		expect(changedValues).toEqual({});
	});

	it('should return an object with the changed values', () => {
		const originalPerson = {
			name: 'John Doe',
			age: 35,
			email: 'john.doe@example.com',
		};
		const updatedPerson = {
			name: 'John Doe',
			age: 36,
			email: 'john.doe@example.com',
		};

		const changedValues = getChangedValuesFromObject(
			originalPerson,
			updatedPerson,
		);
		expect(changedValues).toEqual({ age: 36 });
	});

	it('should throw an error if the object keys do not match', () => {
		const originalPerson = {
			name: 'John Doe',
			age: 35,
			email: 'john.doe@example.com',
		};
		const updatedPerson = {
			name: 'John Doe',
			age: 36,
		};

		expect(() =>
			getChangedValuesFromObject(originalPerson, updatedPerson),
		).toThrowError('Object keys do not match');
	});
});
