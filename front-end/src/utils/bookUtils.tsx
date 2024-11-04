import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';

export const formatStar = (rating: number) => {
  const stars = [];
  const roundedRating = Math.round(rating * 2) / 2; // Round to the nearest half
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoIosStar key={`full-${i}`} className="text-yellow-500" />);
  }
  if (halfStar) {
    stars.push(<IoIosStarHalf key="half" className="text-yellow-500" />);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<IoIosStarOutline key={`empty-${i}`} className="text-yellow-500" />);
  }
  return stars;
};

export const formatPriceToVND = (price: any) => {
  price = parseInt(price);
  return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', '').trim();
};

export const saveToHistory = (bookId: number) => {
  const viewedBooks = JSON.parse(localStorage.getItem('viewedBooks') || '[]');
  const updatedViewedBooks = [bookId, ...viewedBooks.filter((id: number) => id !== bookId)];

  // Limit to the latest 50 IDs
  if (updatedViewedBooks.length > 50) {
    updatedViewedBooks.splice(50);
  }

  localStorage.setItem('viewedBooks', JSON.stringify(updatedViewedBooks));
};