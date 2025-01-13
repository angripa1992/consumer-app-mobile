import { useEffect } from 'react';
import Constants from 'expo-constants';

import {
	Auth,
	GoogleAuthProvider,
	UserCredential,
	createUserWithEmailAndPassword,
	signInWithCredential,
	signInWithEmailAndPassword,
	OAuthProvider,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from 'react-native-toast-notifications';

import { extractNameFromEmail } from '../helpers/strings/extractNameFromEmail';
import { auth } from '../../../config/firebase';
import {
	loginFormValuesSchema,
	signUpFormValuesSchema,
} from '@/lib/schemas/login';
import { useSingInUserQuery } from '@/lib/hooks/useQueryUser';
import { useAppStore } from '@/lib/store/store';
import { handlerFirebaseError } from '@/lib/helpers/handlerFirebaseError';
import { googleAuthCredentials } from '@/lib/data/googleAuth';

import { FirebaseError } from 'firebase/app';
import { handlerAuthError } from '../helpers/handlerAuthError';
import { useShallow } from 'zustand/react/shallow';
import { useGetVerifyAuthorizedUser } from './useQueryWaitList';

import * as Linking from 'expo-linking';

import type { TypeApproveUserStatus } from '../types/waitList';
import type { TypeKindOfAuth } from '../types/user';
import type {
	TypeLoginForm,
	TypeSignUpFormValuesSchema,
} from '@/lib/types/login';

type TypeUserDataToSignIn = {
	username: string;
	email: string;
	name: string;
	city?: string;
	auth_type: string;
};

export const useAuthSignIn = (authType: TypeKindOfAuth) => {
	const signInUser = useSingInUserQuery();
	const toast = useToast();

	const {
		setIsAuthenticating,
		setUserAuth,
		setIsLoadingAuth,
		setShowWaitlistContactSoonScreen,
		setWaitlistUserEmail,
		regenerateWaitlistNumber,
		waitlistReferralLink,
	} = useAppStore(
		useShallow((state) => ({
			isAuthenticating: state.isAuthenticating,
			setIsAuthenticating: state.setIsAuthenticating,
			setUserAuth: state.setUserAuth,
			setIsLoadingAuth: state.setIsLoadingAuth,
			setShowWaitlistContactSoonScreen: state.setShowWaitlistContactSoonScreen,
			setWaitlistUserEmail: state.setWaitlistUserEmail,
			regenerateWaitlistNumber: state.regenerateWaitlistNumber,
			waitlistReferralLink: state.waitlistReferralLink,
		})),
	);

	const formLoginMethods = useForm<TypeLoginForm>({
		defaultValues: {
			email: '',
			password: '',
		},
		resolver: zodResolver(loginFormValuesSchema),
	});

	const formSignUpMethods = useForm<TypeSignUpFormValuesSchema>({
		defaultValues: {
			email: '',
			password: '',
			name: '',
			city: '',
		},
		resolver: zodResolver(signUpFormValuesSchema),
	});

	const cityValue = formSignUpMethods.watch('city');
	const emailValue = formSignUpMethods.watch('email');
	const {
		isApproved,
		isLoading: isLoadingVerifyAuthorizedUser,
		error: errorFromVerifyAuthorizedUser,
		isError: isErrorVerifyAuthorizedUser,
	} = useGetVerifyAuthorizedUser(emailValue);

	const [_request, response, onGoogleButtonPress] = Google.useAuthRequest(
		googleAuthCredentials,
	);

	const verifyEmailInTheWaitList = (): TypeApproveUserStatus => {
		if (isLoadingVerifyAuthorizedUser) return 'loading';

		if (isErrorVerifyAuthorizedUser) {
			if (errorFromVerifyAuthorizedUser?.status === 404) return 'not found';
			return 'error';
		}

		if (isApproved) return 'approved';

		return 'not approved';
	};

	const approvedStatus = verifyEmailInTheWaitList();

	const handleSignInBackend = async (
		userData: TypeUserDataToSignIn,
		idToken: string,
		userCredentials: any,
	) => {
		const projectId =
			Constants?.expoConfig?.extra?.eas?.projectId ??
			Constants?.easConfig?.projectId;
		if (!projectId) {
			throw new Error('Project ID not found');
		}

		let referralCode: string | null = null;

		if (waitlistReferralLink) {
			const { queryParams } = Linking.parse(waitlistReferralLink);
			referralCode = ((queryParams?.referralCode ?? null) as string) || null;
		}

		await signInUser
			.mutateAsync({
				user: {
					...userData,
					code: authType === 'register' ? referralCode : null,
				},
				idToken,
			})
			.then(async (res) => {
				if (authType === 'register') {
					if (res?.code === 202) {
						setShowWaitlistContactSoonScreen('contactSoon');
						setWaitlistUserEmail(userData.email);
					}
					if (res?.code === 302) {
						toast.show(handlerAuthError(res.code), {
							type: 'danger',
							placement: 'bottom',
							duration: 8000,
						});
					} else {
						setUserAuth(userCredentials.user);
					}
				}
				if (authType === 'login') {
					setUserAuth(userCredentials.user);
					setWaitlistUserEmail(null);
					setShowWaitlistContactSoonScreen('form');
					regenerateWaitlistNumber();
				}
			})
			.catch((error) => {
				toast.show(handlerAuthError(error), {
					type: 'danger',
					placement: 'bottom',
					duration: 8000,
				});
			});
	};

	useEffect(() => {
		const handlerGoogleAuth = async () => {
			try {
				if (response?.type === 'success') {
					setIsLoadingAuth(true);
					setIsAuthenticating(true);
					const { id_token } = response.params;
					const credential = GoogleAuthProvider.credential(id_token);
					const userCredentials: any = await signInWithCredential(
						auth,
						credential,
					);

					const idToken = await userCredentials?.user.getIdToken();

					const nameFromEmail = extractNameFromEmail(
						userCredentials?.user.email,
					);

					const userData: TypeUserDataToSignIn = {
						username: userCredentials?.user.displayName ?? nameFromEmail ?? '',
						email: userCredentials?.user.email ?? '',
						name: userCredentials?.user.displayName ?? nameFromEmail ?? '',
						auth_type: authType,
					};

					if (authType === 'register') {
						userData.city = cityValue;
					}

					await handleSignInBackend(userData, idToken, userCredentials);
				}
			} catch (error: any) {
				if (error instanceof FirebaseError) {
					toast.show(handlerFirebaseError(error), {
						type: 'danger',
						placement: 'bottom',
						duration: 8000,
					});
				} else {
					toast.show(handlerAuthError(error), {
						type: 'danger',
						placement: 'bottom',
						duration: 8000,
					});
				}
			} finally {
				setIsLoadingAuth(false);
				setIsAuthenticating(false);
			}
		};

		handlerGoogleAuth();
	}, [response]);

	const performAuthentication = async (
		authAction: (
			auth: Auth,
			email: string,
			password: string,
		) => Promise<UserCredential>,
		data: { email: string; password: string; name?: string; city?: string },
	) => {
		try {
			setIsAuthenticating(true);
			setIsLoadingAuth(true);
			const userCredentials = await authAction(auth, data.email, data.password);
			const idToken = await userCredentials?.user.getIdToken();

			const userData: TypeUserDataToSignIn = {
				username: userCredentials?.user.displayName ?? '',
				email: userCredentials?.user.email ?? '',
				name: data.name ?? '',
				auth_type: authType,
			};

			if (authType === 'register') {
				userData.city = data.city;
			}

			await handleSignInBackend(userData, idToken, userCredentials);
		} catch (error: any) {
			if (error instanceof FirebaseError) {
				toast.show(handlerFirebaseError(error), {
					type: 'danger',
					placement: 'bottom',
					duration: 8000,
				});
			} else {
				toast.show(handlerAuthError(error), {
					type: 'danger',
					placement: 'bottom',
					duration: 8000,
				});
			}
		} finally {
			setIsLoadingAuth(false);
			setIsAuthenticating(false);
		}
	};

	const onHandleSignUp: SubmitHandler<TypeSignUpFormValuesSchema> = async (
		data,
	) => {
		if (approvedStatus === 'not approved') return;
		await performAuthentication(createUserWithEmailAndPassword, data);
	};

	const onHandleLogin: SubmitHandler<TypeLoginForm> = async (data) => {
		await performAuthentication(signInWithEmailAndPassword, data);
	};

	const onAppleButtonPress = async () => {
		setIsLoadingAuth(true);
		setIsAuthenticating(true);

		const nonce = Math.random().toString(36).substring(2, 10);

		try {
			const hashedNonce = await Crypto.digestStringAsync(
				Crypto.CryptoDigestAlgorithm.SHA256,
				nonce,
			);

			const appletAuthCredential = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
				],
				nonce: hashedNonce,
			});
			const { identityToken } = appletAuthCredential;
			const provider = new OAuthProvider('apple.com');
			const credential = provider.credential({
				idToken: identityToken!,
				rawNonce: nonce,
			});

			const userCredentials = await signInWithCredential(auth, credential);

			const idToken = await userCredentials?.user.getIdToken();

			const nameFromEmail = extractNameFromEmail(userCredentials?.user.email);

			const userData: TypeUserDataToSignIn = {
				username: userCredentials?.user.displayName ?? nameFromEmail ?? '',
				email: userCredentials?.user.email ?? '',
				name: userCredentials?.user.displayName ?? nameFromEmail ?? '',
				auth_type: authType,
			};

			if (authType === 'register') {
				userData.city = cityValue;
			}

			await handleSignInBackend(userData, idToken, userCredentials);
		} catch (error) {
			if (error instanceof FirebaseError) {
				toast.show(handlerFirebaseError(error), {
					type: 'danger',
					placement: 'bottom',
					duration: 8000,
				});
			} else {
				toast.show(handlerAuthError(error), {
					type: 'danger',
					placement: 'bottom',
					duration: 8000,
				});
			}
		} finally {
			setIsLoadingAuth(false);
			setIsAuthenticating(false);
		}
	};

	return {
		formLoginMethods,
		formSignUpMethods,
		onHandleLogin,
		onHandleSignUp,
		onAppleButtonPress,
		onGoogleButtonPress,
		approvedStatus,
	};
};
