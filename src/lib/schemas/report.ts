import { z } from 'zod';

export const reportTypeEnum = z.enum([
	'user',
	'spot_list',
	'spot',
	'spot_scribble_added',
]);

export const reportReasonTypeSchema = z.object({
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	reason_type: z.string(),
	updated_at: z.string(),
});

export const reportReasonTypeResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	report_reason_types: z.array(reportReasonTypeSchema),
});

export const createReportResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	report: z.object({
		created_at: z.string(),
		id: z.number(),
		is_deleted: z.boolean(),
		motivation: z.string(),
		report_reason_type_id: z.number(),
		report_type: reportTypeEnum,
		reported_id: z.number(),
		updated_at: z.string(),
		user_reporter_id: z.number(),
	}),
});

export const createReportValuesSchema = z.object({
	report_reason_type_id: z.number(),
	report_type: reportTypeEnum,
	user_reporter_id: z.number(),
	reported_id: z.number(),
	motivation: z.string(),
});

export const motivationFormReportValidations = z.object({
	motivation: z.string().nonempty('motivationsCannotEmpty'),
});
