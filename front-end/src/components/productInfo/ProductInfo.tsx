import React from 'react';

const ProductInfo: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Dế Mèn Phiêu Lưu Ký</h1>
      <div className="flex items-center space-x-2">
        <span className="text-xl text-red-600 font-semibold">60.000vnd</span>
        <span className="line-through text-gray-500">80.000vnd</span>
      </div>

      <p>Nhà xuất bản: Dân Trí</p>
      <p>Năm xuất bản: 2021</p>

      <div className="flex items-center space-x-2">
        <span className="text-yellow-500">★★★★☆</span>
        <span>(25 reviews)</span>
      </div>

      <button className="bg-red-500 text-white px-4 py-2 rounded-lg">Mua ngay</button>
      <button className="bg-gray-300 text-black px-4 py-2 rounded-lg">Thêm vào giỏ hàng</button>

      <p>Thông tin vận chuyển: Giao hàng đến: TP. Hồ Chí Minh.</p>
      <p>Ưu đãi: Mã giảm phí Ship 10k.</p>
    </div>
  );
};

export default ProductInfo;
