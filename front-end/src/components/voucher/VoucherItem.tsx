// components/VoucherItem.tsx
import React from 'react';

interface VoucherItemProps {
  id: number;
  title: string;
  desc: string;
  type: 'discount' | 'freeship';
  isSelected: boolean;
  onApply: () => void;
  onDeselect: () => void;
  onViewDetail: () => void;
}

const VoucherItem: React.FC<VoucherItemProps> = ({ id, title, desc, type, isSelected, onViewDetail, onApply, onDeselect }) => {
  console.log(id);
  return (
    <div className={`p-4 rounded ${type === 'discount' ? 'bg-yellow-100' : 'bg-green-200'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{desc}</p>
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
            <button className="bg-blue-500 text-white py-1 px-2 rounded w-20" onClick={onApply}>
              Áp dụng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherItem;
