import { i18nInstance } from 'config/i18n';
import TextElement from '@/UI/atoms/text/TextElement';

import type {
	ListNotificationProps,
	ProfileNotificationProps,
} from '@/lib/types/notifications';

export const renderDescriptionForListNotifications = ({
	listName,
	...props
}: ListNotificationProps) => {
	const notificationType = props.type;

	if (notificationType === 'following_list_saved') {
		const { followingProfileName, saveAmount } = props;

		const completeMessage = i18nInstance.t('followingListSaved', {
			username: followingProfileName,
			listName,
			amountReached: saveAmount,
		});

		const messageToShow = (
			<>
				{completeMessage.split(listName)[0]}
				<TextElement textStyles={`text-white text-sm font-bold underline`}>
					{listName}
				</TextElement>
				{completeMessage.split(listName)[1]}
			</>
		);

		return messageToShow;
	}
	if (notificationType === 'update_lists') {
		const { followingProfileName } = props;

		const completeMessage = i18nInstance.t('followingListUpdate', {
			username: followingProfileName,
			listName,
		});

		const messageToShow = (
			<>
				{completeMessage.split(listName)[0]}
				<TextElement textStyles={`text-white text-sm font-bold underline`}>
					{listName}
				</TextElement>
				{completeMessage.split(listName)[1]}
			</>
		);

		return messageToShow;
	}
	if (notificationType === 'following_list_views') {
		const { followingProfileName, viewsAmount } = props;

		const completeMessage = i18nInstance.t('followingListViews', {
			username: followingProfileName,
			listName,
			amountReached: viewsAmount,
		});

		const messageToShow = (
			<>
				{completeMessage.split(listName)[0]}
				<TextElement textStyles={`text-white text-sm font-bold underline`}>
					{listName}
				</TextElement>
				{completeMessage.split(listName)[1]}
			</>
		);

		return messageToShow;
	}
	if (notificationType === 'viewed_lists') {
		const { amountReached } = props;

		const completeMessage = i18nInstance.t('notificationListViews', {
			listName,
			amountReached,
		});

		const messageToShow = (
			<>
				{completeMessage.split(listName)[0]}
				<TextElement textStyles={`text-white text-sm font-bold underline`}>
					{listName}
				</TextElement>
				{completeMessage.split(listName)[1]}
			</>
		);

		return messageToShow;
	}

	const { profileName, saveAmount } = props;

	if (saveAmount) {
		const completeMessage = i18nInstance.t('notificationListSavedSeveral', {
			username: profileName,
			listName,
			amountReached: saveAmount,
		});

		const messageToShow = (
			<>
				{completeMessage.split(listName)[0]}
				<TextElement textStyles={`text-white text-sm font-bold underline`}>
					{listName}
				</TextElement>
				{completeMessage.split(listName)[1].split(profileName)[0]}
				<TextElement textStyles={`text-white text-sm font-bold underline`}>
					{profileName}
				</TextElement>
				{completeMessage.split(listName)[1].split(profileName)[1]}
			</>
		);

		return messageToShow;
	}

	const completeMessage = i18nInstance.t('notificationListSavedOnce', {
		username: profileName,
		listName,
	});

	const messageToShow = (
		<>
			<TextElement textStyles={`text-white text-sm font-bold underline`}>
				{profileName}
			</TextElement>
			{completeMessage.split(profileName)[1].split(listName)[0]}
			<TextElement textStyles={`text-white text-sm font-bold underline`}>
				{listName}
			</TextElement>
		</>
	);

	return messageToShow;
};

export const renderDescriptionForProfileNotifications = ({
	...props
}: ProfileNotificationProps) => {
	const notificationType = props.type;

	if (notificationType === 'viewed_profiles') {
		const { amountReached } = props;

		return i18nInstance.t('notificationProfileViewsText', {
			amountReached,
		});
	}

	const { profileName } = props;
	const completeMessage = i18nInstance.t('notificationProfileFollowText', {
		username: profileName,
	});

	return (
		<>
			<TextElement textStyles={`text-white text-sm font-bold underline`}>
				{profileName}
			</TextElement>
			{completeMessage.split(profileName)[1]}
		</>
	);
};

export const renderDescriptionForScribbleNotification = ({
	scribbleDescription,
	spotName,
	amountReached,
	handleRedirectToSpot,
}: {
	scribbleDescription: string;
	spotName: string;
	amountReached: number;
	handleRedirectToSpot: () => void;
}) => {
	const completeMessage = i18nInstance.t('scribblesReact', {
		scribbleDescription,
		spotName,
		amountReached,
	});

	return (
		<>
			{completeMessage.split(scribbleDescription)[0]}
			<TextElement textStyles={`text-white text-sm font-bold underline`}>
				"{scribbleDescription}"
			</TextElement>
			{completeMessage.split(scribbleDescription)[1].split(spotName)[0]}
			<TextElement
				onPress={(e) => {
					e.stopPropagation();
					handleRedirectToSpot();
				}}
				textStyles={`text-white text-sm font-bold underline`}
			>
				{spotName}
			</TextElement>
			{completeMessage.split(spotName)[1]}
		</>
	);
};
