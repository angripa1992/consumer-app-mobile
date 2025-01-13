import { View } from 'react-native';
import { Image, ImageSource } from 'expo-image';

import { i18nInstance } from 'config/i18n';
import { useGetScribbleRecommendations } from '@/lib/hooks/useQueryScribbles';

import LikeThumbIcon from '@/UI/assets/svg/LikeThumbIcon';
import TextElement from '@/UI/atoms/text/TextElement';
import ProfileImageDefault from '@/images/Profile-default.png';

interface SpotRecommendationsProps {
	id: number | string;
	isFromGooglePlace?: boolean;
}
const SpotRecommendations = ({
	id,
	isFromGooglePlace,
}: SpotRecommendationsProps) => {
	const { scribblesRecommendations, isErrorScribblesRecommendations } =
		useGetScribbleRecommendations(id, isFromGooglePlace);

	if (isErrorScribblesRecommendations || !scribblesRecommendations) return null;

	const scribblesCount = scribblesRecommendations?.scribbles_count;
	const userImages = scribblesRecommendations?.user_images;
	const userNames = scribblesRecommendations?.user_names;
	const restOfViews = scribblesRecommendations?.rest_of_reviews;

	const hasPeopleFollowed =
		scribblesRecommendations.people_followed_counter > 0;
	const hasOneScribble = scribblesCount === 1;
	const scribblesText = hasOneScribble ? 'person' : 'people';

	if (scribblesCount === 0) return null;

	return (
		<View className='mb-4 flex-row items-center  justify-between'>
			{userImages?.map((userImage, index) => {
				const isFirstItem = index === 0;
				const image: ImageSource = userImage
					? { uri: userImage }
					: ProfileImageDefault;

				return (
					<Image
						source={image}
						key={index}
						className={`w-8 h-8 rounded-full ${isFirstItem ? '' : '-ml-3'}`}
					/>
				);
			})}

			<View className='flex-row flex-1 items-center ml-3'>
				<TextElement textStyles='text-sm text-[#757575] lowercase'>
					{i18nInstance.t('recommendedBy')}{' '}
					{userNames.map((userName, index) => {
						const userNameToRender = `@${userName}`;

						return (
							<TextElement key={index} textStyles='text-sm text-white'>
								{index === 0 ? userNameToRender : `, ${userNameToRender}`}
							</TextElement>
						);
					})}{' '}
					{restOfViews > 0 && (
						<>
							{i18nInstance.t('and')}{' '}
							<TextElement textStyles='text-sm text-white'>
								{restOfViews} {i18nInstance.t('others')}
							</TextElement>
						</>
					)}
				</TextElement>
			</View>
			<LikeThumbIcon width={18} height={18} color={'#B0B0B0'} />
		</View>
	);
};

export default SpotRecommendations;
