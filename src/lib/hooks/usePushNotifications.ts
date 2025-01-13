import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from '../helpers/notifications/registerForPushNotificationsAsync';
import { IS_ANDROID } from '../utils/constants';

const usePushNotifications = () => {
	const [expoPushToken, setExpoPushToken] = useState('');
	const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
		[],
	);
	const [notification, setNotification] = useState<
		Notifications.Notification | undefined
	>(undefined);
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();

	useEffect(() => {
		registerForPushNotificationsAsync().then(
			(token) => token && setExpoPushToken(token),
		);

		if (IS_ANDROID) {
			Notifications.getNotificationChannelsAsync().then((value) =>
				setChannels(value ?? []),
			);
		}
		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {

			});

		return () => {
			notificationListener.current &&
				Notifications.removeNotificationSubscription(
					notificationListener.current,
				);
			responseListener.current &&
				Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	return {
		expoPushToken,
		channels,
		notification,
	};
};

export default usePushNotifications;
