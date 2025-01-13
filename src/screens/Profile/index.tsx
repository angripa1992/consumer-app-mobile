import ProfileScreenInfo from '@/UI/organism/profile/ProfileScreenInfo';
import type { ProfileScreenRouteParams } from '@/lib/types/tabScreenParams';

const ProfileScreen = ({ route }: ProfileScreenRouteParams) => {
	const userId = route.params.userId;
	const isUserFollow = route.params.isFollow;

	return <ProfileScreenInfo userId={userId} isUserFollow={isUserFollow} />;
};

export default ProfileScreen;
