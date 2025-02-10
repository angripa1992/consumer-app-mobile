import { z } from 'zod';

import { personPlaySchema } from '../schemas/play';
import { discoveryFilterFormSchema } from '../schemas/discovery';
import { TypeQueriesMutateDestination } from './queries';


export type TypeDiscoveryTabOption =
    | 'user'


export type TypePlayCard<T> = {
	item: T;
	index: number;
	containerStyles?: string;
};

export type TypePersonFromPlay = z.infer<typeof personPlaySchema>;

export type TypePlayCardWithCategory<T> = TypePlayCard<T> & {
    categoryName: string; 
};

export type TypePlayPersonCard =
    TypePlayCardWithCategory<TypePersonFromPlay> & {
        queryMutateDestination: TypeQueriesMutateDestination;
        isSmallVariant?: boolean;
    };
