import React, { useState } from 'react';
import { IoIosArrowForward, IoMdClose } from 'react-icons/io';
import VoucherModal from '../modals/VoucherModal';
import { getDiscountVouchers, getFreeshipVouchers } from '../../apis/voucher';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { deselectVoucher, setAvailableVouchers } from '../../redux/reducers/voucherSlice';
import { BiSolidDiscount } from 'react-icons/bi';
import { TbMapDiscount } from 'react-icons/tb';

const DiscountCode: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountVouchers, setDiscountVouchers] = useState([]);
  const [freeshipVouchers, setFreeshipVouchers] = useState([]);
  const selectedDiscountVoucherId = useSelector((state: RootState) => state.voucher.selectedDiscountVoucherId);
  const selectedFreeshipVoucherId = useSelector((state: RootState) => state.voucher.selectedFreeshipVoucherId);
  const availableVouchers = useSelector((state: RootState) => state.voucher.availableVouchers);
  const dispatch = useDispatch();

  const handleOpenModal = async () => {
    setIsModalOpen(true)

    try {
      const discountData = await getDiscountVouchers();
      const freeshipData = await getFreeshipVouchers();
      const discountVouchersWithType = discountData.data.map((voucher: any) => ({ ...voucher, type: 'discount' }));
      const freeshipVouchersWithType = freeshipData.data.map((voucher: any) => ({ ...voucher, type: 'freeship' }));
      setDiscountVouchers(discountVouchersWithType);
      setFreeshipVouchers(freeshipVouchersWithType);
      dispatch(setAvailableVouchers([...discountVouchersWithType, ...freeshipVouchersWithType]));
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const selectedDiscountVoucher = availableVouchers.find(voucher => voucher.id === selectedDiscountVoucherId && voucher.type === 'discount');
  const selectedFreeshipVoucher = availableVouchers.find(voucher => voucher.id === selectedFreeshipVoucherId && voucher.type === 'freeship');

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
        {selectedDiscountVoucher && (
          <li className="flex justify-between items-center p-2 rounded font-semibold bg-yellow-100">
            <div className="flex gap-4 items-center">
              <BiSolidDiscount size={32} />
              <div className="flex flex-col">
                <span>{selectedDiscountVoucher.name}</span>
                {selectedDiscountVoucher.discount_val ? <span>Giảm: {selectedDiscountVoucher.discount_val} VND</span> 
                  : <span>Giảm: {selectedDiscountVoucher.discount_perc}%</span>}
              </div>
            </div>
            <IoMdClose size={24} 
              className='cursor-pointer text-violet-700' 
              onClick={() => handleDeselectVoucher('discount') }/>
          </li>
        )}
        {selectedFreeshipVoucher && (
          <li className="flex justify-between items-center p-2 rounded font-semibold bg-green-200">
            <div className="flex gap-4 items-center">
              <TbMapDiscount size={32} />
              <div className="flex flex-col">
                <span>{selectedFreeshipVoucher.name}</span>
                {selectedFreeshipVoucher.discount_val ? <span>Giảm: {selectedFreeshipVoucher.discount_val} VND</span> 
                  : <span>Giảm: {selectedFreeshipVoucher.discount_perc}%</span>}
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
        onRequestClose={handleCloseModal}  
        discountVouchers={discountVouchers}
        freeshipVouchers={freeshipVouchers} />
    </div>
  );
};

export default DiscountCode;