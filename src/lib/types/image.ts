import { z } from 'zod';
import { imageFileSchema } from '../schemas/image';

export type TypeImageFile = z.infer<typeof imageFileSchema>;
