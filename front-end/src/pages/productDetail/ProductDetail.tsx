import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import ReviewSection from '../../components/reviewSection/ReviewSection';
import { useParams } from 'react-router-dom';
import { getBookById } from '../../apis/product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import { IoCreateOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addItem } from '../../redux/reducers/cartSlice';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { createReview } from '../../apis/review';
import { CiDeliveryTruck } from "react-icons/ci";
import './product.css';
import { showToast } from '../../utils/toastUtils';
import { addToCart } from '../../apis/cart';
import Modal from 'react-modal';
import ImageViewSwiperModal from '../../components/modals/ImageViewSwiperModal';
import { formatStar } from '../../utils/bookUtils';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

interface Reviews {
  id: string,
  content: string,
  star: number,
  User: {
    firstName: string,
    lastName: string,
    avatar_url: string
  }
}
interface Book {
  id: number;
  title: string;
  ISBN: string;
  desc: string;
  price: number;
  salePrice?: number;
  year: string;
  stock: number;
  sold_count: number;
  cover_img_url: string;
  Author: { name: string };
  Publisher: { name: string };
  genres: { name: string }[];
  Reviews: Reviews[];
  Images: { url: string }[];
}

Modal.setAppElement('#root');

const ProductDetail: React.FC = () => {
  const [reviewList, setReviewList] = useState<Reviews[]>([]); // Review list
  // user address from redux
  const userAddress = useSelector((state: RootState) => state.auth.user?.address + ', ' + state.auth.user?.ward + ', ' + state.auth.user?.district + ', ' + state.auth.user?.province);
  const { id } = useParams<{ id: string }>();  // Get the book ID from route params
  const [book, setBook] = useState<Book | null>(null); // Use 'Book' type or null for initial state
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const [isFavorite, setIsFavorite] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        const data = await response.json();
        setBook(data.data);
        setReviewList(data.data.Reviews);

        // Calculate average rating
        const totalRating = data.data.Reviews.reduce((acc: number, review: Reviews) => acc + review.star, 0) || 0;
        const averageRating = totalRating / data.data.Reviews.length || 0;
        setAverageRating(parseFloat(averageRating.toFixed(1)));
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchBook();
    // add cover to Images
  }, [id]);
  
  useEffect(() => {
    if (book) {
      const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
      if (favoriteBooks.includes(book.id)) {
        setIsFavorite(true);
      }
    }
  }, [book]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  // Hàm convert số tiền ví dụ 1000 thì sẽ thành 1.000, 1000000 thành 1.000.000
  const formatMoney = (money: number) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  const submitReview = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const rating = event.currentTarget.rating.value; // Get rating from select
    const content = event.currentTarget.content.value; // Get content from textarea

    const review = {
      bookId: book.id,
      content: content,
      star: parseInt(rating), // Convert rating to an integer
    };

    createReview(review.bookId, review.content, review.star)
      .then((response) => {
        console.log('Review submitted:', response);

        // Update review list
        setReviewList([...reviewList, response.data]);
        alert('Review submitted successfully!');
      })
      .catch((err) => {
        console.error('Error submitting review:', err);
      });
  };

  const openModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const images = [book.cover_img_url, ...book.Images.map(image => image.url)];

  const handleAddToCart = async () => {
    const cartItem = {
      id: book.id,
      title: book.title,
      price: book.price,
      salePrice: book.salePrice,
      // image: book.Images[0].url || "",
      image: book.cover_img_url || "",
      stars: averageRating,
      age: "15",
      publisher: book.Publisher.name,
      quantity: 1, // Mặc định thêm 1 sản phẩm vào giỏ,
      stock: book.stock,
      checked: true, // Mặc định là đã chọn sản phẩm
    };
    dispatch(addItem(cartItem));
    try {
      await addToCart(book.id, 1);
      showToast("Thêm vào giỏ hàng thành công", "success");
    } catch (error) {
      showToast("Có lỗi xảy ra, vui lòng kiểm tra giỏ hàng", "error");
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    const favoriteBooks = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favoriteBooks.filter((favId: number) => favId !== book.id);
      localStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
    } else {
      // Add to favorites
      const updatedFavorites = [book.id, ...favoriteBooks.filter((id: number) => id !== book.id)];
      localStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
    }
  };

  return (
    <div className="font-sans">

      <main className="container mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          {/* Left side (Image and Gallery) */}
          <div className='rounded-xl bg-white md:h-128'>
            <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]}
              spaceBetween={50}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              scrollbar={{ draggable: true }}
              style={{ height: '100%' }}
            >
              {images.map((image, index) => (
                <SwiperSlide key={index} className='flex justify-center items-center' style={{height: "100%"}}>
                  <img src={image} alt="Product" className="max-h-96" onClick={() => openModal(index)}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Right side (Product Information) */}
          <div className='rounded-xl bg-white p-6 px-8'>
            <div className="space-y-4">
              <div className="relative">
                <h1 className="text-3xl font-bold">{book.title}</h1>
                <div className="relative group">
                  <div
                    className={`absolute -top-20 -right-14 p-2 border-2 border-black hover:border-rose-500 
                      hover:text-rose-500 rounded-full cursor-pointer transition duration-200 ${isFavorite ? 'text-rose-500 border-rose-500' : ''}`}
                    onClick={handleFavoriteClick}
                  >
                    {isFavorite ? <FaHeart size={32} /> : <FaRegHeart size={32} />}
                  </div>
                  <span className="tooltip opacity-0 group-hover:opacity-100 absolute -top-8 -right-44
                    transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded py-1 px-2 transition-opacity duration-300 whitespace-nowrap">
                    {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  </span>
                </div>
              </div>
              <div className="grid lg:grid-cols-2">
                <p className='font-semibold'>Nhà xuất bản: {book.Publisher?.name}</p>
                <p className='font-semibold'>Xuất bản: {book.year}</p>
              </div>
              
              <div className="grid lg:grid-cols-2">
                <p className='font-semibold'>Tác giả: {book.Author?.name}</p>
                <p className='font-semibold'>Thể loại: {book.genres.map(genre => genre.name).join(', ')}</p>
              </div>

              <p className='font-semibold text-green-600'>Tình trạng: {book.stock > book.sold_count + 1 ? 'Còn hàng' : 'Hết hàng'}</p>
              <div className="flex items-center space-x-2">
                <span className="text-3xl text-red-600 font-semibold">{formatMoney(book.salePrice || 0)} VND</span>
                <span className="line-through text-gray-500">{formatMoney(book.price || 0)} VND</span>
              </div>
              <div className="flex items-center space-x-2">
                <label className='text-2xl flex'>
                  {formatStar(averageRating)}
                </label>
                <span>({reviewList.length} đánh giá)</span>
              </div>
              {book.stock > book.sold_count + 1 ?
                <div className='cursor-pointer text-base'>
                  <button className={`${book.stock > book.sold_count + 1 ? 'bg-green-600' : 'bg-gray-200'}  w-44 font-semibold border-green-600 border-2 text-white px-4 py-2 rounded-lg mr-5 hover:bg-green-700`} >Mua ngay</button>
                  <button className={`${book.stock > book.sold_count + 1 ? 'border-violet-700 border-2' : 'bg-gray-200'}  w-44 font-semibold text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-700 hover:text-white`} onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                </div>
                : <button className="w-44 bg-gray-300 font-semibold text-black px-4 py-2 rounded-lg mr-5 cursor-not-allowed">Hết hàng</button>}
            </div>
            <div className="mt-8 flex flex-col">
              <p className='font-semibold text-base'>Thông tin vận chuyển </p>
              <div className='flex items-center gap-8 mt-2'>
                <div className=''>
                  <CiDeliveryTruck style={{display: 'inline-block', verticalAlign: 'middle'}} size={32}/>
                  <span className='ml-2 text-blue-800'>{userAddress || "TP. Hồ Chí Minh"}</span>
                </div>
                <Link to="/account/address" className='font-semibold text-violet-600 hover:text-violet-700'>Thay đổi</Link>
              </div>
              {/* <p>Ưu đãi: <Link to="/voucher/1" className='text-blue-800 underline'> Mã giảm phí Ship 10k.</Link></p> */}
            </div>
          </div>

        </div>
        
        <div className="section bg-white rounded-xl p-10 mt-8 text-lg">
          <h2 className="section__title text-2xl font-semibold">Mô tả sản phẩm</h2>
          <pre className="mt-4 whitespace-pre-wrap" style={{ fontFamily: 'inherit', fontSize: 'inherit' }}>{book.desc}</pre>
        </div>

        <div className="section mt-8 rounded-xl bg-white p-10">
          <h2 className="section__title text-2xl font-semibold">Đánh giá sản phẩm</h2>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-5xl font-bold">{averageRating}/5</span>
            <span className="text-4xl flex">{formatStar(averageRating)}</span>
            {/* <span>({book.Reviews.length} reviews)</span> */}
          </div>
        </div>
        {/* Review Section */}
        <ReviewSection />
        <div className='section rounded-xl bg-white p-10 mb-8'>
          <div className="flex justify-between items-center">
            <h2 className="section__title text-2xl font-semibold mb-4">Chi tiết đánh giá</h2>
          </div>
          {reviewList.length === 0 ? (
            <p>Chưa có đánh giá nào cho sản phẩm này.</p>
          ): (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {reviewList.map((review, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4">
                  <p className="font-bold">{review.User ? (review.User.lastName + " " + review.User.firstName) : "Khách truy cập"}</p>
                  <p className="text-2xl flex">{formatStar(review.star || 0)}</p>
                  <p>{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {/* Thêm review */}
          <div className="rounded-xl bg-white p-8">
            <div className="flex items-center gap-2">
              <IoCreateOutline className="text-2xl text-violet-700 mb-1" size={32} />
              <h2 className="text-2xl font-semibold">Thêm đánh giá</h2>
            </div>
            <form action="" className="mt-4 space-y-4" onSubmit={submitReview}>
              <div className="flex items-center space-x-4">
                <label htmlFor="rating" className="text-lg">Đánh giá</label>
                <select name="rating" id="rating" className="border border-gray-300 rounded-lg p-2 bg-white focus:outline-none">
                  <option value="5">5 sao</option>
                  <option value="4">4 sao</option>
                  <option value="3">3 sao</option>
                  <option value="2">2 sao</option>
                  <option value="1">1 sao</option>
                </select>
              </div>
              <div>
                <label htmlFor="content" className="text-lg">Nội dung</label>
                <textarea name="content" id="content" className="border border-gray-300 rounded-lg p-2 w-full h-32"></textarea>
              </div>
              <button type="submit" className="w-24 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-lg">Gửi</button>
            </form>

          </div>
        </div>
      </main>
      <ImageViewSwiperModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        images={images}
        initialSlide={selectedImageIndex}
      />
    </div>
  );
};

export default ProductDetail;
