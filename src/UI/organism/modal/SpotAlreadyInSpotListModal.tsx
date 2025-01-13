import { View } from 'react-native';
import ModalTemplate from './ModalTemplate';
import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import CloseIcon from '@/UI/assets/svg/CloseIcon';

interface SpotAlreadyInSpotListModalProps {
	showSpotAlreadyInSpotListModal: boolean;
	setShowSpotAlreadyInSpotListModal: (value: boolean) => void;
}

const SpotAlreadyInSpotListModal = ({
	showSpotAlreadyInSpotListModal,
	setShowSpotAlreadyInSpotListModal,
}: SpotAlreadyInSpotListModalProps) => {
	return (
		<ModalTemplate
			showModal={showSpotAlreadyInSpotListModal}
			modalPosition='center'
		>
			<View className='bg-dark-gray relative w-[260px] h-[200px] flex justify-center rounded-lg z-50 border border-light-white'>
				<ButtonPrimary
					designVariation='ghost'
					buttonStyles=' !p-0 absolute top-2 right-5'
					textStyles='text-gray text-base'
					onPress={() => setShowSpotAlreadyInSpotListModal(false)}
				>
					<CloseIcon />
				</ButtonPrimary>
				<TextElement textStyles='text-gray text-[14px] text-center w-[70%] my-0 mx-auto'>
					This Spot already exists in the list that you've selected
				</TextElement>
			</View>
		</ModalTemplate>
	);
};

export default SpotAlreadyInSpotListModal;
