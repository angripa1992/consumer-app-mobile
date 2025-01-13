import { z } from 'zod';
import {
	waitListFormValidationSchema,
	forgetPasswordFormValidationSchema,
	loginFormValuesSchema,
	signUpFormValuesSchema,
} from '../schemas/login';

export type TypeWaitListForm = z.infer<typeof waitListFormValidationSchema>;

export type TypeWaitListFormView =
	| 'form'
	| 'sent'
	| 'login'
	| 'signup'
	| 'forgotPassword';

export type TypeLoginFormView = 'login' | 'signup';

export type TypeLoginForm = z.infer<typeof loginFormValuesSchema>;

export type TypeSignUpFormValuesSchema = z.infer<typeof signUpFormValuesSchema>;

export type TypeForgetPasswordForm = z.infer<
	typeof forgetPasswordFormValidationSchema
>;
