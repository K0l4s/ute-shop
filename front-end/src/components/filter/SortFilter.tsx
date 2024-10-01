import React from 'react';

type SortFilterProps = {
  onSortChange: (sort: string) => void;
};

const SortFilter: React.FC<SortFilterProps> = ({ onSortChange }) => {
  return (
    <div className="p-4 shadow-sm w-full">

      {/* Sắp xếp */}
      <div className='flex w-full items-center'>
        <h3 className="font-semibold w-1/3">Sắp xếp theo</h3>
        <select className="border px-2 py-1 w-2/3 mt-2" onChange={(e) => onSortChange(e.target.value)}>
          <option value="default">Mặc định</option>
          <option value="priceAsc">Giá tăng dần</option>
          <option value="priceDesc">Giá giảm dần</option>
          <option value="stars">Số sao</option>
        </select>
      </div>
      
    </div>
  );
};

export default SortFilter;
