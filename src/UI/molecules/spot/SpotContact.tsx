import { PressableProps, View } from 'react-native';
import { useState } from 'react';

import { i18nInstance } from 'config/i18n';
import { getCurrentDay } from '@/lib/helpers/dates/getCurrentDay';
import { isPhoneNumber } from '@/lib/helpers/isPhoneNumber';
import { isCurrentHourInASpecificTimeRange } from '@/lib/helpers/time/timeInARange';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import TextElement from '@/UI/atoms/text/TextElement';
import Link from '@/UI/atoms/link/Link';
import BeenToIcon from '@/svg/BeenToIcon';
import ClockIcon from '@/svg/ClockIcon';
import LocationMarkerIcon from '@/svg/LocationMarkerIcon';
import MoneyIcon from '@/svg/MoneyIcon';
import PhoneIcon from '@/svg/PhoneIcon';
import InfoIcon from '@/svg/InfoIcon';
import WebsiteIcon from '@/svg/WebsiteIcon';
import ModalOpeningHours from './Modal/ModalOpeningHours';

import type { TypeWeekdayText } from '@/lib/types/spot';

type SpotContact = {
	isLoadingBeenTo?: boolean;
	isLoadingUpdateStatusTags?: boolean;
	hasStatusBeenTo: boolean;
	onClickBeenTo: PressableProps['onPress'];
	weekday_text?: TypeWeekdayText[] | null;
	price_level?: string | null;
	address?: string | null;
	phone?: string | null;
	website_option_one?: string | null;
	website_option_two?: string | null;
	website_option_three?: string | null;
};

const SpotContact = ({
	hasStatusBeenTo,
	onClickBeenTo,
	weekday_text,
	address,
	phone,
	price_level,
	website_option_one,
	website_option_three,
	website_option_two,
}: SpotContact) => {
	const [showHoursModal, setShowHoursModal] = useState(false);

	const hasPhone = !!phone;
	const hasPriceLevel = !!price_level;

	const priceLevelToShow = hasPriceLevel
		? price_level
		: i18nInstance.t('thisSpotNotHaveAPriceLevel');
	const phoneToShow = hasPhone
		? phone
		: i18nInstance.t('thisSpotNotHaveAPhoneContact');

	const beenToText = hasStatusBeenTo
		? i18nInstance.t('visited')
		: i18nInstance.t('visitedTapMe');

	const getOpeningHoursOfCurrentDay = () => {
		const currentHours = weekday_text?.find(
			(day) => day.weekdays === getCurrentDay(),
		);

		return currentHours?.date ?? '';
	};

	const isSpotOpen = isCurrentHourInASpecificTimeRange(
		getOpeningHoursOfCurrentDay(),
		new Date(),
	);

	return (
		<>
			<ModalOpeningHours
				showModal={showHoursModal}
				setShowModal={setShowHoursModal}
				weekdayText={weekday_text}
			/>
			<View className='flex flex-row items-center mb-3'>
				<ButtonPrimary
					designVariation='ghost'
					isReactNodeContent
					buttonStyles='border-none p-0'
					nodeContentStyles='flex flex-row items-center justify-center'
					onPress={onClickBeenTo}
				>
					<BeenToIcon checked={hasStatusBeenTo} />
					<TextElement textStyles='text-xs text-gray pl-2'>
						{beenToText}
					</TextElement>
				</ButtonPrimary>
			</View>
			<View className='flex flex-row items-center mb-3'>
				<LocationMarkerIcon color='#858585' width={18} height={18} />
				<TextElement textStyles='text-xs text-gray pl-2 flex-1'>
					{address}
				</TextElement>
			</View>
			<ButtonPrimary
				buttonStyles='mb-3 !p-0'
				nodeContentStyles='flex flex-row items-center'
				designVariation='custom'
				isReactNodeContent
				onPress={() => {
					setShowHoursModal(true);
				}}
				testID='opening-hours-button'
			>
				<ClockIcon />
				<TextElement textStyles='text-xs text-gray pl-2 font-bold'>
					{i18nInstance.t(isSpotOpen ? 'openNow' : 'closedNow')}
				</TextElement>
				<TextElement textStyles='text-xs text-gray px-2'>
					{isSpotOpen
						? getOpeningHoursOfCurrentDay()
						: i18nInstance.t('seeAllHours')}
				</TextElement>
				<InfoIcon />
			</ButtonPrimary>
			<View className='flex flex-row items-center mb-3'>
				<MoneyIcon />
				<TextElement textStyles='text-xs text-gray pl-2  flex-1'>
					{priceLevelToShow}
				</TextElement>
			</View>
			<View className='flex flex-row items-center mb-3'>
				<PhoneIcon />
				{isPhoneNumber(phone) ? (
					<Link url={phoneToShow}>
						<TextElement textStyles='text-xs text-gray pl-2'>
							{phoneToShow}
						</TextElement>
					</Link>
				) : (
					<TextElement textStyles='text-xs text-gray pl-2'>
						{phoneToShow}
					</TextElement>
				)}
			</View>
			<View className='flex flex-row items-center mb-3'>
				<WebsiteIcon />
				<View>
					{website_option_one && (
						<TextElement textStyles='text-xs text-gray pl-2'>
							{website_option_one}
						</TextElement>
					)}
					{website_option_two && (
						<TextElement textStyles='text-xs text-gray pl-2'>
							{website_option_two}
						</TextElement>
					)}
					{website_option_three && (
						<TextElement textStyles='text-xs text-gray pl-2'>
							{website_option_three}
						</TextElement>
					)}
					{!website_option_one &&
						!website_option_two &&
						!website_option_three && (
							<TextElement textStyles='text-xs text-gray pl-2  flex-1'>
								{i18nInstance.t('thisSpotNotHaveWebsites')}
							</TextElement>
						)}
				</View>
			</View>
		</>
	);
};

export default SpotContact;
