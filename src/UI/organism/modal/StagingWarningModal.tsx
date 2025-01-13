import ConfirmModal from '@/UI/organism/modal/ConfirmModal';

type TypeStagingWarningModalProps = {
	showModal: boolean;
	setShowModal: (value: boolean) => void;
};

const StagingWarningModal = ({
	showModal,
	setShowModal,
}: TypeStagingWarningModalProps) => {
	return (
		<ConfirmModal
			showConfirmModal={showModal}
			setShowConfirmModal={setShowModal}
			questionText='You are in staging environment'
			confirmButtonText='Ok'
			onConfirm={() => {
				setShowModal(false);
			}}
			isShowCancelButton={false}
		/>
	);
};

export default StagingWarningModal;
