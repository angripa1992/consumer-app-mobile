import { z } from 'zod';
import { followResponseSchema } from '../schemas/follow';
import { UseMutateAsyncFunction } from '@tanstack/react-query';

export type TypeFollow = {
	following_spot_list_id?: number;
	following_user_id?: number;
};

export type TypeResponseFollow = z.infer<typeof followResponseSchema>;

export type TypeUpdateFollowMutation = UseMutateAsyncFunction<
	TypeResponseFollow | null,
	unknown,
	void,
	void
>;

export type ColorFollow = '#B0B0B0' | '#FFFFFF00';
