import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import InputForm from '@/UI/atoms/input/InputForm';
import MultiSelectModalForm from '@/UI/atoms/select/MultiSelectModalForm';
import SelectForm from '@/UI/atoms/select/SelectForm';
import { TypeCreateSpotList } from '@/lib/types/spotList';
import { SubmitHandler } from 'react-hook-form';
import { View } from 'react-native';

import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import MainLayout from '@/UI/layouts/MainLayout';
import useCreateList from '@/lib/hooks/useCreateList';
import {
	ListEditScreenRouteParams,
	NavigationProps,
} from '@/lib/types/tabScreenParams';
import { useNavigation } from '@react-navigation/native';
import CreateListHeader from '@/UI/molecules/createList/CreateListHeader';
import { getChangedValuesFromObject } from '@/lib/helpers/getChangedValuesFromObject';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextElement from '@/UI/atoms/text/TextElement';
import SwitchInput from '@/UI/atoms/switch/SwitchInput';

const ListEditScreen = ({ route }: ListEditScreenRouteParams) => {
	const { spotList } = route.params;

	const {
		user,
		control,
		resetForm,
		errors,
		handleSubmit,
		tagOptions,
		cityValue,
		cityOptions,
		citySelectRef,
		updateSpotList,
		isUpdatingList,
		defaultFormValues,
		isFormDirty,
	} = useCreateList({
		defaultValues: {
			name: spotList.name,
			city: spotList.city,
			description: spotList.description,
			tagsLabels: spotList.tags,
			is_private: spotList.is_private ? 1 : 0,
		},
		spotListId: spotList.id,
	});
	const navigation = useNavigation<NavigationProps>();

	const onSubmit: SubmitHandler<TypeCreateSpotList> = (
		data: TypeCreateSpotList,
	) => {
		if (!defaultFormValues) return;

		const spotListUpdated = getChangedValuesFromObject(defaultFormValues, data);

		if (!user?.id) return;
		resetForm();
		updateSpotList(spotListUpdated).then(() => {
			navigation.goBack();
		});
	};

	return (
		<>
			<CreateListHeader
				viewType='edit'
				isFormDirty={isFormDirty}
				resetForm={resetForm}
			/>
			<MainLayout isDismissKeyboardActive={false} isKeyAvoidingView={false}>
				{isUpdatingList ? (
					<SpinnerCup />
				) : (
					<KeyboardAwareScrollView
						extraHeight={110}
						showsVerticalScrollIndicator={false}
					>
						<View className='my-3 w-full'>
							<InputForm
								control={control}
								name='name'
								label='List Name'
								error={errors.name}
								testID='input-list-name'
							/>
							<TextElement textStyles='text-neutral-gray mt-2'>
								We recommend using 15 to 17 characters per line
							</TextElement>
						</View>
						<View className={`my-3 w-full `}>
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
						</View>
						<View className='my-3 w-full'>
							<MultiSelectModalForm
								control={control}
								options={tagOptions}
								name='tags'
								label='Tags'
								error={errors.tags}
								placeholder='Add Tags'
							/>
						</View>
						<View className='my-3 w-full'>
							<InputForm
								control={control}
								name='description'
								label='List Description'
								error={errors.description}
								inputStyles='flex h-[131px] py-2 align-text-top'
								multiline
								scrollEnabled={false}
							/>
						</View>
						<SwitchInput
							label='List Privacy'
							control={control}
							name='is_private'
							error={errors.is_private}
							activeText='Private'
							inactiveText='Not Private'
							containerStyles='mt-3'
						/>
						<ButtonPrimary
							onPress={handleSubmit(onSubmit)}
							buttonStyles='h-[40px] w-full mt-10 mb-10'
							textStyles='mt-1'
							testID='button-save-list'
							disabled={isUpdatingList}
						>
							Save
						</ButtonPrimary>
					</KeyboardAwareScrollView>
				)}
			</MainLayout>
		</>
	);
};

export default ListEditScreen;
