import { useGetUser } from '@/lib/hooks/useQueryUser';

import HeaderGoBack from '@/UI/layouts/HeaderGoBack';

const FollowViewHeader = ({ userId }: { userId?: number | null }) => {
	const userIdNumber = Number(userId);
	const { user, isLoading } = useGetUser(userIdNumber);

	const isUserValid = user && !isLoading;
	const title = isUserValid ? user?.name : 'Loading...';

	return <HeaderGoBack title={title} />;
};

export default FollowViewHeader;
