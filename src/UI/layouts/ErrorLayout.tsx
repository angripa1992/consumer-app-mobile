import { useEffect } from 'react';

import { alertErrorToSlack } from '@/lib/helpers/slackMessage';

import { useResetValues } from '@/lib/hooks/useResetValues';
import { useAppStore } from '@/lib/store/store';
import { useShallow } from 'zustand/react/shallow';
import ErrorTemplate from '../organism/error/ErrorTemplate';
import TextElement from '../atoms/text/TextElement';

interface ErrorLayoutProps {
	resetErrorBoundary: () => void;
	error: Error;
}
const ErrorLayout = ({ resetErrorBoundary, error }: ErrorLayoutProps) => {
	const { resetGlobalValues } = useResetValues();
	const { user } = useAppStore(
		useShallow((state) => ({
			user: state.user,
		})),
	);
	const userInfo = user ? `${user.username} - ${user.email}` : 'Not exists';

	useEffect(() => {
		if (error) {
			alertErrorToSlack(error, userInfo).catch((error) => console.error(error));
		}
	}, [error]);

	const handleResetErrorBoundary = () => {
		resetGlobalValues();
		resetErrorBoundary();
	};

	return <ErrorTemplate onClickButton={handleResetErrorBoundary} />;
};

export default ErrorLayout;
