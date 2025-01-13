import { z } from 'zod';
import {
	checkWaitListCodeFormSchema,
	getCodeToInviteFormSchema,
	getGuestUsersFormSchema,
	postWaitListTarotQuizResponseSchema,
	verifyAuthorizedUserValuesSchema,
} from '../schemas/waitList';

export type TypePostWaitListUserValues = {
	email: string;
};

export type TypeCheckWaitListCodeForm = z.infer<
	typeof checkWaitListCodeFormSchema
>;

export type TypeGetCodeToInviteForm = z.infer<typeof getCodeToInviteFormSchema>;

export type TypeGetGuestUsersForm = z.infer<typeof getGuestUsersFormSchema>;

export type TypeVerifyAuthorizedUserValues = z.infer<
	typeof verifyAuthorizedUserValuesSchema
>;

export type TypeApproveUserStatus =
	| 'error'
	| 'not found'
	| 'not approved'
	| 'loading'
	| 'approved';

export type TypePostWaitListTarotCodes = z.infer<
	typeof postWaitListTarotQuizResponseSchema
>;

export type TypePostBodyTasteTarotQuizCode = {
	email: string;
	code: string;
};
