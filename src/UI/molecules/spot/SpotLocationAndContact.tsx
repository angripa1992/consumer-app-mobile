import TextElement from '@/UI/atoms/text/TextElement';

import { PressableProps, View } from 'react-native';
import SpotContact from './SpotContact';
import MapSingle from '@/UI/organism/map/MapSingle';
import { TypeWeekdayText } from '@/lib/types/spot';

type SpotLocationAndContactProps = {
	hasStatusBeenTo: boolean;
	onClickBeenTo: PressableProps['onPress'];
	weekday_text?: TypeWeekdayText[] | null;
	price_level?: string | null;
	address?: string | null;
	phone?: string | null;
	website_option_one?: string | null;
	website_option_two?: string | null;
	website_option_three?: string | null;
	latitude?: number | null;
	longitude?: number | null;
};

const SpotLocationAndContact = ({
	hasStatusBeenTo,
	weekday_text,
	address,
	phone,
	price_level,
	website_option_one,
	website_option_three,
	website_option_two,
	latitude,
	longitude,
	onClickBeenTo,
}: SpotLocationAndContactProps) => {
	return (
		<>
			<SpotContact
				hasStatusBeenTo={hasStatusBeenTo}
				onClickBeenTo={onClickBeenTo}
				weekday_text={weekday_text}
				price_level={price_level}
				address={address}
				phone={phone}
				website_option_one={website_option_one}
				website_option_three={website_option_three}
				website_option_two={website_option_two}
			/>
			<View className={'mt-1 mb-4'}>
				<TextElement textStyles='text-base text-gray font-bold mb-3'>
					Map
				</TextElement>
				<MapSingle
					latitude={latitude}
					longitude={longitude}
					containerStyles={`w-full ${latitude && longitude ? 'h-[180px]' : ''}`}
				/>
			</View>
		</>
	);
};

export default SpotLocationAndContact;
