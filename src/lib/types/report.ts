import { z } from 'zod';
import {
	reportReasonTypeSchema,
	reportTypeEnum,
	createReportValuesSchema,
} from '../schemas/report';

export type TypeReportReason = z.infer<typeof reportReasonTypeSchema>;

export type TypeSubmitReport = {
	motivation: string;
};

export type TypeBackendReport = z.infer<typeof reportTypeEnum>;

export type TypeCreateReport = z.infer<typeof createReportValuesSchema>;

export type TypeEntityReport = 'spot' | 'profile' | 'list' | 'scribble';
