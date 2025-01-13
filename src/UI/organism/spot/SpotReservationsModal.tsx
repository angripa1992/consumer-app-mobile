import { View } from 'react-native';

import Link from '@/UI/atoms/link/Link';
import TextElement from '@/UI/atoms/text/TextElement';

import ToolsKitchenIcon from '@/svg/ToolsKitchenIcon';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from '../modal/CustomBottonSheet';

interface SpotReservationsModalProps {
	reservations: (string | null | undefined)[];
	hasReservations: boolean;
	reservationsModalRef: React.RefObject<BottomSheetModal>;
}

const SpotReservationsModal = ({
	reservations,
	hasReservations,
	reservationsModalRef,
}: SpotReservationsModalProps) => {
	return (
		<CustomBottomSheetModal
			bottomSheetModalRef={reservationsModalRef}
			snapPoints={['40%']}
		>
			<TextElement textStyles='text-light-white font-bold text-base mb-3'>
				Reserve table
			</TextElement>
			<View>
				{hasReservations &&
					reservations.map((reservation, index) => {
						return (
							<Link
								key={index}
								linkStyles='  flex flex-row items-center py-[2px] mb-3'
								url={reservation}
							>
								<ToolsKitchenIcon />
								<TextElement textStyles='text-gray  ml-2 '>
									{reservation}
								</TextElement>
							</Link>
						);
					})}
				{!hasReservations && (
					<TextElement textStyles='w-full text-gray text-center mt-4'>
						There are no reservations
					</TextElement>
				)}
			</View>
		</CustomBottomSheetModal>
	);
};

export default SpotReservationsModal;
