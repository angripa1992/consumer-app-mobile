import {
	Control,
	Controller,
	UseFormSetValue,
	UseFormWatch,
} from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { i18nInstance } from 'config/i18n';
import { useGetRelevantUsers, useGetUser } from '@/lib/hooks/useQueryUser';
import { limitArray } from '@/lib/helpers/limitArray';
import { useAppStore } from '@/lib/store/store';

import ProfileThumbnail from '@/UI/molecules/profile/ProfileThumbnail';
import TextElement from '@/UI/atoms/text/TextElement';
import NavigationButtonsOnBoarding from '@/UI/molecules/onboarding/NavigationButtonsOnBoarding';

import type { Dispatch, SetStateAction } from 'react';
import type { TypeOnboardingFormSchema } from '@/lib/types/onboarding';

interface FollowAccountsOnBoardingProps {
	control: Control<TypeOnboardingFormSchema>;
	watch: UseFormWatch<TypeOnboardingFormSchema>;
	setValue: UseFormSetValue<TypeOnboardingFormSchema>;
	setProgress: Dispatch<SetStateAction<number>>;
	setStep: (value: number) => void;
}

const FollowAccountsOnBoarding = ({
	control,
	watch,
	setValue,
	setProgress,
	setStep,
}: FollowAccountsOnBoardingProps) => {
	const { user: userStored } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);
	const { user } = useGetUser(userStored?.id);

	const { relevantUsers } = useGetRelevantUsers(user?.city ?? '');

	const selectedItems = watch('relevantUsers');
	const isThereAnyItemSelected = selectedItems.length > 0;

	const handleBack = () => {
		setProgress(40);
		setStep(2);
	};

	const handleNext = () => {
		setProgress(80);
		setStep(4);
	};

	const isSelectedOption = (currentOption: number) =>
		selectedItems.includes(currentOption);

	const onPressUserCard = (currentOption: number) => {
		if (selectedItems.includes(currentOption)) {
			const filteredItems = selectedItems.filter(
				(item) => item !== currentOption,
			);

			setValue('relevantUsers', filteredItems);

			return;
		}

		const newItems = [...selectedItems, currentOption];
		setValue('relevantUsers', newItems);
	};

	useEffect(() => {
		if (isThereAnyItemSelected) {
			setProgress(70);
		} else {
			setProgress(60);
		}
	}, [selectedItems]);

	return (
		<>
			<TextElement
				textStyles='text-white text-2xl mb-5 font-medium px-5'
				fontFamily='pachang'
			>
				{i18nInstance.t('findAndFollow')}
			</TextElement>
			<TextElement textStyles={`text-gray text-sm mb-8 px-5`}>
				{i18nInstance.t('findAndFollowText')}
			</TextElement>
			<Controller
				name='relevantUsers'
				control={control}
				render={() => {
					return (
						<FlatList
							className='px-5'
							data={limitArray(relevantUsers, 4)}
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ gap: 5 }}
							keyExtractor={(item) => item.id.toString()}
							renderItem={({ item }) => (
								<ProfileThumbnail
									queryMutateDestination='user'
									followUserId={item.id}
									name={item.name}
									imageUrl={item.profile_image_url}
									handlePressFollowButton={() => {
										onPressUserCard(item.id);
									}}
									isFollowing={isSelectedOption(item.id)}
									disabledRedirect
									designVariation='small'
								/>
							)}
						/>
					);
				}}
			/>
			<View className='px-5'>
				<NavigationButtonsOnBoarding
					handleNext={handleNext}
					handleBack={handleBack}
					isThereAnyItemSelected={isThereAnyItemSelected}
				/>
			</View>
		</>
	);
};

export default FollowAccountsOnBoarding;
