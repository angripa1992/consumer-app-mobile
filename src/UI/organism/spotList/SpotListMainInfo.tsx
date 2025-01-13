import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUpdateFollowSpotListQuery } from '@/lib/hooks/useQueryFollow';
import { getLocationInfo } from '@/lib/helpers/getLocationInfo';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import ShareButton from '@/UI/molecules/share/ShareButton';
import LocationMarkerIcon from '@/UI/assets/svg/LocationMarkerIcon';
import ListSaveButton from '@/UI/atoms/list/ListSaveButton';

import type {
	DiscoveryScreenNavigationProp,
	ListNavigationRouteParams,
	ProfileNavigationRouteParams,
} from '@/lib/types/tabScreenParams';
import type { TypeSpotListDataEvent } from '@/lib/types/spotList';
import type { TypeFollow } from '@/lib/types/follows';

type SpotListMainInfo = {
	name: string;
	city: string;
	creator: string;
	spotListId: number;
	isSpotListOwner: boolean;
	spotListUserId: number;
	isFollowing?: boolean;
};

const SpotListMainInfo = ({
	creator,
	name,
	city,
	spotListId,
	isSpotListOwner,
	spotListUserId,
	isFollowing,
}: SpotListMainInfo) => {
	const dataListEvent: TypeSpotListDataEvent = {
		list_id: spotListId,
		list_name: name,
		list_creator: creator,
	};
	const { mutateAsync: followSpotList } = useUpdateFollowSpotListQuery({
		queryMutateDestination: 'spotList',
		dataListEvent,
		spotListId,
	});

	const navigation = useNavigation<
		ListNavigationRouteParams &
			DiscoveryScreenNavigationProp &
			ProfileNavigationRouteParams
	>();

	const locationData = city;
	const hasCreator = !!creator;

	const onClickUsername = () => {
		navigation.push('ProfileScreen', { userId: spotListUserId });
	};

	const handleFollowSpotList = () => {
		const followObject: TypeFollow = {
			following_spot_list_id: spotListId,
		};
		followSpotList(followObject);
	};

	return (
		<View>
			<View className='flex-row justify-between'>
				<TextElement
					textStyles='text-2xl font-medium text-white flex-1'
					testID='list-name'
				>
					{name}
				</TextElement>
				<View className='flex-row mt-2'>
					{!isSpotListOwner && (
						<ListSaveButton
							onPressSaveList={handleFollowSpotList}
							isSavedList={!!isFollowing}
							buttonTestID={`list-heart-button`}
							designVariation='list'
							widthIcon={20}
							heightIcon={20}
							customClassButtonContainer='mx-3'
						/>
					)}
					<ShareButton
						showText={false}
						type='spotList'
						id={spotListId}
						testID='list-share-button'
					/>
				</View>
			</View>
			<View className='flex-row items-center mt-2'>
				<LocationMarkerIcon color='#858585' width={18} height={18} />
				<TextElement textStyles='text-gray ml-1'>{locationData}</TextElement>
			</View>
			{hasCreator && (
				<ButtonPrimary
					onPress={onClickUsername}
					designVariation='ghost'
					buttonStyles='!p-0 border-none mt-2 '
					textStyles='text-gray  !text-xs  !text-left !no-underline'
					testID='list-creator'
				>
					Created by {creator}
				</ButtonPrimary>
			)}
		</View>
	);
};

export default SpotListMainInfo;
