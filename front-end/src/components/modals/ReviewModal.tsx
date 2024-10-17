import Modal from 'react-modal';
Modal.setAppElement('#root');
interface ReviewModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
}
const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onRequestClose }) => {
    return (
        <div>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded shadow-lg z-100"
            >
                Hello

            </Modal>
        </div>
    )
}

export default ReviewModal