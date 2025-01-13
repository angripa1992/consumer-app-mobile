import { RefObject, useEffect, useMemo, useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SubmitHandler, useForm } from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';
import { View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePostAuthorizedSpot } from '@/lib/hooks/UseQuerySpot';
import { useGetCities } from '@/lib/hooks/useQueryCities';
import { createBasicSpotFormSchema } from '@/lib/schemas/spot';
import { i18nInstance } from 'config/i18n';

import CustomBottomSheetModal from '../../modal/CustomBottonSheet';
import TextElement from '@/UI/atoms/text/TextElement';
import InputForm from '@/UI/atoms/input/InputForm';
import SelectForm from '@/UI/atoms/select/SelectForm';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';

import type { TypeCreateBasicSpotForm } from '@/lib/types/spot';

type TypeSuggestSpotModalProps = {
	suggestSpotModalRef: RefObject<BottomSheetModal>;
	city: string;
};

const SuggestSpotModal = ({
	suggestSpotModalRef,
	city,
}: TypeSuggestSpotModalProps) => {
	const { mutateAsync, isLoading } = usePostAuthorizedSpot();
	const { cities } = useGetCities();

	const citySelectRef = useRef<SelectDropdown>(null);

	const {
		control,
		handleSubmit,
		watch,
		clearErrors,
		setValue,
		formState: { errors, defaultValues },
	} = useForm<TypeCreateBasicSpotForm>({
		resolver: zodResolver(createBasicSpotFormSchema),
		defaultValues: {
			city,
		},
	});

	const cityValue = watch('city');
	const cityOptions = useMemo(
		() =>
			cities?.map((singleCity) => {
				return {
					label: singleCity.name,
					value: singleCity.name,
				};
			}) ?? [],
		[cities],
	);

	const snapPoints = ['70%'];

	const onSubmit: SubmitHandler<TypeCreateBasicSpotForm> = async (data) => {
		const cityId = cities?.find((city) => cityValue === city.name)?.id;

		if (!cityId) return;

		await mutateAsync({
			name: data.name,
			city_id: cityId,
			spot_status: 'new',
		});

		setValue('name', '');
		suggestSpotModalRef.current?.close();
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

	return (
		<CustomBottomSheetModal
			snapPoints={snapPoints}
			bottomSheetModalRef={suggestSpotModalRef}
		>
			<TextElement textStyles='text-light-white text-xl mb-3 font-medium'>
				{i18nInstance.t('suggestSpot')}
			</TextElement>
			{isLoading ? (
				<SpinnerCup />
			) : (
				<>
					<TextElement textStyles='text-sm text-gray mb-5'>
						{i18nInstance.t('createSpotText')}
					</TextElement>
					<TextElement textStyles='text-light-white text-xl mb-3 font-medium'>
						{i18nInstance.t('spotInformation')}
					</TextElement>
					<InputForm
						control={control}
						name='name'
						label='Name'
						error={errors.name}
						testID='input-spot-name'
					/>
					<SelectForm
						options={cityOptions}
						control={control}
						name='city'
						label='City'
						containerStyles='w-full mt-5'
						error={errors.city}
						editValue={cityValue ?? undefined}
						selectRef={citySelectRef}
						testID='select-city'
						defaultValue='Select City'
					/>
					<View className='flex flex-row justify-between mt-14'>
						<ButtonPrimary
							onPress={() => {
								setValue('name', '');
								suggestSpotModalRef.current?.close();
							}}
							buttonStyles='w-[47%]'
							textStyles='mt-1 font-medium text-xs'
							testID='button-submit-spot'
							designVariation={'white-transparent'}
						>
							{i18nInstance.t('back')}
						</ButtonPrimary>
						<ButtonPrimary
							onPress={handleSubmit(onSubmit)}
							buttonStyles='w-[47%]'
							textStyles='mt-1 font-medium text-xs'
							testID='button-submit-spot'
							designVariation='green'
						>
							{i18nInstance.t('submit')}
						</ButtonPrimary>
					</View>
				</>
			)}
		</CustomBottomSheetModal>
	);
};

export default SuggestSpotModal;
