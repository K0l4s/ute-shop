import React from 'react';

type SearchFilterProps = {
  onFilterChange: (key: string, value: string) => void;
  publishers: { id: number; name: string; address: string }[];
  selectedFilters: { price?: string; publisher?: string };
};

const SearchFilter: React.FC<SearchFilterProps> = ({ onFilterChange, publishers, selectedFilters }) => {
  console.log(publishers);
  return (
    <div className="p-4 border rounded shadow-sm w-full bg-white">
      
      <div className='mb-4'>
        <h2 className="font-bold text-xl mb-2">Lọc sách</h2>
        <div className="bg-violet-700 w-full h-0.5"></div>
      </div>
      

      {/* Lọc theo giá */}
      <div className="mb-4">
        <h3 className="font-semibold">Giá:</h3>
        <div className="flex flex-col gap-2">
          {['< 50.000', '50.000 - 100.000', '> 100.000'].map((price) => (
            <label key={price} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.price === price}
                onChange={() => onFilterChange('price', price)}
              />
              <span className="ml-2 cursor-pointer">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lọc theo nhà xuất bản */}
      <div className="mb-4">
        <h3 className="font-semibold">Nhà xuất bản:</h3>
        <div className="flex flex-col gap-2">
          {publishers.map((publisher) => (
            <label key={publisher.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedFilters.publisher === publisher.name}
                onChange={() => onFilterChange('publisher', publisher.name)}
              />
              <span className="ml-2 cursor-pointer">{publisher.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Lọc theo độ tuổi */}
      {/* <div className="mb-4">
        <h3 className="font-semibold">Độ tuổi:</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center">
            <input type="radio" name="age" value="Kids" onChange={(e) => onFilterChange(e.target.value)} />
            <span className="ml-2 cursor-pointer">1 - 6</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="age" value="Teen" onChange={(e) => onFilterChange(e.target.value)} />
            <span className="ml-2 cursor-pointer">6 - 12</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="age" value="Adult" onChange={(e) => onFilterChange(e.target.value)} />
            <span className="ml-2 cursor-pointer">12 - 16</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="age" value="Elder" onChange={(e) => onFilterChange(e.target.value)} />
            <span className="ml-2 cursor-pointer">16+</span>
          </label>
        </div>
      </div> */}
    </div>
  );
};

export default SearchFilter;
