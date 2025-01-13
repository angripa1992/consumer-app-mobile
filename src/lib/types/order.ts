import { z } from 'zod';
import { orderSupplierSchema } from '../schemas/orderSupplier';

export type TypeOrderSupplier = z.infer<typeof orderSupplierSchema>;
