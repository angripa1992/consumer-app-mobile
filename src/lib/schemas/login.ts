import { z } from 'zod';

export const waitListFormValidationSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'emailCannotEmpty' })
		.email({ message: 'invalidEmail' }),
	country: z.string().min(1, { message: 'countryCannotEmpty' }),
});

export const loginFormValuesSchema = z.object({
	email: z
		.string()
		.toLowerCase()
		.trim()
		.min(1, { message: 'emailCannotEmpty' })
		.email({ message: 'invalidEmail' }),
	password: z.string().trim().nonempty({ message: 'passwordCannotEmpty' }),
});

export const signUpFormValuesSchema = z.object({
	email: z
		.string()
		.toLowerCase()
		.trim()
		.min(1, { message: 'emailCannotEmpty' })
		.email({ message: 'invalidEmail' }),
	password: z.string().trim().min(8, { message: 'passwordMustBeAtLeast' }),
	name: z.string().toLowerCase().trim().min(1, { message: 'nameCannotEmpty' }),
	city: z.string().min(1, { message: 'cityCannotEmpty' }),
});

export const forgetPasswordFormValidationSchema = z.object({
	email: z
		.string()
		.toLowerCase()
		.trim()
		.min(1, { message: 'emailCannotEmpty' })
		.email({ message: 'invalidEmail' }),
});
