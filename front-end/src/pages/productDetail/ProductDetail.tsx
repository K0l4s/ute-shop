// src/components/ProductDetail.tsx
import React from 'react';

interface ProductDetailProps {
  title: string;
  author: string;
  publisher: string;
  price: number;
  discountPrice: number;
  image: string;
  stock: number;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ title, author, publisher, price, discountPrice, image, stock }) => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <div className="flex">
        {/* Product Image */}
        <img src={image} alt={title} className="w-1/3 rounded-lg" />
        
        {/* Product Info */}
        <div className="w-2/3 pl-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-gray-500">Tác giả: {author}</p>
          <p className="text-gray-500">Nhà xuất bản: {publisher}</p>
          <p className="text-gray-500">Tình trạng: {stock > 0 ? 'Còn hàng' : 'Hết hàng'}</p>

          <div className="mt-4">
            <span className="text-red-500 text-xl font-bold">{discountPrice.toLocaleString()}đ</span>
            <span className="line-through text-gray-500 ml-4">{price.toLocaleString()}đ</span>
          </div>

          <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Mua ngay</button>
          <button className="mt-4 ml-2 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300">Thêm vào giỏ hàng</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
