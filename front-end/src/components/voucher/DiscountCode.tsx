import React, { useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import VoucherModal from '../modals/VoucherModal';

const DiscountCode: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className='rounded bg-white p-4 shadow-lg'>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-violet-700">KHUYẾN MÃI (đã chọn)</h2>
        <div onClick={handleOpenModal} className="flex items-center text-violet-700 cursor-pointer hover:text-violet-500">
          <h3 className='text-sm font-semibold'>Xem thêm</h3>
          <IoIosArrowForward />
        </div>
      </div>
      
      
      <ul className="space-y-2 mt-2">
        <li className="flex justify-between items-center p-2 rounded font-semibold">
          <span>MÃ GIẢM GIÁ 30K - ĐƠN HÀNG TỪ 200K</span>
        </li>
        {/* Additional Discount Codes */}
      </ul>

      {/* Modal for selecting vouchers */}
      <VoucherModal isOpen={isModalOpen} onRequestClose={handleCloseModal} />
    </div>
  );
};

export default DiscountCode;