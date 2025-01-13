import { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';

import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/lib/store/store';
import {
	usePostOnboardingPreferences,
	useGetUser,
} from '@/lib/hooks/useQueryUser';

import BgOnBoarding from '@/images/general-onboarding-background.jpg';
import CongratulationsOnBoarding from '@/UI/organism/onboarding/finalView/CongratulationsOnBoarding';
import LoadingOnBoarding from '@/UI/organism/onboarding/finalView/LoadingOnBoarding';

import type { OnboardingFinalViewRouteParams } from '@/lib/types/tabScreenParams';
import ChangeLanguageButton from '@/UI/molecules/language/ChangeLanguageButton';

const FinalView = ({ route }: OnboardingFinalViewRouteParams) => {
	const { mutateAsync: createOnboardingPreferences } =
		usePostOnboardingPreferences();
	const {
		user: userStored,
		resetOnboardingValues,
		setGlobalCityFilterValue,
	} = useAppStore(
		useShallow((state) => ({
			user: state.user,
			resetOnboardingValues: state.resetOnboardingValues,
			setGlobalCityFilterValue: state.setGlobalCityFilterValue,
		})),
	);
	const { refetch: refetchGetUser, user } = useGetUser(userStored?.id);

	const [isLoadingOnboarding, setIsLoadingOnboarding] = useState(false);

	const tagsToSend = route.params.tags;
	const preferredUsersToSend = route.params.relevantUsers;
	const preferredListsToSend = route.params.relevantLists;

	const handleCreatePreferences = () => {
		if (!user) return;

		const cityToSend = user.city;

		setIsLoadingOnboarding(true);
		const dataToSend = {
			tags: tagsToSend,
			profiles_to_follow: preferredUsersToSend,
			spot_lists_to_follow: preferredListsToSend,
			city: cityToSend,
		};

		createOnboardingPreferences(dataToSend).finally(() => {
			setGlobalCityFilterValue(cityToSend);
			refetchGetUser();
			resetOnboardingValues();
		});
	};

	return (
		<View className='pb-24  px-5 relative h-screen flex-1 w-screen flex flex-col justify-between'>
			<View className='mt-16 flex flex-row justify-end'>
				{!isLoadingOnboarding && <ChangeLanguageButton />}
			</View>
			<Image
				source={BgOnBoarding}
				className='h-screen w-screen absolute left-0 bottom-0 z-[-1]'
			/>
			<View className='flex flex-col justify-end'>
				{!isLoadingOnboarding ? (
					<CongratulationsOnBoarding
						handleCreatePreferences={handleCreatePreferences}
					/>
				) : (
					<LoadingOnBoarding />
				)}
			</View>
		</View>
	);
};

export default FinalView;
