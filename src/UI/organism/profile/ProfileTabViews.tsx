import { useAppStore } from '@/lib/store/store';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import { View } from 'react-native';

import type { TypeProfileTab } from '@/lib/types/profile';

const ProfileTabViews = () => {
	const { profileTabView, setProfileTabView } = useAppStore();

	const handleActiveListStyles = (
		tabValue: TypeProfileTab,
		elementToStyled: 'button' | 'text',
	) => {
		if (elementToStyled === 'button') {
			if (tabValue === profileTabView) {
				return 'bg-middle-gray text-white';
			}
		}
		if (elementToStyled === 'text') {
			if (tabValue === profileTabView) {
				return 'text-white';
			}
		}
	};

	const handleUpdateCurrentListFilter = (tabValue: TypeProfileTab) => {
		setProfileTabView(tabValue);
	};

	return (
		<View className='flex flex-row justify-center mb-8 w-full'>
			<ButtonPrimary
				designVariation='gray'
				buttonStyles={`rounded-full ${handleActiveListStyles(
					'profile',
					'button',
				)}`}
				textStyles={handleActiveListStyles('profile', 'text')}
				onPress={() => handleUpdateCurrentListFilter('profile')}
			>
				Profile
			</ButtonPrimary>
			<ButtonPrimary
				designVariation='gray'
				buttonStyles={`rounded-full mx-2 ${handleActiveListStyles(
					'password',
					'button',
				)}`}
				textStyles={handleActiveListStyles('password', 'text')}
				onPress={() => handleUpdateCurrentListFilter('password')}
			>
				Password
			</ButtonPrimary>
		</View>
	);
};

export default ProfileTabViews;
