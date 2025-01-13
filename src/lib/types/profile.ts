import { z } from 'zod';
import { putUserValidationsSchema } from '../schemas/user';

export type TypeProfileListFilterValue = 'list' | 'followed' | 'spots' | 'scribbles';

export type TypeFollowListFilter = 'followers' | 'following';
export type TypeProfileForm = z.infer<typeof putUserValidationsSchema>;

export type TypeProfileFormPassword = {
	oldPassword: string;
	newPassword: string;
};

export type TypeProfileTab = 'profile' | 'password';

export type TypeProfileListFilter = {
	name: string;
	value: TypeProfileListFilterValue;
};

export type TypePutProfileRequest = {
	username?: string;
	name: string;
	country: string | null;
	city: string | null;
	website_users: string;
	biography: string | null;
	tarot_code: string | null;
	profile_image_url?: {
		uri: string;
		type: string;
		name: string;
	};
};

export type TypeEditProfileTab = 'profile' | 'qr-card';
