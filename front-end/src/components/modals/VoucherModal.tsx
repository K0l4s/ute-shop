import React from 'react';
import Modal from 'react-modal';
import { IoClose } from 'react-icons/io5';
import VoucherItem from '../voucher/VoucherItem';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { applyVoucher, deselectVoucher } from '../../redux/reducers/voucherSlice';

Modal.setAppElement('#root');

interface VoucherModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  discountVouchers: any[];
  freeshipVouchers: any[];
}

const VoucherModal: React.FC<VoucherModalProps> = ({ isOpen, onRequestClose, discountVouchers, freeshipVouchers }) => {
  const dispatch = useDispatch();
  // const vouchers = useSelector((state: RootState) => state.voucher.availableVouchers);
  const selectedDiscountVoucherId = useSelector((state: RootState) => state.voucher.selectedDiscountVoucherId);
  const selectedFreeshipVoucherId = useSelector((state: RootState) => state.voucher.selectedFreeshipVoucherId);
  const totalPrice = useSelector((state: RootState) => state.cart.items.reduce((total, book) => {
    if (book.checked) {
      return total + (book.salePrice || book.price) * book.quantity;
    }
    return total;
  }, 0));

  const handleApply = (id: number, type: 'discount' | 'freeship', min_order_val: number) => {
    if (totalPrice >= min_order_val) {
      dispatch(applyVoucher({ id, type }));
    } else {
      alert(`Đơn hàng phải có giá trị tối thiểu là ${min_order_val} để áp dụng voucher này.`);
    }
  };

  const handleDeselect = (type: 'discount' | 'freeship') => {
    dispatch(deselectVoucher(type));
  };

  // const handleViewDetail = (id: number) => {
  //   alert(`Chi tiết voucher ${id}`);
  // };

  // Sắp xếp các voucher theo giá trị giảm giá hoặc phần trăm giảm giá theo thứ tự giảm dần
  const sortedDiscountVouchers = discountVouchers.sort((a, b) => {
    const discountA = totalPrice >= a.min_order_val ? (a.discount_val || (a.discount_perc / 100) * totalPrice) : -Infinity;
    const discountB = totalPrice >= b.min_order_val ? (b.discount_val || (b.discount_perc / 100) * totalPrice) : -Infinity;
    return discountB - discountA;
  });

  const sortedFreeshipVouchers = freeshipVouchers.sort((a, b) => {
    const discountA = totalPrice >= a.min_order_val ? (a.discount_val || (a.discount_perc / 100) * totalPrice) : -Infinity;
    const discountB = totalPrice >= b.min_order_val ? (b.discount_val || (b.discount_perc / 100) * totalPrice) : -Infinity;
    return discountB - discountA;
  });

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
          {sortedDiscountVouchers.map((voucher) => (
            <VoucherItem
              key={voucher.id}
              name={voucher.name}
              desc={voucher.desc}
              type="discount"
              isSelected={selectedDiscountVoucherId === voucher.id}
              isApplicable={totalPrice >= voucher.min_order_val}
              onApply={() => handleApply(voucher.id, 'discount', voucher.min_order_val)}
              onDeselect={() => handleDeselect('discount')}
              onViewDetail={() => {}}
            />
          ))}
        </div>
        
        {/* Section: Mã vận chuyển */}
        <div className="max-h-72 overflow-y-auto space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Mã vận chuyển</h3>
            <h3>Áp dụng tối đa 1</h3>
          </div>
          {sortedFreeshipVouchers.map((voucher) => (
            <VoucherItem
              key={voucher.id}
              name={voucher.name}
              desc={voucher.desc}
              type="freeship"
              isSelected={selectedFreeshipVoucherId === voucher.id}
              isApplicable={totalPrice >= voucher.min_order_val}
              onApply={() => handleApply(voucher.id, 'freeship', voucher.min_order_val)}
              onDeselect={() => handleDeselect('freeship')}
              onViewDetail={() => {}}
            />
          ))}
        </div>

      </div>
    </Modal>
  );
};

export default VoucherModal;
