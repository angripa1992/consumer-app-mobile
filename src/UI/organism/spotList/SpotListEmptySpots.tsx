import TextElement from '@/UI/atoms/text/TextElement';
import { i18nInstance } from 'config/i18n';

interface SpotListEmptySpotsProps {
	isSpotListOwner: boolean;
}
const SpotListEmptySpots = ({ isSpotListOwner }: SpotListEmptySpotsProps) => {
	return (
		<TextElement textStyles='text-light-white text-sm mt-8 text-center'>
			{isSpotListOwner
				? i18nInstance.t('youHaveNotAddedAnySpotYet')
				: i18nInstance.t('thisListHasNoSpotsYet')}
		</TextElement>
	);
};

export default SpotListEmptySpots;
