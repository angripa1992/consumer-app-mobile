import { z } from 'zod';

export const userSingleWaitListSchema = z.object({
	created_at: z.string(),
	email: z.string(),
	id: z.number(),
	is_approved: z.boolean(),
	is_deleted: z.boolean(),
	updated_at: z.string(),
	user_id: z.number().nullable(),
});

export const postUserSingleWaitListResponseSchema = z.object({
	authorized_user: userSingleWaitListSchema,
	code: z.number(),
	message: z.string(),
});

export const checkWaitListCodeFormSchema = z.object({
	email: z.string(),
	code: z.string({ required_error: 'codeIsRequired' }).trim(),
});

export const getCodeToInviteFormSchema = z.object({
	email: z.string(),
});

export const getGuestUsersFormSchema = getCodeToInviteFormSchema;

export const verifyAuthorizedUserValuesSchema = getCodeToInviteFormSchema;

export const postAuthReferralCodeResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	referral_code: z.string(),
});

export const postCheckReferralCodeResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
});

export const postGetCodeToInviteResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	authorized_user_code: z.string(),
});

export const postGetGuestUsersResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	guest_user_counter: z.number(),
});

export const postVerifyAuthorizedUserResponseSchema = z.object({
	code: z.number(),
	is_approved: z.boolean(),
});

export const postWaitListTarotQuizResponseSchema = z.object({
	tarot_code: z.string({ required_error: 'codeIsRequired' }).trim(),
});

export const postTarotQuizCodeResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	status: z.string().optional(),
});
