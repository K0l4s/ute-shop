import { useEffect, useState } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
import { getTop10BooksAPI } from "../../apis/book";
import lifechangingbooks from "../../assets/images/life-changing-books.jpg";
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

  return (
    <div className=" min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-white text-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">BÃO SALE MÙA HẠ GOM SÁCH BAO ĐÃ</h1>
          <p className="text-xl">Khám phá bộ sưu tập sách giảm giá lớn nhất ngay hôm nay!</p>
        </div>
      </section>

      {/* Product Collections */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Bộ sưu tập đáng chú ý</h2>
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
      <section className="py-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Sách bán chạy</h2>
          <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={20}
            slidesPerView={1} // Thay đổi để phù hợp với màn hình nhỏ
            navigation
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2, // 2 slides cho màn hình từ 640px
              },
              768: {
                slidesPerView: 3, // 3 slides cho màn hình từ 768px
              },
              1024: {
                slidesPerView: 4, // 4 slides cho màn hình từ 1024px
              },
            }}
          >
            {top10Books.length > 0 ? (
              top10Books.map((book) => (
                <SwiperSlide key={book.id}>
                  <div
                    className="bg-gradient-to-b from-green-400 to-green-600 p-4 shadow-lg rounded-lg cursor-pointer"
                    onClick={() => navigate("/products/" + book.id)}
                  >
                    <img
                      src={book.cover_img_url}
                      alt={book.title}
                      className="w-42 h-42 mb-4 object-cover object-fit rounded-xl shadow-xl mx-auto"
                    />
                    <h3 className="font-semibold text-center">{book.title}</h3>
                    <div className="text-center">
                      <p className="text-xl text-red-500 font-semibold">{book.salePrice ? `$${book.salePrice}` : ''}</p>
                      <p className="line-through text-gray-500">{book.price ? `$${book.price}` : ''}</p>
                    </div>
                    <p className="text-center mt-2">Tổng số lượt bán: {book.totalSell || 0}/{book.stock} cuốn</p>
                    {/* Thanh progress */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className="bg-gradient-to-l from-red-600 to-blue-600  h-2.5 rounded-full"
                        style={{ width: `${Math.min((book.totalSell / book.stock) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) :
              (
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
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Nhà xuất bản cộng tác</h2>
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
