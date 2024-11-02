import { useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { getTop10BooksAPI } from "../../apis/book";
import lifechangingbooks from "../../assets/images/life-changing-books.jpg";
import { FaChartLine } from "react-icons/fa";
import { formatStar } from "../../utils/formatStar";

interface Book {
  id: number;
  ISBN: string;
  title: string;
  desc: string;
  price: string;
  salePrice: string;
  year: string;
  stock: number;
  cover_img_url: string;
  publisher_id: number;
  author_id: number;
  category_id: number;
  avgRating: number;
  reviewCount: number;
  totalSell: number;
}

const LandingPage = () => {
  const navigate = useNavigate();
  const [top10Books, setTop10Books] = useState<Book[]>([]);

  const getTop10Books = async () => {
    try {
      const res = await getTop10BooksAPI();
      setTop10Books(res.data);
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  };

  useEffect(() => {
    getTop10Books();
  }, []);
  // formatPrioce to locale string vn-Vn
  const formatPrice = (price: string) => {
    return parseInt(price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-white py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">BÃO SALE MÙA HẠ GOM SÁCH BAO ĐÃ</h1>
          <p className="text-xl">Khám phá bộ sưu tập sách giảm giá lớn nhất ngay hôm nay!</p>
        </div>
      </section>

      {/* Product Collections */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-balck">Bộ sưu tập đáng chú ý</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-to-b from-yellow-400 to-yellow-600 p-4 
              shadow-lg rounded-lg transition-transform transform hover:scale-105">
                {/* <div className="bg-red-200 h-32 mb-2"></div> */}
                <img src={lifechangingbooks} alt="" className="object-fit object-cover h-32 mb-2 m-auto rounded-xl shadow-xl" />
                <p className="mt-2 text-center font-semibold text-white">Product {i + 1}</p>
              </div>

            ))}
          </div>
        </div>
      </section>

      {/* Best Selling Books */}
      <section className="py-10 bg-gradient-to-b from-green-500 to-green-400">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            <FaChartLine style={{display: "inline-block"}} size={40} className="mr-4"/>
            Top 10 sản phẩm Hot nhất 
          </h2>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
            spaceBetween={20}
            slidesPerView={1} // Thay đổi để phù hợp với màn hình nhỏ
            navigation
            scrollbar={{ draggable: true }}
            autoplay={{
              delay: 3000, // thời gian giữa các lần cuộn (3000ms = 3 giây)
              disableOnInteraction: false, // tiếp tục autoplay sau khi người dùng tương tác
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
          >
            {top10Books.length > 0 ? (
              top10Books.map((book) => (
                <SwiperSlide key={book.id}>
                  <div
                    className="p-4 shadow-lg rounded-lg 
                      cursor-pointer h-full justify-between bg-white"
                    onClick={() => navigate("/products/" + book.id)}
                  >
                    <div>
                      <img
                        src={book.cover_img_url}
                        alt={book.title}
                        className="w-42 min-h-[300px] max-h-[300px] mb-4 object-cover object-fit rounded-xl shadow-xl mx-auto"
                      />
                      <h3 className="font-semibold min-h-[48px]">{book.title}</h3>
                      <div>
                        <p className="text-xl text-red-500 font-semibold min-h-[24px]">
                          {book.salePrice ? `${formatPrice(book.salePrice)}` : ''}
                        </p>
                        <p className="line-through text-gray-500 min-h-[24px]">
                          {book.price ? `${formatPrice(book.price)}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className='text-2xl flex'>{formatStar(book.avgRating)}</label>
                      <p className="text-xl">({book.reviewCount})</p>
                    </div>
                    <p className="text-center mt-4">Đã bán: {book.totalSell || 0} cuốn</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-gradient-to-l from-red-600 to-blue-600 h-2.5 rounded-full"
                        style={{ width: `${Math.min((book.totalSell / book.stock) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="bg-white p-4 shadow-lg rounded-lg text-center">
                  <h3 className="font-semibold">KHÔNG CÓ DỮ LIỆU</h3>
                  <img src="https://entail-assets.com/egnition/oos-1650365564937.jpg" alt="No Data" className="h-48 mb-4" />
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </section>

      {/* Partner Publishers */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-balck">Nhà xuất bản cộng tác</h2>
          <div className="flex justify-center flex-wrap gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-4 shadow-lg rounded-lg text-center">
                <div className="bg-red-200 h-16 w-16 mx-auto mb-2"></div>
                <p>NXB Kim Đồng</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Categories */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Danh mục HOT</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white p-4 shadow-lg rounded-lg text-center transition-transform transform hover:scale-105">
                <div className="bg-blue-200 h-32 w-32 mx-auto mb-2"></div>
                <p>Danh mục {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
