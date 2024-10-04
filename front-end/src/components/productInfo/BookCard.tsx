import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LoginRequired from '../modals/LoginRequired';

type BookCardProps = {
  title: string;
  desc: string;
  price: number;
  salePrice?: number;
  stars: number;
  image: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

const BookCard: React.FC<BookCardProps> = ({ title, desc, price, salePrice, stars, image, onAddToCart, onBuyNow }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginRequired(true);
    } else {
      onAddToCart();
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setShowLoginRequired(true);
    } else {
      onBuyNow();
    }
  };

  return (
    <>
      <div className="border p-4 rounded shadow-lg w-full self-start cursor-pointer">
        <img src={image} alt={title} className="w-full h-56 object-contain mb-2 rounded hover:opacity-90" />
        <h3 className="text-base font-semibold line-clamp-2 h-[50px]">{title}</h3>
        <p className="text-gray-600">{desc}</p>
        <div className="flex items-center gap-2 my-2">
          <span className="text-lg font-semibold">{salePrice ? <span className="text-violet-700 line-through">{price} đ</span> 
            : <span className='text-red-600 font-semibold text-lg'>{price} đ</span>} 
          </span>
          {salePrice && <span className="text-red-600 font-semibold text-xl">{salePrice} đ</span>}
        </div>
        <div className="flex items-center gap-1 mb-2">
          {Array(stars).fill('★').map((star, index) => (
            <span key={index} className="text-yellow-500">{star}</span>
          ))}
        </div>
        <div className="flex justify-evenly">
          <button onClick={handleAddToCart} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded mr-2">Thêm giỏ</button>
          <button onClick={handleBuyNow} className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded">Mua ngay</button>
        </div>

      </div>
      {showLoginRequired && <LoginRequired onClose={() => setShowLoginRequired(false)} />}
    </>
  );
};

export default BookCard;
