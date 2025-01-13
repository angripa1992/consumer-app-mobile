import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { Image } from 'expo-image';

import { IS_ANDROID, IS_IOS, ME_LINK } from '@/lib/utils/constants';
import { useAppStore } from '@/lib/store/store';
import { locationFilterValidationSchema } from '@/lib/schemas/discovery';

import Header from '../Header';
import TextElement from '@/UI/atoms/text/TextElement';
import NotificationIcon from '@/UI/assets/svg/NotificationIcon';
import KlikitIcon from '@/UI/assets/images/klikit-new-logo-icon.png';
import InviteFriendsIcon from '@/UI/assets/images/invite-friends-icon.png';
import LocationFilter from '@/UI/organism/filters/LocationFilter';

import type {
	AppStackNavigationProp,
	FeedScreenNavigationProps,
} from '@/lib/types/tabScreenParams';

const HeaderFeed = () => {
	const { userStoredCity, globalCityFilterValue, setGlobalCityFilterValue } =
		useAppStore(
			useShallow((state) => ({
				userStoredCity: state.user?.city,
				globalCityFilterValue: state.globalCityFilterValue,
				setGlobalCityFilterValue: state.setGlobalCityFilterValue,
			})),
		);

	const { control, setValue, watch, reset } = useForm({
		defaultValues: {
			city: userStoredCity ?? '',
		},
		resolver: zodResolver(locationFilterValidationSchema),
	});

	const [hasBadge, setHasBadge] = useState(false);
	const navigation = useNavigation<
		FeedScreenNavigationProps & AppStackNavigationProp
	>();

	const onPressMeLink = useCallback(async () => {
		await Linking.openURL(ME_LINK);
	}, []);

	const onPressKlikitIcon = () => {
		navigation.navigate('FeedScreen');
	};

	const onPressInviteFriends = () => {
		navigation.navigate('InviteFriends');
	};

	const onPressNotification = () => {
		if (IS_IOS) {
			Notifications.setBadgeCountAsync(0);
		} else if (IS_ANDROID) {
			Notifications.dismissAllNotificationsAsync();
		}

		navigation.navigate('Notifications');
	};

	useEffect(() => {
		const checkBadge = async () => {
			const badgeCount = await Notifications.getBadgeCountAsync();
			setHasBadge(badgeCount > 0);
		};

		checkBadge();
	}, []);

	return (
		<Header
			headerStyles='!justify-between items-center'
			showDefaultHeader={false}
		>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={onPressKlikitIcon}
				testID='klikit-icon-button'
				hitSlop={10}
				className='mr-2'
			>
				<Image source={KlikitIcon} className='w-[40px] h-[40px] mt-3' />
			</TouchableOpacity>
			<LocationFilter
				customStyles='mb-0 flex-1'
				control={control}
				currentCity={globalCityFilterValue}
				setCurrentCity={setGlobalCityFilterValue}
				setValue={setValue}
				watch={watch}
				reset={reset}
				testID='location-filter'
			/>
			<View className='flex flex-row items-center gap-x-4'>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={onPressMeLink}
					hitSlop={10}
				>
					<TextElement textStyles='text-white text-lg font-bold'>
						me.
					</TextElement>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={0.8}
					onPress={onPressInviteFriends}
					hitSlop={5}
				>
					<Image className='w-[25px] h-[25px]' source={InviteFriendsIcon} />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onPressNotification}
					activeOpacity={0.8}
					hitSlop={5}
					testID='invite-friends-button'
				>
					<NotificationIcon width={25} height={23} hasNotification={hasBadge} />
				</TouchableOpacity>
			</View>
		</Header>
	);
};

export default HeaderFeed;
