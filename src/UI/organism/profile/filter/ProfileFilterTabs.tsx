import { View } from 'react-native';

import { i18nInstance } from 'config/i18n';

import { dataProfileTabs } from '@/lib/data/profileData';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';

import type { TypeProfileListFilterValue } from '@/lib/types/profile';

type TypeProfileFilterTabsProps = {
	currentFilter: TypeProfileListFilterValue;
	setCurrentFilter: (value: TypeProfileListFilterValue) => void;
	isAuthenticateUser: boolean;
};

const ProfileFilterTabs = ({
	currentFilter,
	setCurrentFilter,
	isAuthenticateUser,
}: TypeProfileFilterTabsProps) => {
	const handleActiveListStyles = (
		listValue: TypeProfileListFilterValue,
		elementToStyled: 'button' | 'text',
	) => {
		if (elementToStyled === 'button') {
			if (listValue === currentFilter) {
				return 'bg-middle-gray text-white';
			}
		}
		if (elementToStyled === 'text') {
			if (listValue === currentFilter) {
				return 'text-white';
			}
		}
		return '';
	};

	const handleUpdateCurrentListFilter = (
		listValue: TypeProfileListFilterValue,
	) => {
		setCurrentFilter(listValue);
	};

	return (
		<View className='my-5 flex-row' style={{ columnGap: 10 }}>
			{dataProfileTabs(isAuthenticateUser).map((item) => (
				<ButtonPrimary
					designVariation='gray'
					buttonStyles={`rounded-full px-0 justify-center flex-1 ${handleActiveListStyles(
						item.value,
						'button',
					)}`}
					textStyles={handleActiveListStyles(item.value, 'text')}
					onPress={() => handleUpdateCurrentListFilter(item.value)}
					testID={`profile-filter-${item.value}`}
					key={item.value}
				>
					{i18nInstance.t(item.name)}
				</ButtonPrimary>
			))}
		</View>
	);
};

export default ProfileFilterTabs;
