import { useShallow } from 'zustand/react/shallow';
import { useAppStore } from '@/lib/store/store';
import ProfileScreenInfo from '@/UI/organism/profile/ProfileScreenInfo';

const MyProfileScreen = () => {
	const { appUserId } = useAppStore(
		useShallow((state) => ({
			appUserId: state.user?.id,
		})),
	);

	const userId = Number(appUserId);

	return <ProfileScreenInfo userId={userId} />;
};

export default MyProfileScreen;
