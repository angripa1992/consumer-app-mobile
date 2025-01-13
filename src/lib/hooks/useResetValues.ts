import { useAppStore } from '../store/store';
import { useShallow } from 'zustand/react/shallow';

export const useResetValues = () => {
	const {
		setShowSchedulesModal,
		setSpotCandidate,
		setIsReorderingSpotListActive,
		setShowDeleteSpotListModal,
		setSpotListToUpdate,
		setIsSpotListEdit,
		setIsLoading,
		setShowProfileLogoutModal,
	} = useAppStore(
		useShallow((state) => ({
			setShowSchedulesModal: state.setShowSchedulesModal,
			setSpotCandidate: state.setSpotCandidate,
			setIsReorderingSpotListActive: state.setIsReorderingSpotListActive,
			setShowDeleteSpotListModal: state.setShowDeleteSpotListModal,
			setSpotListToUpdate: state.setSpotListToUpdate,
			setIsSpotListEdit: state.setIsSpotListEdit,
			setIsLoading: state.setIsLoading,
			setShowProfileLogoutModal: state.setShowProfileLogoutModal,
		})),
	);

	const resetGlobalValues = () => {
		setShowSchedulesModal(false);
		setSpotCandidate(null);
		setIsReorderingSpotListActive(false);
		setShowDeleteSpotListModal(false);
		setSpotListToUpdate(null);
		setIsSpotListEdit(false);
		setIsLoading(false);
		setShowProfileLogoutModal(false);
	};

	return {
		resetGlobalValues,
	};
};
