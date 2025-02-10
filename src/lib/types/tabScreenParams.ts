import type { ParamListBase } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { StackNavigationProp } from '@react-navigation/stack';

import type {
	TypeCreateSpotListScreen,
	TypeSpotListSinglePage,
	TypeSpotListWithTag,
} from './spotList';
import type { TypeFollowListFilter } from './profile';
import type { TypeViewMoreScreen } from './discovery';

export type CommonListNavigation = {
	SingleList: {
		spotListId: number;
		spotList?: TypeSpotListWithTag | null;
	};
	SearchSpot: {
		spotListId: number;
	};
	MapScreen: {
		spotListName: string;
		spotListId: number;
		spotsCounter: number;
		isSpotListOwner: boolean;
	};
};

export type CommonProfileNavigation = {
	ProfileScreen: { userId: number; isFollow?: boolean };
	FollowView: { userId: number; filter: TypeFollowListFilter };
};

//Lists
export type ListStackParamList = CommonListNavigation &
	CommonProfileNavigation & {
		ListsScreen: undefined;
		ViewMore: TypeViewMoreScreen;
	};

export type SingleListScreenRouteParams = NativeStackScreenProps<
	ListStackParamList,
	'SingleList'
>;

export type SearchSpotScreenRouteParams = NativeStackScreenProps<
	ListStackParamList,
	'SearchSpot'
>;

export type MapRouteParams = NativeStackScreenProps<
	ListStackParamList,
	'MapScreen'
>;

export type ViewMoreRouteParams = NativeStackScreenProps<
	ListStackParamList,
	'ViewMore'
>;

export type ListNavigationRouteParams =
	NativeStackScreenProps<ListStackParamList>;

export type ListScreenNavigationProp = ListNavigationRouteParams['navigation'];

export type ViewMoreScreenNavigationProp = ViewMoreRouteParams['navigation'];

// Feed
export type FeedStackParamList = CommonListNavigation &
	CommonProfileNavigation & {
		FeedScreen: undefined;
		ViewMore: TypeViewMoreScreen;
		Notifications: undefined;
	};

export type FeedNavigationRouteParams = NativeStackScreenProps<
	FeedStackParamList,
	'FeedScreen'
>;

export type FeedScreenNavigationProps = FeedNavigationRouteParams['navigation'];

//Profile
export type ProfileStackParamList = CommonProfileNavigation &
	CommonListNavigation & {
		MyProfileScreen: undefined;
		ViewMore: TypeViewMoreScreen;
	};

export type ProfileNavigationRouteParams =
	NativeStackScreenProps<ProfileStackParamList>;

export type ProfileScreenRouteParams = NativeStackScreenProps<
	ProfileStackParamList,
	'ProfileScreen'
>;

export type FollowViewRouteParams = NativeStackScreenProps<
	ProfileStackParamList,
	'FollowView'
>;

export type ProfileScreenNavigationProp =
	ProfileScreenRouteParams['navigation'];

export type ProfileScreenRouteProp = ProfileScreenRouteParams['route'];

//Discovery

export type DiscoveryStackParamList = CommonListNavigation &
	CommonProfileNavigation & {
		DiscoveryScreen: undefined;
		ViewMore: TypeViewMoreScreen;
	};
export type DiscoveryScreenRouteParams = NativeStackScreenProps<
	DiscoveryStackParamList,
	'DiscoveryScreen'
>;

export type DiscoveryScreenNavigationProp =
	DiscoveryScreenRouteParams['navigation'];

// Onboarding

export type OnboardingStackParamList = {
	InitialView: undefined;
	ProgressView: undefined;
	FinalView: {
		tags: Array<string>;
		relevantUsers: Array<number>;
		relevantLists: Array<number>;
	};
};


export type OnboardingInitialViewRouteParams = NativeStackScreenProps<
	OnboardingStackParamList,
	'InitialView'
>;

export type OnboardingProgressViewRouteParams = NativeStackScreenProps<
	OnboardingStackParamList,
	'ProgressView'
>;

export type OnboardingFinalViewRouteParams = NativeStackScreenProps<
	OnboardingStackParamList,
	'FinalView'
>;

export type OnboardingRouteParams =
	NativeStackScreenProps<OnboardingStackParamList>;

export type OnboardingNavigationProp = OnboardingRouteParams['navigation'];

// auth

export type AuthStackParamList = {
	WaitList: undefined;
	Login: undefined;
	SignUp: undefined;
	WaitListUseCode: undefined;
	WaitListShareUs: undefined;
	WaitListInviteFriends: undefined;
	WaitListTarotQuiz: undefined;
	ForgotPassword: undefined;
};

export type AuthWaitListRouteParams = NativeStackScreenProps<
	AuthStackParamList,
	'WaitList'
>;

export type AuthLoginRouteParams = NativeStackScreenProps<
	AuthStackParamList,
	'Login'
>;

export type AuthSignUpRouteParams = NativeStackScreenProps<
	AuthStackParamList,
	'SignUp'
