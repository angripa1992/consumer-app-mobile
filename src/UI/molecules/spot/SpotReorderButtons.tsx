import { View } from 'react-native';

import { useAppStore } from '@/lib/store/store';
import { useSpotReorderList } from '@/lib/hooks/useQueryReorder';
import { TypeReorderSpotListValuesToSend } from '@/lib/types/spotList';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import { useToast } from 'react-native-toast-notifications';
import { TypeSpotSingleToSpotList } from '@/lib/types/spot';
import { useShallow } from 'zustand/react/shallow';

interface SpotReorderButtonsProps {
	spotsToShow?: TypeSpotSingleToSpotList[];
	draggableSpots?: TypeSpotSingleToSpotList[];
	setDraggableSpots: (draggableSpots?: TypeSpotSingleToSpotList[]) => void;
	spotListId: number;
}

const SpotReorderButtons = ({
	spotsToShow,
	draggableSpots,
	setDraggableSpots,
	spotListId,
}: SpotReorderButtonsProps) => {
	const toast = useToast();

	const { setIsReorderingSpotListActive } = useAppStore(
		useShallow((state) => ({
			setIsReorderingSpotListActive: state.setIsReorderingSpotListActive,
		})),
	);
	const { mutateAsync: reorderSpotList, isLoading: isLoadingReordering } =
		useSpotReorderList(spotListId);

	const onPressCancel = () => {
		setIsReorderingSpotListActive(false);
		setDraggableSpots(spotsToShow);
	};

	const onSave = async () => {
		const spotsToSave = draggableSpots?.map((spot, index) => {
			return {
				id: spot.spot_spot_list_id,
				order: index + 1,
			};
		});

		const requestBody: TypeReorderSpotListValuesToSend = {
			update_order: spotsToSave,
		};

		reorderSpotList(requestBody).then(() => {
			setIsReorderingSpotListActive(false);
			toast.show('List updated successfully', {
				type: 'success',
			});
		});
	};

	return (
		<View className='  py-5  absolute left-0 bottom-0 w-full bg-dark-black  mt-10'>
			{isLoadingReordering && (
				<TextElement textStyles='text-base font-bold text-center text-gray mb-4'>
					Reordering list, this may take a few seconds...
				</TextElement>
			)}
			<View className='flex w-full flex-row  items-center justify-evenly'>
				<ButtonPrimary
					buttonStyles={`px-8 min-w-[40%] ${
						isLoadingReordering ? 'opacity-50' : ''
					}`}
					textStyles='text-base'
					designVariation='white-transparent'
					disabled={isLoadingReordering}
					onPress={onPressCancel}
				>
					Cancel
				</ButtonPrimary>
				<ButtonPrimary
					buttonStyles={`px-8 min-w-[40%] ${
						isLoadingReordering ? 'opacity-50' : ''
					}`}
					textStyles='text-base'
					disabled={isLoadingReordering}
					onPress={onSave}
				>
					Save
				</ButtonPrimary>
			</View>
		</View>
	);
};

export default SpotReorderButtons;
