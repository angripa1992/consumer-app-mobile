import { View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useAppStore } from '@/lib/store/store';
import { zodResolver } from '@hookform/resolvers/zod';

import { usePostCheckReferralCode } from '@/lib/hooks/useQueryWaitList';
import { checkWaitListCodeFormSchema } from '@/lib/schemas/waitList';

import ButtonPrimary from '@/UI/atoms/button/ButtonPrimary';
import InputForm from '@/UI/atoms/input/InputForm';
import TextElement from '@/UI/atoms/text/TextElement';

import type { AxiosError } from 'axios';
import type { TypeCheckWaitListCodeForm } from '@/lib/types/waitList';

interface WaitListUseCodeFormProps {
	showApprovedMessage: boolean;
	setShowApprovedMessage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaitListUseCodeForm = ({
	setShowApprovedMessage,
	showApprovedMessage,
}: WaitListUseCodeFormProps) => {
	const { waitlistUserEmail } = useAppStore(
		useShallow((state) => ({
			waitlistUserEmail: state.waitlistUserEmail,
		})),
	);
	const { mutateAsync: checkReferralCode, isLoading } =
		usePostCheckReferralCode();

	const {
		control,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<TypeCheckWaitListCodeForm>({
		defaultValues: {
			email: waitlistUserEmail || '',
		},
		resolver: zodResolver(checkWaitListCodeFormSchema),
	});

	const onSubmit: SubmitHandler<TypeCheckWaitListCodeForm> = async (data) => {
		try {
			await checkReferralCode(data);
			setShowApprovedMessage(true);
		} catch (error) {
			const err = error as AxiosError;

			if (err.response?.status === 404) {
				setError('code', {
					type: 'manual',
					message: 'Invalid referral link. Please try again.',
				});
				return;
			}

			if (err.response?.status === 409) {
				setError('code', {
					type: 'manual',
					message: 'You have skipped the queue already.',
				});
				return;
			}

			setError('code', {
				type: 'manual',
				message: 'An error occurred. Please try again later.',
			});
		}
	};

	return (
		<View>
			<TextElement fontFamily='pachang' designVariation='main-title'>
				Hopping the Queue?
			</TextElement>
			<TextElement textStyles='my-10 text-sm text-white'>
				You have friends in high places huh? Enter their #foundingfoodie link
				below and you´ll be able to skip the waitlist.
			</TextElement>

			<InputForm
				placeholder='klikitXXXXX'
				labelStyles='text-light-white'
				control={control}
				name='code'
				placeholderTextColor='#B0B0B0'
			/>
			<ButtonPrimary
				onPress={handleSubmit(onSubmit)}
				buttonStyles={`mt-5 py-3 w-full ${isLoading ? 'opacity-50' : ''} `}
				textStyles='font-medium text-sm'
				disabled={isLoading}
				designVariation='green'
			>
				Check Link
			</ButtonPrimary>
			{errors.code && (
				<TextElement textStyles={`text-error text-sm font-bold mt-5`}>
					{errors.code.message}
				</TextElement>
			)}
		</View>
	);
};

export default WaitListUseCodeForm;