>;

export type AuthForgotPasswordRouteParams = NativeStackScreenProps<
	AuthStackParamList,
	'ForgotPassword'
>;

export type AuthRouteParams = NativeStackScreenProps<AuthStackParamList>;

export type AuthNavigationProp = AuthRouteParams['navigation'];

export type AuthWaitListNavigationProp = AuthWaitListRouteParams['navigation'];

export type AuthLoginNavigationProp = AuthLoginRouteParams['navigation'];

export type AuthSignUpNavigationProp = AuthSignUpRouteParams['navigation'];

//Navigation

export type NavigationProps = StackNavigationProp<ParamListBase>;

//App
export type AppStackParamList = CommonListNavigation &
	CommonProfileNavigation & {
		ProfileForm: undefined;
		TabScreens: undefined;
		ListEdit: {
			spotList: TypeSpotListSinglePage;
		};
		ListCreate: TypeCreateSpotListScreen;
		CreateBasicSpot: {
			country: string;
			city: string;
		};
		InviteFriends: undefined;
		ErrorScreen: undefined;
		PlayNavigator: undefined;
		LikesForSpot: {
			spotId?: number;
			googlePlacesId?: string;
		};
		ScribblesForSpot: {
			spotId?: number;
			googlePlacesId?: string;
		};
		ListsForSpot: {
			spotId?: number;
			googlePlacesId?: string;
		};
		SingleSpot: {
			spotId: number | string;
			isCandidateSpot?: boolean;
			listIdToAddSpot?: number;
			spotSpotListIdToRemove?: number | null;
		};
	};

export type AppStackNavigationParams =
	NativeStackScreenProps<AppStackParamList>;

export type AppStackNavigationProp = AppStackNavigationParams['navigation'];

export type SpotScreenRouteParams = NativeStackScreenProps<
	ListStackParamList &
	ProfileStackParamList &
	DiscoveryStackParamList &
	AppStackParamList,
	'SingleSpot'
>;

export type LikesForSpotScreenRouteParams = NativeStackScreenProps<
	ListStackParamList &
	ProfileStackParamList &
	DiscoveryStackParamList &
	AppStackParamList,
	'LikesForSpot'
>;

export type ScribblesForSpotScreenRouteParams = NativeStackScreenProps<
	ListStackParamList &
	ProfileStackParamList &
	DiscoveryStackParamList &
	AppStackParamList,
	'ScribblesForSpot'
>;

export type ListsForSpotScreenRouteParams = NativeStackScreenProps<
	ListStackParamList &
	ProfileStackParamList &
	DiscoveryStackParamList &
	AppStackParamList,
	'ListsForSpot'
>;

export type ListEditScreenRouteParams = NativeStackScreenProps<
	AppStackParamList,
	'ListEdit'
>;

export type SpotScreenRouteProp = SpotScreenRouteParams['navigation'];

export type ListCreateScreenRouteParams = NativeStackScreenProps<
	AppStackParamList,
	'ListCreate'
>;

export type CreateScreenNavigationProp =
	ListCreateScreenRouteParams['navigation'];

export type CreateBasicSpotScreenRouteParams = NativeStackScreenProps<
	AppStackParamList,
	'CreateBasicSpot'
>;

export type CreateBasicSpotScreenNavigationProp =
	CreateBasicSpotScreenRouteParams['navigation'];

//Play	
export type PlayStackParamList = {
	PlayScreen: undefined;
	HoldOnScreen: undefined;
	MatchMakerScreen: undefined;
	PlayNowScreen: undefined;
	SelectCityScreen: undefined;
	QueuePlayScreen: {
		spotId: number | string;
		isCandidateSpot?: boolean;
		listIdToAddSpot?: number;
		spotSpotListIdToRemove?: number | null;
	};
}
export type PlayScreenRouteParams = NativeStackScreenProps<
	PlayStackParamList,
	'PlayScreen'
>;

export type PlayScreenNavigationProp = PlayScreenRouteParams['navigation'];

export type HoldOnScreenRouteParams = NativeStackScreenProps<
	PlayStackParamList,
	'HoldOnScreen'
>;

export type HoldOnScreenNavigationProp = HoldOnScreenRouteParams['navigation'];

export type MatchMakerScreenRouteParams = NativeStackScreenProps<
	PlayStackParamList,
	'MatchMakerScreen'
>;

export type MatchMakerScreenNavigationProp = MatchMakerScreenRouteParams['navigation'];

export type PlayNowScreenRouteParams = NativeStackScreenProps<
	PlayStackParamList,
	'PlayNowScreen'
>;

export type PlayNowScreenNavigationProp = PlayNowScreenRouteParams['navigation'];

export type SelectCityScreenRouteParams = NativeStackScreenProps<
	PlayStackParamList,
	'SelectCityScreen'
>;

export type QueuePlayScreenRouteParams = NativeStackScreenProps<
	PlayStackParamList &
	SpotScreenRouteParams &
	AppStackParamList,
	'QueuePlayScreen'
>;

