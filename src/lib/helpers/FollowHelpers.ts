import { TypeUserFollowerOrFollowing } from '../types/user';

export const sortFollowUsers = (
	followUsers?: TypeUserFollowerOrFollowing[],
	authUserId?: number,
) => {
	if (!followUsers) return [];

	const userToKeepFirst = followUsers.find(
		(followUser) => followUser.id === authUserId,
	);

	if (!userToKeepFirst) return followUsers;

	const sortedUsersWithAuthUser = [
		userToKeepFirst,
		...followUsers.filter((user) => user.id !== userToKeepFirst.id),
	];
	return sortedUsersWithAuthUser;
};
