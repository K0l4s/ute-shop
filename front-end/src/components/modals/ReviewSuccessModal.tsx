import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface ReviewSuccessModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({ isOpen, onRequestClose }) => {
  const handleClose = () => {
    onRequestClose();
    window.location.reload(); // Reload the page when the modal is closed
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
      className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Đánh giá thành công</h2>
      <p className="text-center mb-6">Cảm ơn bạn đã đánh giá sản phẩm của chúng tôi!</p>
      <div className="flex justify-center">
        <button onClick={handleClose} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ReviewSuccessModal;