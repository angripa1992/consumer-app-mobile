import { View } from 'react-native';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';

import BellIcon from '@/svg/BellIcon';
import ReserveIcon from '@/UI/assets/svg/ReserveIcon';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { i18nInstance } from 'config/i18n';

interface SpotButtonsProps {
	reservationsModalRef: React.RefObject<BottomSheetModal>;
	ordersModalRef: React.RefObject<BottomSheetModal>;
	hasReservations: boolean;
	hasOrders: boolean;
}

const SpotButtons = ({
	hasOrders,
	hasReservations,
	reservationsModalRef,
	ordersModalRef,
}: SpotButtonsProps) => {
	if (!hasReservations && !hasOrders) return null;

	const onPressReservations = () => {
		reservationsModalRef.current?.present();
	};

	const onPressOrders = () => {
		ordersModalRef.current?.present();
	};

	return (
		<View
			className='flex flex-row justify-between mt-3 '
			style={{ columnGap: 15 }}
		>
			{hasReservations && (
				<ButtonPrimary
					buttonStyles='bg-white  rounded-md  px-3 py-2 flex-1'
					isReactNodeContent
					designVariation='ghost'
					nodeContentStyles='flex flex-row items-center justify-center'
					onPress={onPressReservations}
				>
					<ReserveIcon color='#0D0D0D' width={16} height={16} />
					<TextElement textStyles='ml-1 text-dark-black text-sm'>
						{i18nInstance.t('reserve')}
					</TextElement>
				</ButtonPrimary>
			)}
			{hasOrders && (
				<ButtonPrimary
					buttonStyles='bg-white  rounded-md px-3 py-2 flex-1'
					designVariation='ghost'
					isReactNodeContent
					nodeContentStyles='flex flex-row items-center justify-center'
					onPress={onPressOrders}
				>
					<BellIcon color='#0D0D0D' width={14} height={14} />
					<TextElement textStyles='ml-1 text-dark-black text-sm'>
						{i18nInstance.t('order')}
					</TextElement>
				</ButtonPrimary>
			)}
		</View>
	);
};

export default SpotButtons;
