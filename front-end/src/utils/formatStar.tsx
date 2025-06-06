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