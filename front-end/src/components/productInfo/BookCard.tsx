import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import LoginRequired from '../modals/LoginRequired';
import { Link } from 'react-router-dom';
import { formatPriceToVND, formatStar, saveToHistory } from '../../utils/bookUtils';

type BookCardProps = {
  id: number;
  title: string;
  price: string;
  salePrice: string;
  cover_img_url: string;
  avgRating: number;
  reviewCount: number;
  totalSold: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
};

const BookCard: React.FC<BookCardProps> = ({ id, title, price, salePrice, cover_img_url, avgRating, reviewCount, totalSold, onAddToCart, onBuyNow }) => {
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
      <div onClick={() => saveToHistory(id)} className="border p-4 rounded shadow-lg w-full self-start cursor-pointer bg-white">
        <Link to={`/products/${id}`}>
        
        <img src={cover_img_url} alt={title} className="w-full h-56 object-contain mb-2 rounded hover:opacity-90" />
        <h3 className="text-base font-semibold line-clamp-2 h-[50px]">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{salePrice ? <span className="text-violet-700 line-through">{formatPriceToVND(price)} đ</span> 
            : <span className='text-red-600 font-semibold text-lg'>{formatPriceToVND(price)} đ</span>} 
          </span>
          {salePrice && <span className="text-red-600 font-semibold text-xl">{formatPriceToVND(salePrice)} đ</span>}
        </div>
        <div className="flex items-center">
          <label className='text-2xl flex'>{formatStar(avgRating)}</label>
          <p className="text-xl">({reviewCount})</p>
        </div>
        <h3 className="text-base font-semibold my-2">Đã bán {totalSold > 1 ? totalSold : 0}</h3>

        </Link>
        <div className="flex justify-evenly">
          <button onClick={handleAddToCart} className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 font-semibold rounded mr-2 transition duration-300">Thêm giỏ</button>
          <button onClick={handleBuyNow} className="border border-rose-600 hover:bg-rose-700 hover:text-white text-rose-700 px-6 py-2 font-semibold rounded transition duration-300">Mua ngay</button>
        </div>

      </div>
      {showLoginRequired && <LoginRequired isOpen={showLoginRequired}  onClose={() => setShowLoginRequired(false)} />}
      
    </>
  );
};

export default BookCard;
