export const spotsFilterInitialValues = {
	country: '',
	city: '',
	spot: '',
	tags: [],
};

export const singleListFilterInitialValues = {
	country: '',
	city: '',
	spot: '',
	tags: [],
	status_tags: [],
};

const step = 0.5;
const count = 11;

export const spotRatingOptions = Array.from({ length: count }, (_, index) => {
	const value = index * step;
	return value.toString();
});
