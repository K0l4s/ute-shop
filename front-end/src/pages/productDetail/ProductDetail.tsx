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

const ProductDetail: React.FC = () => {
  const [reviewList, setReviewList] = useState<Reviews[]>([]); // Review list
  // user address from redux
  const userAddress = useSelector((state: RootState) => state.auth.user?.address + ', ' + state.auth.user?.ward + ', ' + state.auth.user?.district + ', ' + state.auth.user?.province);
  const { id } = useParams<{ id: string }>();  // Get the book ID from route params
  const [book, setBook] = useState<Book | null>(null); // Use 'Book' type or null for initial state
  const [error, setError] = useState<string | null>(null);
  const [totalRating, setTotalRating] = useState<number>(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        // console.log(response);
        const data = await response.json();
        console.log('Data:', data);
        setBook(data.data);
        setReviewList(data.data.Reviews);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchBook();
    // add cover to Images
    setTotalRating(book?.Reviews.reduce((acc, review) => acc + review.star, 0) || 0);
  }, [id]);
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

  const formatStar = (rating: number) => {
    let stars = '';
    for (let i = 0; i < rating; i++) {
      stars += '★';
    }
    for (let i = rating; i < 5; i++) {
      stars += '☆';
    }
    return stars;
  }
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
  const handleAddToCart = async () => {
    const cartItem = {
      id: book.id,
      title: book.title,
      price: book.price,
      salePrice: book.salePrice,
      // image: book.Images[0].url || "",
      image: book.cover_img_url || "",
      stars: totalRating,
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
              <SwiperSlide key={0} className='flex justify-center items-center' style={{height: "100%"}}>
                <img src={book.cover_img_url} alt="Product" className="max-h-96" />
              </SwiperSlide>
              {book.Images.map((image, index) => (
                <SwiperSlide key={index + 1} className='flex justify-center items-center' style={{height: "100%"}}>
                  <img src={image.url} alt="Product" className="max-h-96" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          {/* Right side (Product Information) */}
          <div className='rounded-xl bg-white p-6 px-8'>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              
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
                {/* <label className="text-yellow-500 text-2xl">★★★★☆</label> */}
                <label className={`text-2xl ${reviewList.length === 0 ? 'text-gray-400' : 'text-yellow-500'}`}>
                  {formatStar(totalRating)}
                </label>
                <span>({reviewList.length} đánh giá)</span>
                {/* <span>({book.Reviews.length} reviews)</span> */}
                {/* <IoCreateOutline className="text-2xl cursor-pointer hover:text-cyan-900"  /> */}
              </div>
              {book.stock > book.sold_count + 1 ?
                <div className='cursor-pointer text-base'>
                  <button className={`${book.stock > book.sold_count + 1 ? 'bg-green-600' : 'bg-gray-200'}  w-44 border-green-600 border-2 text-white px-4 py-2 rounded-lg mr-5 hover:bg-green-700`} >Mua ngay</button>
                  <button className={`${book.stock > book.sold_count + 1 ? 'border-violet-700 border-2' : 'bg-gray-200'}  w-44 text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-700 hover:text-white`} onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                </div>
                : <button className="w-44 bg-gray-300 text-black px-4 py-2 rounded-lg mr-5 disabled">Hết hàng</button>}
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
            <span className="text-5xl font-bold">{totalRating}/5</span>
            <span className="text-4xl text-yellow-500">{formatStar(totalRating)}</span>
            {/* <span>({book.Reviews.length} reviews)</span> */}
          </div>
        </div>
        {/* Review Section */}
        <ReviewSection />
        <div className='section rounded-xl bg-white p-10 mb-8'>
          <div className="flex justify-between items-center">
            <h2 className="section__title text-2xl font-semibold">Chi tiết review</h2>
            <IoCreateOutline className="text-2xl cursor-pointer hover:text-cyan-900" />
          </div>

          <Swiper modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={2}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
          >
            {reviewList.map((review, index) => (
              <SwiperSlide key={index}>
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 m-auto w-full bg-gray-100 rounded-lg">
                  <div className="p-4 ">
                    <p className="font-bold">{review.User ? (review.User.lastName + " " + review.User.firstName) : "Khách truy cập"}</p>
                    <p className="text-2xl text-yellow-500">{formatStar(review.star || 0)}</p>
                    <p>{review.content}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          {/* Thêm review */}
          <div className="rounded-xl bg-white p-10">
            <h2 className="text-2xl font-semibold">Thêm review</h2>
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
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Gửi</button>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
