import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/react/shallow';

import { i18nInstance } from 'config/i18n';
import { useAppStore } from '@/lib/store/store';
import { usePostTarotQuizCode } from '@/lib/hooks/useQueryWaitList';
import { postWaitListTarotQuizResponseSchema } from '@/lib/schemas/waitList';

import WaitListTarotTasteForm from '@/UI/organism/waitlist/tarot/WaitListTarotTasteForm';
import WaitListUserApproved from '@/UI/layouts/waitlist/WaitListUserApproved';
import TextElement from '@/UI/atoms/text/TextElement';
import SpinnerCup from '@/UI/atoms/spinner/SpinnerCup';

import type { TypePostWaitListTarotCodes } from '@/lib/types/waitList';
import type { AuthNavigationProp } from '@/lib/types/tabScreenParams';
import type { AxiosError } from 'axios';

const WaitListTasteTarot = () => {
	const navigation = useNavigation<AuthNavigationProp>();
	const {
		mutateAsync: postTarotQuizCode,
		isLoading: isLoadingPostTarotQuizCode,
	} = usePostTarotQuizCode();
	const { waitlistUserEmail, waitlistUserNumber } = useAppStore(
		useShallow((state) => ({
			waitlistUserEmail: state.waitlistUserEmail,
			waitlistUserNumber: state.waitlistUserNumber,
		})),
	);

	const [showApprovedMessage, setShowApprovedMessage] = useState(false);

	const onPressGoBack = () => {
		navigation.goBack();
	};

	const formMethods = useForm<TypePostWaitListTarotCodes>({
		defaultValues: {
			tarot_code: '',
		},
		resolver: zodResolver(postWaitListTarotQuizResponseSchema),
	});

	const onSubmit: SubmitHandler<TypePostWaitListTarotCodes> = async (data) => {
		try {
			if (waitlistUserEmail) {
				let dataToSend = {
					code: data.tarot_code,
					email: waitlistUserEmail,
				};

				await postTarotQuizCode(dataToSend);
				setShowApprovedMessage(true);
			}
		} catch (error) {
			const err = error as AxiosError;
			if (err.response?.status === 404) {
				formMethods.setError('tarot_code', {
					type: 'manual',
					message: i18nInstance.t('invalidTarotCode'),
				});
				return;
			}
		}
	};

	return (
		<>
			{showApprovedMessage ? (
				<WaitListUserApproved
					isShowHeader={false}
					message={
						<View>
							<TextElement textStyles='mb-3 mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
								{i18nInstance.t('thankYouForTakingTheTasteTarotQuiz', {
									number: waitlistUserNumber,
								})}
							</TextElement>
							<TextElement textStyles='mb-3 mt-4 text-center !text-white text-base font-normal tracking-[-0.70px]'>
								{i18nInstance.t('weCantWaitToSeeYouInside')}
							</TextElement>
						</View>
					}
				/>
			) : (
				<WaitListTarotTasteForm
					formMethods={formMethods}
					onSubmit={onSubmit}
					onPressGoBack={onPressGoBack}
				/>
			)}
			{isLoadingPostTarotQuizCode && <SpinnerCup />}
		</>
	);
};

export default WaitListTasteTarot;
