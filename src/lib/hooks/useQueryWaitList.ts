import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from 'react-native-toast-notifications';

import { useAppStore } from '../store/store';
import { WAIT_LIST_ENDPOINTS } from '../utils/routes';

import { postData, postDataWithToken } from '../helpers/postData';

import { AxiosError } from 'axios';
import { auth } from '../../../config/firebase';
import { ZodError } from 'zod';
import * as Sentry from '@sentry/react-native';
import { useShallow } from 'zustand/react/shallow';
import {
	postAuthReferralCodeResponseSchema,
	postCheckReferralCodeResponseSchema,
	postGetCodeToInviteResponseSchema,
	postGetGuestUsersResponseSchema,
	postTarotQuizCodeResponseSchema,
	postVerifyAuthorizedUserResponseSchema,
} from '../schemas/waitList';
import {
	TypeCheckWaitListCodeForm,
	TypeGetCodeToInviteForm,
	TypeGetGuestUsersForm,
	TypePostBodyTasteTarotQuizCode,
	TypeVerifyAuthorizedUserValues,
} from '../types/waitList';
import { isEmail } from '../helpers/strings/isEmail';
import { useDebounce } from './useDebounce';
import { i18nInstance } from 'config/i18n';

export const fetchPostAuthReferralCode = async (userInfo: string) => {
	const idToken = await auth.currentUser?.getIdToken();
	if (!idToken) return null;

	const endpoint = WAIT_LIST_ENDPOINTS.POST_REFERRAL_CODE;
	const response = await postDataWithToken(endpoint, {}, idToken, userInfo);

	return postAuthReferralCodeResponseSchema.parse(response);
};
export const usePostAuthReferralCode = () => {
	const { setIsLoading, user } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			user: state.user,
		})),
	);

	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['referralCode', user?.id],
		queryFn: () => {
			setIsLoading(isLoading);
			return fetchPostAuthReferralCode(userInfo);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		referralCode: data?.referral_code,
		isLoading,
		isError,
		error,
		refetch,
	};
};

export const fetchPostCheckReferralCode = async (
	values: TypeCheckWaitListCodeForm,
) => {
	const endpoint = WAIT_LIST_ENDPOINTS.POST_CHECK_REFERRAL_CODE;
	const response = await postData(endpoint, values);

	return postCheckReferralCodeResponseSchema.parse(response);
};

export const usePostCheckReferralCode = () => {
	const { setIsLoading } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
		})),
	);

	return useMutation({
		mutationFn: (values: TypeCheckWaitListCodeForm) => {
			return fetchPostCheckReferralCode(values);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

export const fetchPostGetCodeToInvite = async (
	values: TypeGetCodeToInviteForm,
) => {
	const endpoint = WAIT_LIST_ENDPOINTS.POST_GET_CODE_TO_INVITE;
	const response = await postData(endpoint, values);

	return postGetCodeToInviteResponseSchema.parse(response);
};
export const usePostGetCodeToInvite = () => {
	const { setIsLoading, waitlistUserEmail } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			waitlistUserEmail: state.waitlistUserEmail,
		})),
	);

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['codeToInvite', waitlistUserEmail],
		queryFn: () => {
			if (!waitlistUserEmail) return null;
			setIsLoading(isLoading);
			return fetchPostGetCodeToInvite({
				email: waitlistUserEmail,
			});
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});

	return {
		codeToInvite: data?.authorized_user_code,
		isLoading,
		isError,
		error,
		refetch,
	};
};

export const fetchPostGetGuestUsers = async (values: TypeGetGuestUsersForm) => {
	const endpoint = WAIT_LIST_ENDPOINTS.POST_GET_GUEST_USERS;
	const response = await postData(endpoint, values);

	return postGetGuestUsersResponseSchema.parse(response);
};
export const usePostGetGuestUsers = () => {
	const { setIsLoading, waitlistUserEmail } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
			waitlistUserEmail: state.waitlistUserEmail,
		})),
	);

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['guestUsers', waitlistUserEmail],
		queryFn: () => {
			if (!waitlistUserEmail) return null;
			setIsLoading(isLoading);
			return fetchPostGetGuestUsers({
				email: waitlistUserEmail,
			});
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		refetchInterval: 20000,
	});

	return {
		guestUserCounter: data?.guest_user_counter,
		isLoading,
		isError,
		error,
		refetch,
	};
};

export const fetchPostVerifyAuthorizedUser = async (
	values: TypeVerifyAuthorizedUserValues,
) => {
	const endpoint = WAIT_LIST_ENDPOINTS.POST_VERIFY_AUTHORIZED_USER;
	const response = await postData(endpoint, values);

	return postVerifyAuthorizedUserResponseSchema.parse(response);
};
export const useGetVerifyAuthorizedUser = (email: string | null) => {
	const emailDebounce = useDebounce(email, 300);
	const { setIsLoading } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
		})),
	);

	const isEmailValid = !!emailDebounce ? isEmail(emailDebounce) : false;

	const { data, isError, error, isLoading, refetch } = useQuery({
		queryKey: ['authorizedUser', emailDebounce],
		queryFn: () => {
			setIsLoading(isLoading);
			if (!emailDebounce) return null;

			return fetchPostVerifyAuthorizedUser({
				email: emailDebounce,
			});
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}

			if (err.response?.status !== 404 && err.response?.status !== 422) {
				console.error(err);
			}
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
		enabled: isEmailValid,
		retry: false,
	});

	return {
		isApproved: data?.is_approved,
		isLoading,
		isError,
		error,
		refetch,
	};
};

export const usePostVerifyAuthorizedUser = () => {
	const toast = useToast();
	const { setIsLoading } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
		})),
	);

	return useMutation({
		mutationFn: (values: TypeVerifyAuthorizedUserValues) => {
			return fetchPostVerifyAuthorizedUser(values);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err?.response?.status === 404) {
				toast.show(i18nInstance.t('emailNotFoundTryTasteTest'), {
					type: 'error',
					placement: 'bottom',
				});
			}

			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};

// POST TASTE TAROT QUIZ CODE
const fetchPostTarotQuizCode = async (
	values: TypePostBodyTasteTarotQuizCode,
) => {
	const endpoint = WAIT_LIST_ENDPOINTS.POST_TAROT_QUIZ_CODE;
	const response = await postData(endpoint, values);

	return postTarotQuizCodeResponseSchema.parse(response);
};
export const usePostTarotQuizCode = () => {
	const { setIsLoading } = useAppStore(
		useShallow((state) => ({
			setIsLoading: state.setIsLoading,
		})),
	);

	return useMutation({
		mutationFn: (values: TypePostBodyTasteTarotQuizCode) => {
			return fetchPostTarotQuizCode(values);
		},
		onSuccess: () => {
			setIsLoading(false);
		},
		onError: (err: AxiosError) => {
			if (err instanceof ZodError) {
				Sentry.captureException(err);
			}
			console.error(err);
			setIsLoading(false);
		},
		onSettled: () => {
			setIsLoading(false);
		},
	});
};
