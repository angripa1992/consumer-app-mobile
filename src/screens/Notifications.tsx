import { View } from 'react-native';
import { Image } from 'expo-image';

import useNotification from '@/lib/hooks/useNotification';

import TextElement from '@/UI/atoms/text/TextElement';
import HeaderGoBack from '@/UI/layouts/HeaderGoBack';
import MainLayout from '@/UI/layouts/MainLayout';
import Spinner from '@/UI/atoms/spinner/Spinner';
import NotificationImage from '@/UI/assets/images/bell.png';
import InfiniteScrollFlashList from '@/UI/molecules/infiniteScroll/InfiniteScrollFlashList';
import HeaderGreen from '@/images/layout/background-layout-green.png';
import { i18nInstance } from 'config/i18n';

const Notifications = () => {
	const {
		isLoadingNotifications,
		notifications,
		hasNextPageNotifications,
		isFetchingNextPageNotifications,
		renderNotificationCard,
		renderTitleNotification,
		fetchNextPageNotifications,
	} = useNotification();

	const isThereNotifications = notifications && notifications.length > 0;

	return (
		<>
			<HeaderGoBack />
			<MainLayout subContainerStyles='w-full px-5'>
				<Image
					source={HeaderGreen}
					className='h-[150px] w-screen absolute left-0 -top-10 z-[-1]'
				/>
				<TextElement
					designVariation='subtitle'
					className='text-2xl lowercase'
					fontFamily='pachang'
				>
					{i18nInstance.t('notifications')}
				</TextElement>
				{isLoadingNotifications && (
					<View className=' flex-1 justify-center  '>
						<Spinner isFullPage={false} />
					</View>
				)}
				{!isLoadingNotifications && !isThereNotifications && (
					<View className='flex-1 mt-5 justify-center items-center flex-col'>
						<Image source={NotificationImage} className='w-[250px] h-[200px]' />
						<TextElement className='text-white text-2xl font-bold mt-5'>
							{i18nInstance.t('noNotifications')}
						</TextElement>
						<TextElement className='text-white text-lg'>
							{i18nInstance.t('youAreGoingTorReceiveNotificationsHere')}
						</TextElement>
					</View>
				)}
				{isThereNotifications && (
					<InfiniteScrollFlashList
						dataToRender={notifications}
						renderItem={({ item }) => {
							return (
								<>
									{renderTitleNotification(item.category_header)}
									{renderNotificationCard(item)}
								</>
							);
						}}
						keyExtractor={(_, index) => {
							return index.toString();
						}}
						hasNextPage={hasNextPageNotifications}
						isFetchingNextPage={isFetchingNextPageNotifications}
						fetchNextPage={fetchNextPageNotifications}
						isLoading={isLoadingNotifications}
						hideEmptyComponent
						isOneColumn
					/>
				)}
			</MainLayout>
		</>
	);
};

export default Notifications;
