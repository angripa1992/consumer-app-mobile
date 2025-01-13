import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import InputForm from '@/UI/atoms/input/InputForm';
import SelectForm from '@/UI/atoms/select/SelectForm';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import TextElement from '@/UI/atoms/text/TextElement';
import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import MainLayout from '@/UI/layouts/MainLayout';
import ConfirmModal from '@/UI/organism/modal/ConfirmModal';
import { usePostAuthorizedSpot } from '@/lib/hooks/UseQuerySpot';
import { useGetCities } from '@/lib/hooks/useQueryCities';
import { useGetCountries } from '@/lib/hooks/useQueryCountries';
import { createBasicSpotFormSchema } from '@/lib/schemas/spot';
import { TypeCreateBasicSpotForm } from '@/lib/types/spot';
import {
	CreateBasicSpotScreenRouteParams,
	DiscoveryScreenNavigationProp,
} from '@/lib/types/tabScreenParams';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { BackHandler } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';

const CreateBasicSpot = ({
	route,
	navigation,
}: CreateBasicSpotScreenRouteParams) => {
	const { city, country } = route.params;
	const { cities } = useGetCities();
	const { countries } = useGetCountries();
	const navigationDiscovery = useNavigation<DiscoveryScreenNavigationProp>();

	const { mutateAsync, isLoading } = usePostAuthorizedSpot();
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const citySelectRef = useRef<SelectDropdown>(null);

	const {
		control,
		handleSubmit,
		watch,
		clearErrors,
		setValue,
		formState: { errors, isDirty, defaultValues },
	} = useForm<TypeCreateBasicSpotForm>({
		resolver: zodResolver(createBasicSpotFormSchema),
		defaultValues: {
			city,
			country,
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

	const onSubmit: SubmitHandler<TypeCreateBasicSpotForm> = async (data) => {
		const cityId = cities?.find((city) => cityValue === city.name)?.id;

		if (!cityId) return;

		await mutateAsync({
			name: data.name,
			city_id: cityId,
			spot_status: 'new',
		});

		navigationDiscovery.navigate('DiscoveryScreen');
	};

	const onPressGoBack = () => {
		if (isDirty) {
			setShowConfirmModal(true);
			return;
		}

		navigation.goBack();
	};

	const onConfirmGoBack = () => {
		setShowConfirmModal(false);
		navigation.goBack();
	};

	useEffect(() => {
		const backAction = () => {
			onPressGoBack();
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, []);

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
		<>
			<HeaderGoBack title='Add Spot' redirect={onPressGoBack} />
			<MainLayout isDismissKeyboardActive={false} isKeyAvoidingView={false}>
				{isLoading ? (
					<SpinnerCup />
				) : (
					<>
						<TextElement textStyles='text-sm text-gray mb-5'>
							Please help us keep klikit up to date. Enter the name of the spot
							for our team to add it to the app or add additional details to
							help us approve it faster.
						</TextElement>
						<TextElement textStyles='text-light-white text-xl mb-3 font-medium'>
							Spot Information
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
							containerStyles='w-full'
							error={errors.city}
							editValue={cityValue ?? undefined}
							selectRef={citySelectRef}
							testID='select-city'
							defaultValue='Select City'
						/>
						<ButtonPrimary
							onPress={handleSubmit(onSubmit)}
							buttonStyles='h-[40px] w-full mt-10'
							textStyles='mt-1'
							testID='button-submit-spot'
						>
							Submit Spot
						</ButtonPrimary>
					</>
				)}
				<ConfirmModal
					showConfirmModal={showConfirmModal}
					setShowConfirmModal={setShowConfirmModal}
					onConfirm={onConfirmGoBack}
					questionText={'Would you like to discard this spot?'}
					confirmButtonText='Discard'
					cancelButtonText='Cancel'
				/>
			</MainLayout>
		</>
	);
};

export default CreateBasicSpot;
