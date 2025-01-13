import { z } from 'zod';

export const tarotShapesEnum = z.enum([
	'Asterisk',
	'Circle',
	'Diamond',
	'Love Heart',
	'Splatter',
]);

export const emojiTarotFormSchema = z.object({
	code: z.string(),
	slug: z.string(),
});

export const emojiToUpdateTarotSchema = z.object({
	tarot_emoji_id: z.number().nullable(),
	code: z.string(),
	slug: z.string().optional(),
});

export const tarotCardFormSchema = z.object({
	show_avatar: z.boolean().optional(),
	show_name: z.boolean().optional(),
	shape: tarotShapesEnum.nullable().optional(),
	emoji_one: emojiTarotFormSchema.nullable().optional(),
	emoji_two: emojiTarotFormSchema.nullable().optional(),
	emoji_three: emojiTarotFormSchema.nullable().optional(),
});

export const updateTarotCardValuesSchema = z.object({
	show_avatar: z.boolean().optional(),
	show_name: z.boolean().optional(),
	tarot_shape_id: z.number().optional(),
	emojis: z.array(emojiToUpdateTarotSchema).optional(),
});

export const singleTarotShapeSchema = z.object({
	id: z.number(),
	name: z.string(),
});

export const getAllTarotShapesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	tarot_shapes: z.array(singleTarotShapeSchema),
});

export const singleTarotCodeSchema = z.object({
	avatar_picture: z.string(),
	created_at: z.string(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	tarot_color: z.array(z.string()),
	tarot_color_id: z.number(),
	updated_at: z.string(),
	code: z.string(),
});

export const getAllTarotCodesResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	tarot_codes: z.array(singleTarotCodeSchema),
});

export const singleTarotEmojiSchema = z.object({
	code: z.string(),
	slug: z.string().nullable(),
	tarot_emoji_id: z.number().nullable(),
	order: z.number(),
});

export const singleTarotUserSchema = z.object({
	avatar: z.string(),
	created_at: z.string(),
	emojis: z.array(singleTarotEmojiSchema.optional()),
	id: z.number(),
	is_deleted: z.boolean(),
	shape: tarotShapesEnum,
	show_avatar: z.boolean(),
	show_name: z.boolean(),
	tarot_code: z.string(),
	tarot_code_id: z.number(),
	tarot_code_name: z.string(),
	tarot_color: z.array(z.string()),
	updated_at: z.string(),
	user_id: z.number(),
	username: z.string(),
	user_name: z.string(),
	profile_image: z.string().nullable(),
});

export const getSingleTarotUserResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	tarot_user: singleTarotUserSchema,
});
