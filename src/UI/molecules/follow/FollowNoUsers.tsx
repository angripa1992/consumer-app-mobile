import { View } from 'react-native';

import TextElement from '@/UI/atoms/text/TextElement';

import UsersIcon from '@/UI/assets/svg/UsersIcon';

interface FollowNoUsersProps {
	isFollowing: boolean;
}

const FollowNoUsers = ({ isFollowing }: FollowNoUsersProps) => {
	const buttonTextFollow = isFollowing ? 'No Following' : 'No Followers';

	return (
		<View className=' flex flex-col flex-1  justify-center items-center h-[250px]'>
			<UsersIcon />
			<TextElement textStyles='text-white text-xl mt-3'>
				{buttonTextFollow}
			</TextElement>
		</View>
	);
};

export default FollowNoUsers;
