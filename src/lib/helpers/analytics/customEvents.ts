import {
	TypeAddSpotToSpotListEvent,
	TypeAddStatusTagsEvent,
} from '@/lib/types/spot';
import { TypeSpotListDataEvent } from '@/lib/types/spotList';
import { TypePlayScreenAnalytics, TypeUserDataEvent } from '@/lib/types/user';
import analytics from '@react-native-firebase/analytics';

export const followListEvent = async (values: TypeSpotListDataEvent) => {
	const eventName = 'follow_list';
	await analytics().logEvent(eventName, values);
};

export const followUserEvent = async (values: TypeUserDataEvent) => {
	const eventName = 'follow_user';
	await analytics().logEvent(eventName, values);
};

export const addSpotToSpotListEvent = async (
	values: TypeAddSpotToSpotListEvent,
) => {
	const eventName = 'add_spot_to_spot_list';

	await analytics().logEvent(eventName, values);
};

export const addStatusTagsEvent = async (values: TypeAddStatusTagsEvent) => {
	const eventName = 'add_status_tags';
	await analytics().logEvent(eventName, values);
};

export const createListEvent = async (values: TypeSpotListDataEvent) => {
	const eventName = 'create_list';
	await analytics().logEvent(eventName, values);
};

export const visitPlayScreen = async (values: TypePlayScreenAnalytics) => {
	const eventName = 'play_screen';
	await analytics().logEvent(eventName, values);
};
