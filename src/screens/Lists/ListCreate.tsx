import { View } from 'react-native';
import { SubmitHandler } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import InputForm from '@/UI/atoms/input/InputForm';
import MultiSelectModalForm from '@/UI/atoms/select/MultiSelectModalForm';
import SelectForm from '@/UI/atoms/select/SelectForm';

import { i18nInstance } from 'config/i18n';

import MainLayout from '@/UI/layouts/MainLayout';
import useCreateList from '@/lib/hooks/useCreateList';
import CreateListHeader from '@/UI/molecules/createList/CreateListHeader';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import TextElement from '@/UI/atoms/text/TextElement';
import SwitchInput from '@/UI/atoms/switch/SwitchInput';

import type {
	TypeAddSpotFromDBToSpotList,
	TypeAddSpotFromGooglePlacesToSpotList,
	TypeCreateSpotList,
} from '@/lib/types/spotList';
import type { TypeAddSpotToSpotListEvent } from '@/lib/types/spot';
import type {
	ListCreateScreenRouteParams,
	NavigationProps,
} from '@/lib/types/tabScreenParams';

const ListCreateScreen = ({ route }: ListCreateScreenRouteParams) => {
	const toast = useToast();

	const {
		user,
		control,
		errors,
		handleSubmit,
		tagOptions,
		cityValue,
		cityOptions,
		citySelectRef,
		createSpotList,
		addSpotToSpotList,
		isFormDirty,
		resetForm,
		isLoading,
	} = useCreateList({});

	const navigationToProfile = useNavigation<NavigationProps>();

	const spotType = route.params?.spotType;
	const spotName = route.params?.spotName;

	const redirectOnFinishCreate = (spotListId: number, spotListName: string) => {
		toast.show(
			`${i18nInstance.t('listCreatedSuccessfully', {
				spotListName: spotListName,
			})}`,
			{
				type: 'success',
			},
		);
		navigationToProfile.navigate('Profile', {
			screen: 'MyProfileScreen',
		});
		navigationToProfile.navigate('Profile', {
			screen: 'SingleList',
			params: {
				spotListId,
			},
		});
	};

	const onSubmit: SubmitHandler<TypeCreateSpotList> = (
		data: TypeCreateSpotList,
	) => {
		if (!user) return;

		const spotList = {
			...data,
			user_id: user.id,
		};

		createSpotList(spotList).then(async (response) => {
			if (response) {
				const { spot_list } = response;
				const spotListId = spot_list.id;
				const spotListName = spot_list.name;

				if (spotType && spotName) {
					if (spotType === 'db') {
						const { prevSpotIdToAdd } = route.params;
						const dataToAddSpotToList: TypeAddSpotFromDBToSpotList = {
							spot_id: prevSpotIdToAdd,
							spot_list_id: response.spot_list.id,
							spotType: 'db',
						};

						const dataAddSpotEvent: TypeAddSpotToSpotListEvent = {
							spot_id: prevSpotIdToAdd,
							spot_list_id: response.spot_list.id,
							spot_name: spotName,
						};

						await addSpotToSpotList({
							values: dataToAddSpotToList,
							dataAddSpotEvent,
						});

						redirectOnFinishCreate(spotListId, spotListName);

						return;
					}
					if (spotType === 'googlePlace') {
						const { prevCandidateData } = route.params;
						const { id, google_place_location_id, ...restCandidateData } =
							prevCandidateData;
						const dataToAddSpotToList: TypeAddSpotFromGooglePlacesToSpotList = {
							spot_id: null,
							spot_list_id: response.spot_list.id,
							spotType: 'googlePlaces',
							google_place_location_id: google_place_location_id as string,
							...restCandidateData,
						};

						const dataAddSpotEvent: TypeAddSpotToSpotListEvent = {
							spot_id: google_place_location_id,
							spot_list_id: response.spot_list.id,
							spot_name: spotName,
						};

						await addSpotToSpotList({
							values: dataToAddSpotToList,
							dataAddSpotEvent,
						});

						redirectOnFinishCreate(spotListId, spotListName);
						return;
					}
				}

				redirectOnFinishCreate(spotListId, spotListName);
			}
		});
	};

	return (
		<>
			<CreateListHeader
				viewType='create'
				isFormDirty={isFormDirty}
				resetForm={resetForm}
			/>
			<MainLayout
				isDismissKeyboardActive={false}
				isKeyAvoidingView={false}
				hasBgTexture={true}
			>
				{isLoading ? (
					<SpinnerCup />
				) : (
					<>
						<TextElement fontFamily='pachang' designVariation='main-title'>
							{i18nInstance.t('create')}
						</TextElement>
						<KeyboardAwareScrollView
							extraHeight={110}
							showsVerticalScrollIndicator={false}
						>
							<View className='mb-3 mt-6 w-full'>
								<InputForm
									control={control}
									name='name'
									label={i18nInstance.t('listName')}
									error={errors.name}
									testID='input-list-name'
								/>
								<TextElement textStyles='text-neutral-gray mt-2'>
									{i18nInstance.t('weRecommendUsingCharactersPerLine')}
								</TextElement>
							</View>
							<View className={`my-3 w-full `}>
								<SelectForm
									options={cityOptions}
									control={control}
									name='city'
									label={i18nInstance.t('city')}
									containerStyles='w-full'
									error={errors.city}
									editValue={cityValue ?? undefined}
									selectRef={citySelectRef}
									testID='select-city'
									defaultValue={i18nInstance.t('selectCity')}
								/>
							</View>
							<View className='my-3 w-full'>
								<MultiSelectModalForm
									control={control}
									options={tagOptions}
									name='tags'
									label={i18nInstance.t('tags')}
									error={errors.tags}
									placeholder={i18nInstance.t('addTags')}
									clearItemsText={i18nInstance.t('clearTags')}
								/>
							</View>
							<View className='my-3 w-full'>
								<InputForm
									control={control}
									name='description'
									label={i18nInstance.t('listDescription')}
									error={errors.description}
									inputStyles='flex h-[120px] py-2 align-text-top'
									multiline
									testID='input-list-description'
								/>
							</View>
							<SwitchInput
								label={i18nInstance.t('listPrivacy')}
								control={control}
								name='is_private'
								error={errors.is_private}
								activeText={i18nInstance.t('private')}
								inactiveText={i18nInstance.t('notPrivate')}
								containerStyles='mt-3'
							/>
							<ButtonPrimary
								onPress={handleSubmit(onSubmit)}
								buttonStyles='w-full mt-10 mb-10'
								textStyles='mt-1'
								testID='button-save-list'
								disabled={isLoading}
							>
								{i18nInstance.t('save')}
							</ButtonPrimary>
						</KeyboardAwareScrollView>
					</>
				)}
			</MainLayout>
		</>
	);
};

export default ListCreateScreen;
