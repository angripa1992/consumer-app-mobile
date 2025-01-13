import TextElement from '@/UI/atoms/text/TextElement';
import ErrorTemplate from '../../error/ErrorTemplate';

type TypeLikesForSpotFlatListProps = {
	typeMessage: 'scribbles' | 'likes' | 'lists';
};

const SpotNoResultsView = ({ typeMessage }: TypeLikesForSpotFlatListProps) => {
	const renderTitle = () => {
		if (typeMessage === 'scribbles') {
			return 'No Scribbles!';
		}
		if (typeMessage === 'likes') {
			return 'No Likes!';
		}
		if (typeMessage === 'lists') {
			return 'No Lists!';
		}
	};

	const renderDescription = () => {
		if (typeMessage === 'scribbles') {
			return (
				<>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						There’s currently no scribbles for this spot.
					</TextElement>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						Add yours to be the first?
					</TextElement>
				</>
			);
		}
		if (typeMessage === 'likes') {
			return (
				<>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						There’s currently no likes for this spot.
					</TextElement>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						Add yours to be the first?
					</TextElement>
				</>
			);
		}
		if (typeMessage === 'lists') {
			return (
				<>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						There’s currently no lists for this spot.
					</TextElement>
					<TextElement textStyles='mt-4 text-center !text-white text-base font-semibold tracking-[-0.70px] px-5'>
						Add it to one and be the first?
					</TextElement>
				</>
			);
		}
	};

	return (
		<>
			<ErrorTemplate
				title={renderTitle()}
				containerStyles='!bg-transparent mt-8'
				typeError='custom'
				descriptionContent={<>{renderDescription()}</>}
				hideTexture
			/>
		</>
	);
};

export default SpotNoResultsView;
