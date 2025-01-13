import AtmosphereIcon from '@/UI/assets/svg/AtmosphereIcon';
import BellIcon from '@/UI/assets/svg/BellIcon';
import FoodIcon from '@/UI/assets/svg/FoodIcon';
import MoneyIcon from '@/UI/assets/svg/MoneyIcon';
import Rating from '@/UI/atoms/rating/Rating';
import TextElement from '@/UI/atoms/text/TextElement';
import { View } from 'react-native';

type SpotRatingProps = {
	general_rating: number | null | undefined;
	food_rating: number | null | undefined;
	service_rating: number | null | undefined;
	value_rating: number | null | undefined;
	atmosphere_rating: number | null | undefined;
};

const SpotRatings = ({
	general_rating,
	food_rating,
	service_rating,
	value_rating,
	atmosphere_rating,
}: SpotRatingProps) => {
	return (
		<View className='mt-4'>
			<TextElement textStyles='text-base text-gray font-bold'>
				Ratings
			</TextElement>
			<View className='flex flex-row mt-2'>
				{general_rating ? (
					<>
						<TextElement textStyles='text-gray pt-[1px] mr-2'>
							{general_rating}
						</TextElement>
						<Rating rating={general_rating} />
					</>
				) : (
					<TextElement textStyles='text-gray'>
						General rating not available
					</TextElement>
				)}
			</View>
			<View className='mt-2 mb-8'>
				<View className='flex flex-row justify-between items-center mt-2'>
					<View className='flex flex-row'>
						<FoodIcon />
						<TextElement textStyles='text-[12px] text-gray ml-2'>
							Food & Drink
						</TextElement>
					</View>
					{food_rating ? (
						<Rating rating={food_rating} />
					) : (
						<TextElement textStyles='text-gray'>
							Food & Drink rating not available
						</TextElement>
					)}
				</View>
				<View className='flex flex-row justify-between items-center mt-2'>
					<View className='flex flex-row'>
						<BellIcon />
						<TextElement textStyles='text-[12px] text-gray ml-2'>
							Service
						</TextElement>
					</View>
					{service_rating ? (
						<Rating rating={service_rating} />
					) : (
						<TextElement textStyles='text-gray'>
							Service rating not available
						</TextElement>
					)}
				</View>
				<View className='flex flex-row justify-between items-center mt-2'>
					<View className='flex flex-row'>
						<MoneyIcon />
						<TextElement textStyles='text-[12px] text-gray ml-2'>
							Value
						</TextElement>
					</View>
					{value_rating ? (
						<Rating rating={value_rating} />
					) : (
						<TextElement textStyles='text-gray'>
							Value rating not available
						</TextElement>
					)}
				</View>
				<View className='flex flex-row justify-between items-center mt-2'>
					<View className='flex flex-row ml-1'>
						<AtmosphereIcon />
						<TextElement textStyles='text-[12px] text-gray ml-[14px]'>
							Atmosphere
						</TextElement>
					</View>
					{atmosphere_rating ? (
						<Rating rating={atmosphere_rating} />
					) : (
						<TextElement textStyles='text-gray'>
							Atmosphere rating not available
						</TextElement>
					)}
				</View>
			</View>
		</View>
	);
};

export default SpotRatings;
