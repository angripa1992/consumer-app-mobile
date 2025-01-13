import { useState } from 'react';
import StarRating from 'react-native-star-rating-widget';

type RatingProps = {
	rating: string | number;
};

const Rating = ({ rating }: RatingProps) => {
	const [ratingNumber, setRatingNumber] = useState(0);
	return (
		<StarRating
			rating={Number(rating)}
			onChange={setRatingNumber}
			starSize={30}
			color='#FFFFFF'
			emptyColor='#FFFFFF'
			starStyle={{ marginHorizontal: 4 }}
		/>
	);
};

export default Rating;
