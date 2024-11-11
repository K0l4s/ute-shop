import React from 'react';
import { IoClose } from 'react-icons/io5';
import Modal from 'react-modal';

interface TermOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermOfUseModal: React.FC<TermOfUseModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal
          isOpen={isOpen}
          onRequestClose={onClose}
          contentLabel="Điều khoản sử dụng của UTE Shop"
          className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2 mx-auto mt-20 relative"
          overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
        >
          <h2 className="text-xl font-bold mb-4">Điều khoản sử dụng của UTE Shop</h2>
          
          <p className="mb-2">
            <strong>1. Điều khoản chung</strong>
            <br />
            1.1 Bằng cách truy cập và sử dụng trang web này, bạn đồng ý tuân theo các điều khoản và điều kiện sử dụng dưới đây.
            <br />
            1.2 Chúng tôi có quyền thay đổi, bổ sung hoặc cập nhật các điều khoản này bất cứ lúc nào mà không cần thông báo trước.
          </p>
          
          <p className="mb-2">
            <strong>2. Quyền và trách nhiệm của người sử dụng</strong>
            <br />
            2.1 Người dùng cần cung cấp thông tin chính xác, đầy đủ khi đăng ký tài khoản và chịu trách nhiệm bảo mật tài khoản của mình.
            <br />
            2.2 Người dùng không được thực hiện bất kỳ hành động nào gây hại đến trang web hoặc vi phạm quyền lợi của các bên liên quan.
          </p>
    
          <p className="mb-2">
            <strong>3. Chính sách mua hàng</strong>
            <br />
            3.1 Khi thực hiện mua sách qua trang web, khách hàng cần xác nhận thông tin đơn hàng là chính xác trước khi thanh toán.
            <br />
            3.2 Đơn hàng đã thanh toán sẽ được xử lý trong khoảng thời gian xác định và sẽ không thể hủy bỏ sau khi đã xử lý xong.
          </p>
    
          <p className="mb-2">
            <strong>4. Chính sách đổi trả và hoàn tiền</strong>
            <br />
            4.1 Chúng tôi chấp nhận đổi trả sách trong các trường hợp lỗi in ấn, sai nội dung, hoặc sản phẩm hư hỏng do vận chuyển.
            <br />
            4.2 Để yêu cầu đổi trả, khách hàng cần liên hệ với chúng tôi trong vòng 7 ngày kể từ khi nhận hàng.
          </p>
    
          <p className="mb-2">
            <strong>5. Quyền sở hữu trí tuệ</strong>
            <br />
            5.1 Tất cả nội dung trên trang web này đều thuộc sở hữu của chúng tôi hoặc các nhà cung cấp nội dung được cấp phép.
            <br />
            5.2 Người dùng không được sao chép, phân phối hoặc sử dụng lại nội dung của trang web khi chưa có sự đồng ý từ chúng tôi.
          </p>
    
          <p className="mb-2">
            <strong>6. Điều khoản miễn trừ trách nhiệm</strong>
            <br />
            6.1 Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất hoặc thiệt hại nào phát sinh do việc sử dụng trang web.
          </p>
    
          <p className="mb-2">
            <strong>7. Liên hệ</strong>
            <br />
            Mọi thắc mắc hoặc khiếu nại liên quan đến các điều khoản sử dụng hoặc các chính sách của chúng tôi, vui lòng liên hệ qua email hoặc số điện thoại trên trang web.
          </p>
    
          <button
            className="absolute top-0 right-0 text-black font-bold hover:text-violet-700 px-2 py-2"
            onClick={onClose}
          >
            <IoClose size={32} />
          </button>
        </Modal>
    );    
};

export default TermOfUseModal;