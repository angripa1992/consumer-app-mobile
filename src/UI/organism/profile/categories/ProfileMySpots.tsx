import { useCallback } from 'react';
import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useNavigation } from '@react-navigation/native';

import { useAppStore } from '@/lib/store/store';
import { useRefetchOnFocus } from '@/lib/hooks/useRefetchOnFocus';
import { useGetAllUserSpots } from '@/lib/hooks/UseQuerySpot';
import { getCategoriesNameAndData } from '@/lib/helpers/categoriesHelpers';
import { i18nInstance } from 'config/i18n';

import CategoryTemplate from '@/UI/molecules/category/CategoryTemplate';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';
import NoListAvailable from '@/UI/molecules/NoListAvailable';
import SpotThumbnail from '../../spot/SpotThumbnail';

import type {
	ProfileScreenNavigationProp,
	ViewMoreScreenNavigationProp,
} from '@/lib/types/tabScreenParams';
import type { TypeUserSpot } from '@/lib/types/spot';

type TypeProfileMySpotsProps = {
	userId: number;
	currentCity: string;
};

const ProfileMySpots = ({ userId, currentCity }: TypeProfileMySpotsProps) => {
	const { user: appUser } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);
	const navigation = useNavigation<
		ViewMoreScreenNavigationProp & ProfileScreenNavigationProp
	>();

	const {
		allUserSpots,
		isLoading: isLoadingUserSpots,
		refetch,
	} = useGetAllUserSpots(userId);

	useRefetchOnFocus(refetch);

	const spotCategoriesToRender = getCategoriesNameAndData(allUserSpots);

	const isOwnerUser = appUser?.id === userId;

	const isHaveAtLeastOneFavoriteOrVisitedSpot = () => {
		let haveAtLeastOne = false;

		spotCategoriesToRender.forEach((category) => {
			if (category.data.length > 0) {
				haveAtLeastOne = true;
				return;
			}
		});

		return haveAtLeastOne;
	};

	const onViewMoreNavigation = (title: string, categoryName: string) => {
		if (currentCity) {
			navigation.push('ViewMore', {
				title,
				city: currentCity,
				type: 'userSpots',
				userId,
				categoryName,
			});
		}
	};

	const renderEmptyComponent = () => {
		return (
			<NoListAvailable
				emptyComponentStyles='h-[250px]'
				title='No items available'
			/>
		);
	};

	const renderSpotCard = useCallback(
		(item: TypeUserSpot, index: number, categoryName: string) => {
			return (
				<SpotThumbnail
					testID={`spot-${categoryName}-${index}`}
					queryMutateDestination='user'
					{...item}
					owner_status_tags={item.owner_status_tags}
					cardContainerStyles='w-[150px]'
					userId={userId}
					isOwner={isOwnerUser}
					googlePlaceLocationId={item.google_place_location_id}
				/>
			);
		},
		[],
	);

	if (isLoadingUserSpots) {
		return (
			<View className='flex justify-center items-center mt-6'>
				<SpinnerCup isFullPage={false} width={90} height={90} />
			</View>
		);
	}

	if (!isHaveAtLeastOneFavoriteOrVisitedSpot()) {
		return renderEmptyComponent();
	}

	return (
		<View className='flex-1' style={{ gap: 10 }}>
			{spotCategoriesToRender.map((category) => (
				<CategoryTemplate
					key={category.category_name}
					title={i18nInstance.t(category.category_name_to_render)}
					onClickViewMore={() =>
						onViewMoreNavigation(
							category.category_name_to_render,
							category.category_name,
						)
					}
					data={category.data}
					keyExtractor={(item) => item.id.toString()}
					renderItem={(singleRenderItem) =>
						renderSpotCard(
							singleRenderItem.item,
							singleRenderItem.index,
							category.category_name,
						)
					}
				/>
			))}
		</View>
	);
};

export default ProfileMySpots;
