import TextElement from '@/UI/atoms/text/TextElement';

const TarotNotFoundErrorView = () => {
	return (
		<TextElement textStyles='text-white text-center text-md mb-6'>
			This user doesn't have a Tarot QR code yet, please try again later
		</TextElement>
	);
};

export default TarotNotFoundErrorView;
