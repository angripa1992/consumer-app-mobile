import { z } from 'zod';
import {
	userSchema,
	userSignInDecodeTokenSchema,
	userSignInResponseSchema,
	userSignInSchema,
	userFollowerOrFollowingSchema,
	userGetSingleResponseSchema,
	spotListUserSchema,
	userSingleSchema,
	userDataEvent,
	followUsersResponseSchema,
} from '../schemas/user';
import { TypePersonFromDiscovery } from './discovery';

export type TypeUser = z.infer<typeof userSingleSchema>;

export type TypeUserSignIn = z.infer<typeof userSignInSchema>;

export type TypeUserSignInDecodeToken = z.infer<
	typeof userSignInDecodeTokenSchema
>;

export type TypeUserSignInResponse = z.infer<typeof userSignInResponseSchema>;

export type TypeUserSingleResponse = z.infer<
	typeof userGetSingleResponseSchema
>;

export type TypeUserFollowerOrFollowing = z.infer<
	typeof userFollowerOrFollowingSchema
>;

export type TypeSpotListUserSchema = z.infer<typeof spotListUserSchema>;

export type TypeKindOfAuth = 'register' | 'login';

export type TypeSignUpScreens = 'form' | 'contactSoon';

export type TypeCurrentRoute = {
	name: string;
	params: Record<string, string>;
};

export type TypeUserDataEvent = z.infer<typeof userDataEvent>;

export type TypeResponseFollowUsers = z.infer<typeof followUsersResponseSchema>;

export type TypeUserForOptimisticUpdate =
	| TypeUser
	| TypeUserFollowerOrFollowing
	| TypePersonFromDiscovery;

export type TypePlayScreenAnalytics = {
	email: string;
	user_id: number;
}