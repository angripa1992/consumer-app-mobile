import { useGetAllActiveCities } from '@/lib/hooks/useQueryCities';
import { usePostSpotList, usePutSpotList } from '@/lib/hooks/useQuerySpotList';
import { useGetTags } from '@/lib/hooks/useQueryTags';
import { createSpotListSchema } from '@/lib/schemas/spotList';
import { useAppStore } from '@/lib/store/store';
import { TypeCreateSpotList } from '@/lib/types/spotList';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';

import { usePostSpotToSpotList } from '@/lib/hooks/useQuerySpotSpot';
import { PartialOptional } from '../types/partialOptional';
import { useShallow } from 'zustand/react/shallow';
import { i18nInstance } from 'config/i18n';
import { convertStringToLowerCaseWithoutSpaces } from '../helpers/translations/convertStringToLowerCaseWithoutSpaces';

interface UseCreateListProps {
	defaultValues?: PartialOptional<TypeCreateSpotList, 'tags'> & {
		tagsLabels: string[];
	};
	spotListId?: number;
}

const useCreateList = ({ defaultValues, spotListId }: UseCreateListProps) => {
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);
	const { tags } = useGetTags();
	const { allActiveCities } = useGetAllActiveCities();

	const { mutateAsync: createSpotList, isLoading: isSpotListCreating } =
		usePostSpotList();
	const { mutateAsync: addSpotToSpotList, isLoading: isAddingSpot } =
		usePostSpotToSpotList({ queryMutateDestination: 'spotList' });

	const { mutateAsync: updateSpotList, isLoading: isUpdatingList } =
		usePutSpotList(spotListId);

	const tagOptions =
		tags?.map((tag) => ({
			label: i18nInstance.t(convertStringToLowerCaseWithoutSpaces(tag.name)),
			value: tag.id,
		})) ?? [];

	const defaultNumberTags =
		tagOptions
			.filter((tag) => defaultValues?.tagsLabels.includes(tag.label))
			.map((tag) => tag.value) ?? [];

	const {
		control,
		handleSubmit,
		formState: { errors, defaultValues: defaultFormValues, isDirty },
		watch,
		reset,
		setValue,
		clearErrors,
	} = useForm<TypeCreateSpotList>({
		resolver: zodResolver(createSpotListSchema),
		defaultValues: {
			tags: defaultNumberTags,
			description: defaultValues?.description ?? '',
			city: defaultValues?.city ?? '',
			name: defaultValues?.name ?? '',
			is_private: defaultValues?.is_private ?? 0,
		},
	});

	const cityOptions = useMemo(
		() =>
			allActiveCities?.map((singleCity) => {
				return {
					label: singleCity.name,
					value: singleCity.name,
				};
			}) ?? [],
		[allActiveCities],
	);
	const cityValue = watch('city');
	const citySelectRef = useRef<SelectDropdown>(null);

	const isLoading = isSpotListCreating || isAddingSpot;

	const resetForm = () => {
		reset();
		citySelectRef.current?.reset();
	};

	useEffect(() => {
		if (cityOptions && cityOptions.length > 0) {
			clearErrors('city');
			const findCityIndex = cityOptions.findIndex(
				(cityOption) => cityOption.value === defaultValues?.city,
			);
			const cityIndex = findCityIndex !== -1 ? findCityIndex : 0;
			setValue('city', cityOptions[cityIndex].value);
		}
	}, [cityOptions]);

	return {
		user,
		control,
		resetForm,
		errors,
		handleSubmit,
		tagOptions,
		cityValue,
		cityOptions,
		citySelectRef,
		isLoading,
		createSpotList,
		addSpotToSpotList,
		updateSpotList,
		isUpdatingList,
		defaultFormValues: defaultFormValues as TypeCreateSpotList,
		isFormDirty: isDirty,
	};
};

export default useCreateList;
