import { View } from 'react-native';
import { useCallback } from 'react';

import { useGetUserScribbles } from '@/lib/hooks/useQueryScribbles';

import ScribblesForSpotCard from '../../spot/card/ScribblesForSpotCard';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import InfiniteScrollFlatList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlatList';

import type { TypeScribbleWithSpotInfo } from '@/lib/types/scribbles';

type TypeProfileMyScribblesProps = {
	userId: number;
};

const ProfileMyScribbles = ({ userId }: TypeProfileMyScribblesProps) => {
	const {
		userScribbles,
		fetchNextPageUserScribbles,
		hasNextPageUserScribbles,
		isFetchingNextUserScribbles,
		isLoadingUserScribbles,
	} = useGetUserScribbles({
		userId,
		scribbleOption: 'all',
	});

	const renderFooter = () => {
		if (isLoadingUserScribbles || isFetchingNextUserScribbles) {
			return (
				<View className='flex justify-center items-center mt-6'>
					<SpinnerCup isFullPage={false} width={90} height={90} />
				</View>
			);
		}

		return null;
	};

	const renderScribble = useCallback(
		({ item, index }: { item: TypeScribbleWithSpotInfo; index: number }) => {
			if ('empty' in item && item.empty) {
				return <View className='flex-1'></View>;
			}

			return (
				<ScribblesForSpotCard
					spotId={item.spot_id}
					scribbleId={item.scribble_id}
					spotName={item.spot_name}
					eventId={item.event_id}
					userId={item.creator_user_id}
					username={item.creator_username}
					emojis={item.emojis}
					reviewDescription={item.review_description}
					visitedDate={item.visit_date}
					profilePictureUrl={item.creator_image}
					isPositive={item.is_positive}
					queryMutateDestination={'userScribbles'}
					testId={`scribble-card-${index}`}
					handleRedirectProfile={() => {}}
					scribbleImages={item.scribble_images}
					hasBottomModal
					hasThreeDotsButton={false}
				/>
			);
		},
		[userScribbles],
	);

	return (
		<>
			<InfiniteScrollFlatList
				fetchNextPage={fetchNextPageUserScribbles}
				hasNextPage={hasNextPageUserScribbles}
				isFetchingNextPage={isFetchingNextUserScribbles}
				isLoading={isLoadingUserScribbles}
				dataToRender={userScribbles}
				keyExtractor={(item, index) => {
					if ('empty' in item && item.empty) {
						return `empty-${index}`;
					}
					return index + '';
				}}
				renderItem={renderScribble}
				ListFooterComponent={renderFooter()}
				testID='profile-scribble-scroll'
				isOneColumn
			/>
		</>
	);
};

export default ProfileMyScribbles;
