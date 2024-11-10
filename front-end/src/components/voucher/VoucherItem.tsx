import React from 'react';
import { BiSolidDiscount } from 'react-icons/bi';
import { TbMapDiscount } from "react-icons/tb";
import "./voucher_item.css";

interface VoucherItemProps {
  name: string;
  desc: string;
  type: 'discount' | 'freeship';
  isSelected: boolean;
  isApplicable: boolean;
  stock: number;
  onApply: () => void;
  onDeselect: () => void;
  onViewDetail: () => void;
}

const VoucherItem: React.FC<VoucherItemProps> = ({ name, desc, type, isSelected, isApplicable, stock, onViewDetail, onApply, onDeselect }) => {
  return (
    <div className={`p-4 voucher-tag rounded ${type === 'discount' ? 'bg-yellow-100' : 'bg-green-200'} `}>
      <div className="flex items-center">
        <div className="w-2/12">
          {type === 'discount' ? <BiSolidDiscount size={45} /> : <TbMapDiscount size={45} />}
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div>
            <h3 className="font-bold line-clamp-2">{name}</h3>
            <p className="text-sm text-gray-600 line-clamp-1">{desc}</p>
            <p className="text-sm font-semibold text-gray-600">Còn lại: {stock}</p>
          </div>
          <div className="flex flex-col justify-between items-center gap-y-3">
            <button className="font-semibold text-violet-700 hover:text-violet-600" onClick={onViewDetail}>
              Chi tiết
            </button>
            {isSelected ? (
              <button className="bg-white text-violet-700 border py-1 px-2 rounded w-20" onClick={onDeselect}>
                Bỏ chọn
              </button>
            ) : (
              <button className={`py-1 px-2 rounded w-20 ${isApplicable ? 'bg-blue-500 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`} onClick={isApplicable ? onApply : undefined}>
                Áp dụng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherItem;
