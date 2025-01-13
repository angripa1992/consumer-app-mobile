import { z } from 'zod';

export const orderSupplierSchema = z.object({
	color: z.string(),
	created_at: z.string(),
	icon: z.string().nullable(),
	id: z.number(),
	is_deleted: z.boolean(),
	name: z.string(),
	updated_at: z.string(),
});

export const orderSupplierResponseSchema = z.object({
	code: z.number(),
	message: z.string(),
	order_suppliers: z.array(orderSupplierSchema),
});
