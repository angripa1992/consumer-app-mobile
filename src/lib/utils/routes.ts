import {
	TypeGetAllUserScribblesParams,
	TypeScribbleOptionFilter,
} from '../types/scribbles';
import { ALL_CITIES } from './constants';

export const USER_ENDPOINTS = {
	SIGN_IN: '/api/v4/users/sign_in',
	GET_USER: (userId: number) => `/api/v4/users/${userId}`,
	GET_PUBLIC_USER: (userId: number) => `/api/v2/users/public/${userId}`,
	PUT_USER: (userId: number) => `/api/v4/users/${userId}`,
	DELETE_USER: (userId: number) => `/api/v2/users/${userId}`,
	GET_RELEVANT_USERS: (city: string) =>
		`/api/v2/users/relevant_profiles?city=${city}`,
	POST_ONBOARDING_PREFERENCES: 'api/v2/users/onboarding',
	GET_USER_LISTS: (
		categoryName: string,
		limit: number,
		offset: number = 0,
		userId: number,
	) =>
		`/api/v2/users/${userId}/user_categories/category?category_name=${categoryName}&limit=${limit}&offset=${offset}`,
	GET_USER_FOLLOW_USERS: (
		userId: number,
		queryUser: string,
		limit: number,
		offset: number = 0,
	) =>
		`/api/v2/users/${userId}/followers_followed?query_user=${queryUser}&limit=${limit}&offset=${offset}`,
	GET_APP_VERSION: '/api/v2/app_versions/',
};

export const FILTER_ENDPOINTS = {
	GET_CITIES: '/api/v2/cities/',
	GET_TAGS: '/api/v2/tags/',
};

export const COUNTRIES_ENDPOINTS = {
	GET_COUNTRIES: '/api/v2/countries/',
	POST_COUNTRY_BY_IP: '/api/v2/countries/user',
};

export const CITY_ENDPOINTS = {
	GET_ALL_ACTIVE_CITIES: '/api/v3/cities/active_cities/',
	GET_ALL_AREAS_BY_CITY: '/api/v3/cities/city_area/',
};

export const SPOT_LIST_ENDPOINTS = {
	POST_SPOT_LIST: '/api/v2/spot_lists/',
	GET_SINGLE_SPOT_LIST: (spotListId: number) =>
		`/api/v2/spot_lists/${spotListId}`,
	GET_SPOTS_FROM_SPOT_LIST: (
		spotListId: number,
		viewerUserId: number,
		limit: number,
		offset: number = 0,
	) =>
		`/api/v4/spot_lists/${spotListId}/spots/?limit=${limit}&offset=${offset}&viewer_user_id=${viewerUserId}`,
	GET_ALL_SPOT_LISTS: (country: string, city: string) => {
		if (city === ALL_CITIES) {
			return `/api/v2/users/user_categories/?all_cities=${country}`;
		}

		return `/api/v2/users/user_categories/?city=${city}`;
	},
	PUT_SPOT_LIST: (spotListId: number | string) =>
		`/api/v2/spot_lists/${spotListId}`,
	DELETE_SPOT_LIST: (spotListId: number | string) =>
		`/api/v2/spot_lists/${spotListId}`,
	ADD_SPOT_TO_SPOT_LIST: '/api/v7/spot_spot_lists/',
	PUT_SPOT_TO_SPOT_LIST: (spotToSpotListId: number | string) =>
		`/api/v2/spot_spot_lists/${spotToSpotListId}`,
	GET_RELEVANT_SPOT_LISTS: (city: string) =>
		`/api/v2/spot_lists/relevant_spot_lists?city=${city}`,
};

