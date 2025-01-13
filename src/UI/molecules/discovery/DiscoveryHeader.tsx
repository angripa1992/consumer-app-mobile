import KlikitLogo from '@/UI/assets/svg/KlikitLogo';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import Header from '@/UI/layouts/Header';
import { useAppStore } from '@/lib/store/store';
import { AppStackNavigationProp } from '@/lib/types/tabScreenParams';
import { useNavigation } from '@react-navigation/native';
import { useShallow } from 'zustand/react/shallow';
import { i18nInstance } from 'config/i18n';

const DiscoveryHeader = () => {
	const navigation = useNavigation<AppStackNavigationProp>();
	const { globalCityFilterValue, globalCountryFilterValue } = useAppStore(
		useShallow((state) => ({
			globalCountryFilterValue: state.globalCountryFilterValue,
			globalCityFilterValue: state.globalCityFilterValue,
		})),
	);

	const onPressAddSpot = () => {
		navigation.navigate('CreateBasicSpot', {
			city: globalCityFilterValue,
			country: globalCountryFilterValue,
		});
	};

	return (
		<Header headerStyles='!justify-between' showDefaultHeader={false}>
			<KlikitLogo />
			<ButtonPrimary
				onPress={onPressAddSpot}
				designVariation='white-transparent'
				buttonStyles='px-6 py-2 rounded-lg'
				testID='add-spot-button-discovery'
				textStyles='text-white text-sm'
			>
				{i18nInstance.t('cantFindSpot')}
			</ButtonPrimary>
		</Header>
	);
};

export default DiscoveryHeader;
