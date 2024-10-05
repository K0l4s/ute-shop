// components/VoucherModal.tsx
import React from 'react';
import Modal from 'react-modal';
import { IoClose } from 'react-icons/io5';
// import { IoIosArrowDown } from 'react-icons/io';
import VoucherItem from '../voucher/VoucherItem';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { applyVoucher, deselectVoucher } from '../../redux/reducers/voucherSlice';

Modal.setAppElement('#root');

interface VoucherModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

const vouchers = [
  { id: 1, title: 'MÃ GIẢM GIÁ 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách...' },
  { id: 2, title: 'MÃ FREESHIP 30K - ĐƠN HÀNG TỪ 200K', desc: 'Áp dụng cho tất cả các loại sách...' },
  { id: 3, title: 'MÃ GIẢM GIÁ 50K - ĐƠN HÀNG TỪ 300K', desc: 'Áp dụng cho sách tiếng Anh...' },
];

const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();
  const vouchers = useSelector((state: RootState) => state.voucher.availableVouchers);
  const selectedDiscountVoucherId = useSelector((state: RootState) => state.voucher.selectedDiscountVoucherId);
  const selectedFreeshipVoucherId = useSelector((state: RootState) => state.voucher.selectedFreeshipVoucherId);
  
  // Chia voucher thành 2 loại dựa trên type
  const discountVouchers = vouchers.filter(voucher => voucher.type === 'discount');
  const freeshipVouchers = vouchers.filter(voucher => voucher.type === 'freeship');

  const handleApply = (id: number, type: any) => {
    dispatch(applyVoucher({ id, type }));
  };

  const handleDeselect = (type: any) => {
    dispatch(deselectVoucher(type));
  };

  const handleViewDetail = (id: number) => {
    alert(`Chi tiết voucher ${id}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-75"
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] bg-white rounded shadow-lg"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b-2">
          <h2 className="text-xl font-bold mb-2 text-violet-700">CHỌN MÃ KHUYẾN MÃI</h2>
          <button onClick={onRequestClose} className="text-gray-600 hover:text-red-600">
            <IoClose size={26} />
          </button>
        </div>

        {/* Section: Mã giảm giá */}
        <div className="max-h-72 overflow-y-auto space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mã giảm giá</h3>
            <h3>Áp dụng tối đa 1</h3>
          </div>
          {discountVouchers.map((voucher) => (
            <VoucherItem
              key={voucher.id}
              id={voucher.id}
              title={voucher.title}
              desc={voucher.desc}
              type={voucher.type}
              isSelected={voucher.id === selectedDiscountVoucherId}
              onApply={() => handleApply(voucher.id, 'discount')}
              onDeselect={() => handleDeselect('discount')}
              onViewDetail={() => handleViewDetail(voucher.id)}
            />
          ))}
        </div>
        
        {/* Section: Mã vận chuyển */}
        <div className="max-h-72 overflow-y-auto space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mã vận chuyển</h3>
            <h3>Áp dụng tối đa 1</h3>
          </div>
          {freeshipVouchers.map((voucher) => (
            <VoucherItem
              key={voucher.id}
              id={voucher.id}
              title={voucher.title}
              desc={voucher.desc}
              type={voucher.type}
              isSelected={voucher.id === selectedFreeshipVoucherId}
              onApply={() => handleApply(voucher.id, 'freeship')}
              onDeselect={() => handleDeselect('freeship')}
              onViewDetail={() => handleViewDetail(voucher.id)}
            />
          ))}
        </div>

      </div>
    </Modal>
  );
};

export default VoucherModal;