export const SPOT_ENDPOINTS = {
	POST_HAS_RELATIONSHIP_SPOT_AND_LIST:
		'/api/v7/spots/relationship_with_spot_list',
	GET_SINGLE_SPOT: (spotId: number | string) => `/api/v7/spots/${spotId}`,
	GET_FEATURED_LIST_FROM_SPOT: (spotId: number, viewerUserId: number) =>
		`/api/v2/spots/public/${spotId}/featured_lists/?viewer_user_id=${viewerUserId}`,
	GET_SINGLE_PUBLIC_SPOT: (spotId: string) => `/api/v2/spots/public/${spotId}`,
	DELETE_SINGLE_SPOT: (spotId: string) => `/api/v2/spots/${spotId}`,
	POST_SEARCH_CANDIDATES: (limit: number, offset: number = 0) =>
		`/api/v10/spots/search_candidates_coordinates?limit=${limit}&offset=${offset}`,
	GET_DETAILS_SPOT_CANDIDATE: (googlePlaceLocationId: string | number) =>
		`/api/v7/spots/spot_details/${googlePlaceLocationId}`,
	GET_ALL_SPOTS_AVAILABLE: (
		spotListId: number,
		city: string,
		limit: number,
		offset: number = 0,
	) => {
		const route = `/api/v5/spots/spots_available/${spotListId}?limit=${limit}&offset=${offset}`;

		return `${route}&city=${city}`;
	},
	POST_SPOT_IMAGE: '/api/v7/spots/spot_thumbnail_image',
	GET_SPOT_INTERACTIONS: (spotId?: number, googlePlacesId?: string) => {
		if (spotId) {
			return `/api/v2/spots/interactions/?spot_id=${spotId}`;
		}
		if (googlePlacesId) {
			return `/api/v2/spots/interactions/?google_place_location_id=${googlePlacesId}`;
		}
		return '';
	},
	GET_GENERAL_LIKES_FOR_SPOT: (
		viewerUserId: number,
		limit: number,
		offset: number,
		spotId?: number,
		googlePlaceLocationId?: string,
	) => {
		if (spotId) {
			return `/api/v2/spots/community?spot_id=${spotId}&category=likes&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		if (googlePlaceLocationId) {
			return `/api/v2/spots/community?google_place_location_id=${googlePlaceLocationId}&category=likes&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		return '';
	},
	GET_FOLLOWING_LIKES_FOR_SPOT: (
		viewerUserId: number,
		limit: number,
		offset: number,
		spotId?: number,
		googlePlaceLocationId?: string,
	) => {
		if (spotId) {
			return `/api/v2/spots/following?spot_id=${spotId}&category=likes&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		if (googlePlaceLocationId) {
			return `/api/v2/spots/following?google_place_location_id=${googlePlaceLocationId}&category=likes&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		return '';
	},
	GET_FOLLOWING_FEATURED_LISTS: (
		viewerUserId: number,
		limit: number,
		offset: number = 0,
		spotId?: number,
		googlePlacesId?: string,
	) => {
		if (spotId) {
			return `/api/v2/spots/public/following/featured_lists?spot_id=${spotId}&limit=${limit}&offset=${offset}&viewer_user_id=${viewerUserId}`;
		}
		if (googlePlacesId) {
			return `/api/v2/spots/public/following/featured_lists?google_place_location_id=${googlePlacesId}&limit=${limit}&offset=${offset}&viewer_user_id=${viewerUserId}`;
		}
		return '';
	},
	GET_GENERAL_FEATURED_LISTS: (
		viewerUserId: number,
		limit: number,
		offset: number = 0,
		spotId?: number,
		googlePlacesId?: string,
	) => {
		if (spotId) {
			return `/api/v3/spots/public/featured_lists?spot_id=${spotId}&limit=${limit}&offset=${offset}&viewer_user_id=${viewerUserId}`;
		}
		if (googlePlacesId) {
			return `/api/v3/spots/public/featured_lists?google_place_location_id=${googlePlacesId}&limit=${limit}&offset=${offset}&viewer_user_id=${viewerUserId}`;
		}
		return '';
	},
};

export const SPOT_SPOT_LIST_ENDPOINTS = {
	DELETE_SPOT_SPOT_LIST: (spotId: number) =>
		`/api/v2/spot_spot_lists/${spotId}`,
	PUT_ORDER_SPOT_SPOT_LIST: `/api/v2/spot_spot_lists/order`,
};

export const FOLLOW_ENDPOINTS = {
	PUT_FOLLOW: '/api/v2/followers_status/',
};

export const REPORT_ENDPOINTS = {
	GET_ALL_REPORT_REASON: '/api/v2/report_reason_types/',
	POST_REPORT: '/api/v2/reports/',
};

export const ORDER_SUPPLIERS_ENDPOINTS = {
	GET_ALL_ORDER_SUPPLIERS: '/api/v2/order_suppliers/',
};

export const SPOT_STATUS_TAGS_ENDPOINTS = {
	UPDATE_SPOT_STATUS_TAGS: `/api/v7/spots/status_tags/`,
};

export const STATUS_TAGS_ENDPOINTS = {
	GET_ALL_STATUS_TAGS: '/api/v2/status_tags/',
};

export const CUISINE_ENDPOINTS = {
	GET_ALL_CUISINE_TYPES: '/api/v2/cuisine_types/',
};

export const WAIT_LIST_ENDPOINTS = {
	POST_REFERRAL_CODE: '/api/v3/referral_codes/',
	POST_CHECK_REFERRAL_CODE: '/api/v3/referral_codes/sign_in',
	POST_GET_CODE_TO_INVITE: '/api/v3/authorized_user_codes/',
	POST_GET_GUEST_USERS: '/api/v3/guest_users/',
	POST_VERIFY_AUTHORIZED_USER: '/api/v2/authorized_users/status',
	POST_TAROT_QUIZ_CODE: '/api/v4/tarot_quizzes/',
};

export const BLOCK_ENDPOINTS = {
	POST_BLOCK_USER: (userId: number) => `/api/v2/users/${userId}/block/`,
	GET_ALL_BLOCKED_USER: (userId: number) => `/api/v2/users/${userId}/blocked/`,
	PUT_BLOCK_USER: (userId: number) => `/api/v2/users/${userId}/unblock/`,
};

export const DISCOVERY_ENDPOINTS = {
	POST_SEARCH: (city: string, limit: number, offset: number = 0) => {
		return `/api/v8/spots/discover?city=${city}&limit=${limit}&offset=${offset}`;
	},
	POST_SPOTS: (
		city: string,
		area: string,
		limit: number,
		offset: number = 0,
	) => {
		return `/api/v9/spots/discover_matches?city=${area ?? city}&limit=${limit}&offset=${offset}`;
	},
	POST_LISTS: (city: string, limit: number, offset: number = 0) => {
		return `/api/v8/spots/discover/lists/?city=${city}&limit=${limit}&offset=${offset}`;
	},
	POST_CATEGORIES: (city: string) => {
		return `/api/v8/spots/discover/categories/?city=${city}`;
	},
	GET_SPOTS_NEARBY: `/api/v7/spots/discover/spots_nearby`,
	POST_PEOPLE: (limit: number, offset: number = 0) =>
		`/api/v9/spots/discover/peoples/?limit=${limit}&offset=${offset}`,
};

export const AUTHORIZED_USERS = {
	GET_SINGLE_AUTHORIZED_USER: (userId: number) =>
		`/api/v2/authorized_users/${userId}`,
	POST_AUTHORIZED_USER: '/api/v2/authorized_users/',
	PUT_SINGLE_AUTHORIZED_USER: (userId: number) =>
		`/api/v2/authorized_users/${userId}`,
	DELETE_SINGLE_AUTHORIZED_USER: (userId: number) =>
		`/api/v2/authorized_users/${userId}`,
};

export const USER_SPOTS_ENDPOINTS = {
	GET_ALL_USER_SPOTS: (userId: number) => `api/v4/users/${userId}/spots_user`,
	DELETE_USER_SPOT: (userId: number, spotId: number) =>
		`api/v2/users/${userId}/spots_user/${spotId}`,
};

export const VIEW_MORE_ENDPOINTS = {
	GET_VIEW_MORE_HOME: (
		userId: number,
		city: string,
		categoryName: string,
		limit: number,
		offset: number = 0,
	) => {
		return `/api/v2/users/${userId}/user_categories/category?category_name=${categoryName}&limit=${limit}&offset=${offset}&city=${city}`;
	},
	GET_VIEW_MORE_USER_SPOTS: (
		userId: number,
		tag: string,
		limit: number,
		offset: number = 0,
		city: string,
	) => {
		return `/api/v5/users/${userId}/spots_user/spots_by_tag?tag=${tag}&limit=${limit}&offset=${offset}&city=${city}`;
	},
	POST_VIEW_MORE_DISCOVERY_CATEGORIES: (
		city: string,
		categoryName: string,
		limit: number,
		offset: number = 0,
		tag_spot_list?: string,
	) => {
		const route = `/api/v4/spots/discover/categories?city=${city}&category_name=${categoryName}&limit=${limit}&offset=${offset}`;

		if (categoryName === 'categories') {
			return `${route}&tag_spot_list=${tag_spot_list}`;
		}

		return route;
	},
	GET_SPOTS_NEARBY: `/api/v7/spots/discover/spots_nearby`,
};

export const FEED_ENDPOINTS = {
	GET_GENERAL_FEED: (limit: number, offset: number) =>
		`/api/v7/feeds/?limit=${limit}&offset=${offset}`,
	GET_FOLLOWING_FEED: (limit: number, offset: number) =>
		`/api/v7/feeds/following/?limit=${limit}&offset=${offset}`,
	GET_CREATOR_FEED: (limit: number, offset: number) =>
		`/api/v8/feeds/creator?limit=${limit}&offset=${offset}`,
	POST_EMOJI_TO_EVENT: '/api/v4/emojis/',
	DELETE_EMOJI_TO_EVENT: (
		eventEmojiId: number,
		variationsCodeId: string | null,
	) => {
		const route = `/api/v4/emojis/${eventEmojiId}`;
		if (variationsCodeId) {
			return `${route}?variations_code_id=${variationsCodeId}`;
		}

		return route;
	},
};

export const SCRIBBLES_ENDPOINTS = {
	GET_GENERAL_SCRIBBLES: (
		viewerUserId: number,
		limit: number,
		offset: number,
		spotId?: number,
		googlePlaceLocationId?: string,
	) => {
		if (spotId) {
			return `/api/v2/spots/community?spot_id=${spotId}&category=scribbles&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		if (googlePlaceLocationId) {
			return `/api/v2/spots/community?google_place_location_id=${googlePlaceLocationId}&category=scribbles&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		return '';
	},
	GET_FOLLOWING_SCRIBBLES: (
		viewerUserId: number,
		limit: number,
		offset: number,
		spotId?: number,
		googlePlaceLocationId?: string,
	) => {
		if (spotId) {
			return `/api/v2/spots/following?spot_id=${spotId}&category=scribbles&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		if (googlePlaceLocationId) {
			return `/api/v2/spots/following?google_place_location_id=${googlePlaceLocationId}&category=scribbles&viewer_user_id=${viewerUserId}&offset=${offset}&limit=${limit}`;
		}
		return '';
	},
	POST_SCRIBBLE: '/api/v3/scribbles/',
	PUT_SCRIBBLE: (scribbleId: number) => `/api/v3/scribbles/${scribbleId}`,
	DELETE_SCRIBBLE: (scribbleId: number) => `/api/v1/scribbles/${scribbleId}`,
	GET_SCRIBBLES_RECOMMENDATIONS: (
		id: number | string,
		isFromGooglePlace?: boolean,
	) => {
		if (isFromGooglePlace) {
			return `/api/v2/spots/scribble_recommendations/?google_place_location_id=${id}`;
		}
		return `/api/v2/spots/scribble_recommendations/?spot_id=${id}`;
	},
	GET_SINGLE_SCRIBBLE: (scribbleId: number) =>
		`/api/v9/scribbles/${scribbleId}`,
	GET_ALL_USER_SCRIBBLES: (
		userId: number,
		scribbleOption: TypeScribbleOptionFilter,
		offset: number,
		limit: number,
		city?: string,
	) =>
		`api/v2/scribbles/${userId}/?scribble_option=${scribbleOption}&limit=${limit}&offset=${offset}${!!city ? 'city=' + city : ''}`,
};

export const AUTHORIZED_SPOTS = {
	POST_AUTHORIZED_SPOT: '/api/v3/authorized_spots/',
};

export const TAROT_ENDPOINTS = {
	GET_ALL_TAROT_SHAPES: 'api/v4/tarot_shapes/',
	GET_ALL_TAROT_CODES: 'api/v4/tarot_codes/',
	GET_SINGLE_TAROT_USER: (userId: number) => `api/v4/tarot_users/${userId}`,
	PUT_SINGLE_TAROT_USER: (userId: number) => `api/v4/tarot_users/${userId}`,
};

export const NOTIFICATIONS_ENDPOINTS = {
	GET_NOTIFICATIONS: (limit: number, offset: number = 0) =>
		`/api/v1/notifications/?limit=${limit}&offset=${offset}`,
	GET_TOKENS: '/api/v1/user_notification_tokens/',
	POST_USER_NOTIFICATIONS_TOKEN: '/api/v1/user_notification_tokens/',
	DELETE_USER_NOTIFICATIONS_TOKEN: (token: string) =>
		`/api/v1/user_notification_tokens/${token}`,
};

export const PLAY_ENDPOINTS = {
	POST_PEOPLE: (limit: number, offset: number = 0) =>
		`/api/v9/spots/discover/peoples/?limit=${limit}&offset=${offset}`,
};
