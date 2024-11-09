import React, { useState } from 'react';
import { IoIosArrowForward, IoMdClose } from 'react-icons/io';
import VoucherModal from '../modals/VoucherModal';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { deselectVoucher } from '../../redux/reducers/voucherSlice';
import { BiSolidDiscount } from 'react-icons/bi';
import { TbMapDiscount } from 'react-icons/tb';

interface DiscountCodeProps {
  decodedDiscountVoucher?: any;
  decodedFreeshipVoucher?: any;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({decodedDiscountVoucher, decodedFreeshipVoucher}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedDiscountVoucherId = useSelector((state: RootState) => state.voucher.selectedDiscountVoucherId);
  const selectedFreeshipVoucherId = useSelector((state: RootState) => state.voucher.selectedFreeshipVoucherId);
  const discountVouchers = useSelector((state: RootState) => state.voucher.discountVouchers);
  const freeshipVouchers = useSelector((state: RootState) => state.voucher.freeshipVouchers);
  const dispatch = useDispatch();

  const handleOpenModal = async () => {
    setIsModalOpen(true)
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const selectedDiscountVoucher = discountVouchers.find(voucher => voucher.id === selectedDiscountVoucherId && voucher.type === 'discount');
  const selectedFreeshipVoucher = freeshipVouchers.find(voucher => voucher.id === selectedFreeshipVoucherId && voucher.type === 'freeship');

  const handleDeselectVoucher = (type: 'discount' | 'freeship') => {
    dispatch(deselectVoucher(type));
  };

  return (
    <div className='rounded bg-white p-4 shadow-lg'>
      <div className="flex items-center justify-between border-b border-black">
        <h2 className="text-lg mb-2 font-bold text-violet-700">KHUYẾN MÃI (đã chọn)</h2>
        <div onClick={handleOpenModal} className="flex items-center text-violet-700 cursor-pointer hover:text-violet-500">
          <h3 className='text-sm font-semibold'>Xem thêm</h3>
          <IoIosArrowForward />
        </div>
      </div>
      
      
      <ul className="space-y-2 mt-2">
        {!selectedDiscountVoucher && !selectedFreeshipVoucher && (
          <li className="flex justify-between items-center p-2 rounded font-semibold">
            <span>Ấn xem thêm để chọn mã đi nào!!</span>
          </li>
        )}
        {(selectedDiscountVoucher || decodedDiscountVoucher) && (
          <li className="flex justify-between items-center p-2 rounded font-semibold bg-yellow-100">
            <div className="flex gap-4 items-center">
              <BiSolidDiscount size={32} />
              <div className="flex flex-col">
                <span>{(selectedDiscountVoucher || decodedDiscountVoucher)?.name}</span>
                {(selectedDiscountVoucher || decodedDiscountVoucher)?.discount_val ? <span>Giảm: {(selectedDiscountVoucher || decodedDiscountVoucher)?.discount_val} VND</span> 
                  : <span>Giảm: {(selectedDiscountVoucher || decodedDiscountVoucher)?.discount_perc}%</span>}
              </div>
            </div>
            <IoMdClose size={24} 
              className='cursor-pointer text-violet-700' 
              onClick={() => handleDeselectVoucher('discount') }/>
          </li>
        )}
        {(selectedFreeshipVoucher || decodedFreeshipVoucher) && (
          <li className="flex justify-between items-center p-2 rounded font-semibold bg-green-200">
            <div className="flex gap-4 items-center">
              <TbMapDiscount size={32} />
              <div className="flex flex-col">
                <span>{(selectedFreeshipVoucher || decodedFreeshipVoucher)?.name}</span>
                {(selectedFreeshipVoucher || decodedFreeshipVoucher)?.discount_val ? <span>Giảm: {(selectedFreeshipVoucher || decodedFreeshipVoucher)?.discount_val} VND</span> 
                  : <span>Giảm: {(selectedFreeshipVoucher || decodedFreeshipVoucher)?.discount_perc}%</span>}
              </div>
            </div>
            <IoMdClose size={24} 
              className='cursor-pointer text-violet-700' 
              onClick={() => handleDeselectVoucher('freeship') }/>
          </li>
        )}
      </ul>

      {/* Modal for selecting vouchers */}
      <VoucherModal 
        isOpen={isModalOpen} 
        onRequestClose={handleCloseModal} />
    </div>
  );
};

export default DiscountCode;