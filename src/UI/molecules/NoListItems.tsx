import { View } from 'react-native';
import TextElement from '@/UI/atoms/text/TextElement';

import NoListIcon from '@/svg/ListDetailsIcon';
import ButtonPrimary from '../atoms/button/ButtonPrimary';
import { NavigationProps } from '@/lib/types/tabScreenParams';
import { useNavigation } from '@react-navigation/native';

interface NoListItemsProps {
	NoListItemsClassName?: string;
	showButton?: boolean;
}

const NoListItems = ({
	NoListItemsClassName,
	showButton,
}: NoListItemsProps) => {
	const navigation = useNavigation<NavigationProps>();
	const onRedirectToCreateList = () => {
		navigation.navigate('Create', {
			screen: 'ListCreate',
			params: { spotList: null },
		});
	};

	return (
		<View
			className={` flex flex-col w-full justify-center items-center h-[250px] ${NoListItemsClassName}`}
		>
			<NoListIcon />
			<TextElement textStyles='text-white text-xl mt-3'>No Lists</TextElement>
			{showButton && (
				<ButtonPrimary
					buttonStyles='py-3   mt-7'
					onPress={onRedirectToCreateList}
				>
					Create List
				</ButtonPrimary>
			)}
		</View>
	);
};

export default NoListItems;
