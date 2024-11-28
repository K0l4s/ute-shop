import React, { useState } from 'react';
import Modal from 'react-modal';
import { Order } from '../../models/OrderType';
import { submitAllReviews } from '../../apis/review';
import { showToast } from '../../utils/toastUtils';
import ReactStars from "react-rating-stars-component";
import { IoClose } from 'react-icons/io5';
import ReviewSuccessModal from './ReviewSuccessModal';

Modal.setAppElement('#root');

interface ReviewModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  order: Order | null;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen = false, onRequestClose, order = null }) => {
  const [reviews, setReviews] = useState<{ bookId: number; content: string; star: number }[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleReviewChange = (bookId: number, content: string, star: number) => {
    setReviews((prevReviews) => {
      const existingReview = prevReviews.find((review) => review.bookId === bookId);
      if (existingReview) {
        return prevReviews.map((review) =>
          review.bookId === bookId ? { ...review, content, star } : review
        );
      } else {
        return [...prevReviews, { bookId, content, star }];
      }
    });
  };

  const handleSubmitReviews = async () => {
    if (reviews.length !== order?.orderDetails.length) {
      showToast('Vui lòng đánh giá tất cả các sản phẩm', 'error');
      return;
    }

    try {
      await submitAllReviews({ userId: order.user_id, reviews, orderId: order.id });
      showToast('Đánh giá đã được gửi thành công', 'success');
      onRequestClose();
      setIsSuccessModalOpen(true);
    } catch (error) {
      showToast('Có lỗi xảy ra khi gửi đánh giá', 'error');
    }
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center"
        className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto p-6 max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Đánh giá sản phẩm</h2>
        {order && order.orderDetails.map(detail => (
          <div key={detail.book.id} className="mb-6 flex items-start">
          <img src={detail.book.cover_img_url} alt={detail.book.title} className="w-32 h-48 object-fit rounded mr-4" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg line-clamp-3" title={detail.book.title}>{detail.book.title}</h3>
            <ReactStars
              count={5}
              size={28}
              activeColor="#ffd700"
              value={reviews.find((review) => review.bookId === detail.book.id)?.star || 0}
              onChange={(newRating: number) => handleReviewChange(detail.book.id, reviews.find((review) => review.bookId === detail.book.id)?.content || '', newRating)}
            />
            <textarea
              value={reviews.find((review) => review.bookId === detail.book.id)?.content || ''}
              onChange={(e) => handleReviewChange(detail.book.id, e.target.value, reviews.find((review) => review.bookId === detail.book.id)?.star || 0)}
              className="w-full h-32 p-3 border rounded resize-none"
              placeholder="Viết đánh giá của bạn ở đây"
            />
            
          </div>
        </div>
        ))}
        <button onClick={onRequestClose} className="absolute top-2 right-0 text-black p-1 rounded-full hover:bg-gray-400 transition duration-300">
          <IoClose size={32} />
        </button>
        <div className="flex justify-end space-x-4">
          <button onClick={handleSubmitReviews} className="font-medium bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Gửi đánh giá</button>
        </div>
      </Modal>
      <ReviewSuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};

export default ReviewModal;